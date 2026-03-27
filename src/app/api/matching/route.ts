import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

interface MatchedProperty {
  id: string
  title: string
  address: string
  city: string
  postcode: string
  price: number
  bedrooms: number
  bathrooms: number
  type: string
  status: string
  matchScore: number
  matchedCriteria: string[]
  totalCriteria: number
}

interface ClientMatch {
  clientId: string
  clientName: string
  clientEmail: string | null
  clientPhone: string | null
  clientType: string
  minBeds: number | null
  minPrice: number | null
  maxPrice: number | null
  preferredAreas: string | null
  preferredTypes: string | null
  matches: MatchedProperty[]
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Fetch all buyer/applicant clients with search criteria
  const clients = await prisma.client.findMany({
    where: {
      userId: session.user.id,
      type: { in: ["buyer", "applicant"] },
      OR: [
        { minBeds: { not: null } },
        { minPrice: { not: null } },
        { maxPrice: { not: null } },
        { preferredAreas: { not: null } },
        { preferredTypes: { not: null } },
      ],
    },
    orderBy: { createdAt: "desc" },
  })

  // Fetch all available properties
  const properties = await prisma.property.findMany({
    where: {
      userId: session.user.id,
      status: "available",
    },
    orderBy: { createdAt: "desc" },
  })

  // Match each client to properties
  const results: ClientMatch[] = []

  for (const client of clients) {
    const matches: MatchedProperty[] = []

    for (const property of properties) {
      const matchedCriteria: string[] = []
      let totalCriteria = 0

      // Check bedrooms: property.bedrooms >= client.minBeds
      if (client.minBeds !== null) {
        totalCriteria++
        if (property.bedrooms >= client.minBeds) {
          matchedCriteria.push("bedrooms")
        }
      }

      // Check price range: property.price >= client.minPrice AND <= client.maxPrice
      if (client.minPrice !== null) {
        totalCriteria++
        if (property.price >= client.minPrice) {
          matchedCriteria.push("minPrice")
        }
      }

      if (client.maxPrice !== null) {
        totalCriteria++
        if (property.price <= client.maxPrice) {
          matchedCriteria.push("maxPrice")
        }
      }

      // Check preferred areas (comma-separated, match against property city or address)
      if (client.preferredAreas) {
        totalCriteria++
        const areas = client.preferredAreas.split(",").map((a) => a.trim().toLowerCase())
        const propertyLocation = `${property.address} ${property.city} ${property.postcode}`.toLowerCase()
        if (areas.some((area) => propertyLocation.includes(area))) {
          matchedCriteria.push("area")
        }
      }

      // Check preferred types (comma-separated, match against property type)
      if (client.preferredTypes) {
        totalCriteria++
        const types = client.preferredTypes.split(",").map((t) => t.trim().toLowerCase())
        if (types.includes(property.type.toLowerCase())) {
          matchedCriteria.push("type")
        }
      }

      // Only include if at least one criterion matched and there are criteria to check
      if (totalCriteria > 0 && matchedCriteria.length > 0) {
        const matchScore = Math.round((matchedCriteria.length / totalCriteria) * 100)
        matches.push({
          id: property.id,
          title: property.title,
          address: property.address,
          city: property.city,
          postcode: property.postcode,
          price: property.price,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          type: property.type,
          status: property.status,
          matchScore,
          matchedCriteria,
          totalCriteria,
        })
      }
    }

    // Sort matches by score descending
    matches.sort((a, b) => b.matchScore - a.matchScore)

    if (matches.length > 0) {
      results.push({
        clientId: client.id,
        clientName: client.name,
        clientEmail: client.email,
        clientPhone: client.phone,
        clientType: client.type,
        minBeds: client.minBeds,
        minPrice: client.minPrice,
        maxPrice: client.maxPrice,
        preferredAreas: client.preferredAreas,
        preferredTypes: client.preferredTypes,
        matches,
      })
    }
  }

  // Sort clients by total number of matches descending
  results.sort((a, b) => b.matches.length - a.matches.length)

  return NextResponse.json(results)
}
