import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Create demo user
  const hashedPassword = await bcrypt.hash("demo1234", 12)
  const user = await prisma.user.upsert({
    where: { email: "demo@propflow.app" },
    update: {},
    create: {
      name: "Demo Agent",
      email: "demo@propflow.app",
      hashedPassword,
      company: "PropFlow Estates",
    },
  })

  console.log("Created demo user:", user.email)

  // Create properties
  const properties = await Promise.all([
    prisma.property.create({
      data: {
        title: "3 Bed Semi in Chelsea",
        address: "42 Kings Road",
        city: "London",
        postcode: "SW3 4PQ",
        price: 750000,
        bedrooms: 3,
        bathrooms: 2,
        sqft: 1200,
        type: "semi-detached",
        status: "available",
        description: "Stunning 3 bedroom semi-detached house in the heart of Chelsea. Recently renovated with modern kitchen and garden.",
        userId: user.id,
      },
    }),
    prisma.property.create({
      data: {
        title: "2 Bed Flat in Kensington",
        address: "15 Palace Gardens",
        city: "London",
        postcode: "W8 4QN",
        price: 520000,
        bedrooms: 2,
        bathrooms: 1,
        sqft: 850,
        type: "flat",
        status: "available",
        description: "Bright second floor flat with balcony overlooking gardens. Close to High Street Kensington station.",
        userId: user.id,
      },
    }),
    prisma.property.create({
      data: {
        title: "4 Bed Detached in Richmond",
        address: "8 Richmond Hill",
        city: "London",
        postcode: "TW10 6QX",
        price: 1250000,
        bedrooms: 4,
        bathrooms: 3,
        sqft: 2100,
        type: "detached",
        status: "under-offer",
        description: "Spacious family home with panoramic views of the Thames. Double garage and landscaped garden.",
        userId: user.id,
      },
    }),
    prisma.property.create({
      data: {
        title: "1 Bed Studio in Shoreditch",
        address: "200 Old Street",
        city: "London",
        postcode: "EC1V 9FR",
        price: 350000,
        bedrooms: 1,
        bathrooms: 1,
        sqft: 450,
        type: "flat",
        status: "available",
        description: "Modern studio apartment in trendy Shoreditch. Perfect for young professionals or investors.",
        userId: user.id,
      },
    }),
    prisma.property.create({
      data: {
        title: "5 Bed Victorian in Hampstead",
        address: "12 Flask Walk",
        city: "London",
        postcode: "NW3 1HE",
        price: 2800000,
        bedrooms: 5,
        bathrooms: 4,
        sqft: 3200,
        type: "detached",
        status: "available",
        description: "Magnificent Grade II listed Victorian property in Hampstead Village. Original features throughout.",
        userId: user.id,
      },
    }),
  ])

  console.log(`Created ${properties.length} properties`)

  // Create clients
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        name: "Sarah Johnson",
        email: "sarah.johnson@email.com",
        phone: "07700 900123",
        type: "buyer",
        budget: 800000,
        notes: "Looking for 3 bed in Chelsea or Kensington. Pre-approved mortgage.",
        userId: user.id,
      },
    }),
    prisma.client.create({
      data: {
        name: "James Williams",
        email: "james@landlord.co.uk",
        phone: "07700 900456",
        type: "seller",
        notes: "Selling 2 bed flat in Kensington. Wants quick sale.",
        userId: user.id,
      },
    }),
    prisma.client.create({
      data: {
        name: "Emma Thompson",
        email: "emma.t@gmail.com",
        phone: "07700 900789",
        type: "buyer",
        budget: 1500000,
        notes: "Relocating from Manchester. Needs family home with garden.",
        userId: user.id,
      },
    }),
    prisma.client.create({
      data: {
        name: "David Chen",
        email: "d.chen@investment.com",
        phone: "07700 900321",
        type: "buyer",
        budget: 400000,
        notes: "Investor looking for rental yield properties. Cash buyer.",
        userId: user.id,
      },
    }),
    prisma.client.create({
      data: {
        name: "Lucy Palmer",
        email: "lucy.p@hotmail.com",
        phone: "07700 900654",
        type: "tenant",
        budget: 2000,
        notes: "Looking for 1-2 bed rental in East London. Has references.",
        userId: user.id,
      },
    }),
  ])

  console.log(`Created ${clients.length} clients`)

  // Create deals
  const deals = await Promise.all([
    prisma.deal.create({
      data: {
        stage: "viewing-booked",
        value: 750000,
        notes: "Viewing scheduled for next Tuesday at 2pm",
        propertyId: properties[0].id,
        clientId: clients[0].id,
        userId: user.id,
      },
    }),
    prisma.deal.create({
      data: {
        stage: "offer-accepted",
        value: 1250000,
        notes: "Offer of £1.25M accepted. Solicitors instructed.",
        propertyId: properties[2].id,
        clientId: clients[2].id,
        userId: user.id,
      },
    }),
    prisma.deal.create({
      data: {
        stage: "new-lead",
        value: 350000,
        notes: "Enquired via website. Interested in Shoreditch studio.",
        propertyId: properties[3].id,
        clientId: clients[3].id,
        userId: user.id,
      },
    }),
    prisma.deal.create({
      data: {
        stage: "offer-made",
        value: 500000,
        notes: "Offered £500K on Kensington flat. Awaiting response.",
        propertyId: properties[1].id,
        clientId: clients[0].id,
        userId: user.id,
      },
    }),
  ])

  console.log(`Created ${deals.length} deals`)

  // Create viewings
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)

  const viewings = await Promise.all([
    prisma.viewing.create({
      data: {
        date: tomorrow,
        time: "14:00",
        notes: "First viewing. Client very interested.",
        status: "scheduled",
        propertyId: properties[0].id,
        clientId: clients[0].id,
        userId: user.id,
      },
    }),
    prisma.viewing.create({
      data: {
        date: nextWeek,
        time: "10:30",
        notes: "Second viewing with partner.",
        status: "scheduled",
        propertyId: properties[4].id,
        clientId: clients[2].id,
        userId: user.id,
      },
    }),
    prisma.viewing.create({
      data: {
        date: new Date(Date.now() - 86400000 * 3),
        time: "11:00",
        notes: "Client loved the property. Made offer same day.",
        status: "completed",
        propertyId: properties[2].id,
        clientId: clients[2].id,
        userId: user.id,
      },
    }),
  ])

  console.log(`Created ${viewings.length} viewings`)
  console.log("\nDemo account: demo@propflow.app / demo1234")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
