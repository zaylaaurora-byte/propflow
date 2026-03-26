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
      phone: "020 7946 0958",
    },
  })

  console.log("Created demo user:", user.email)

  // Create properties with enhanced fields
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
        tenure: "freehold",
        epcRating: "C",
        councilTaxBand: "F",
        parking: "driveway",
        garden: "rear",
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
        tenure: "leasehold",
        epcRating: "B",
        councilTaxBand: "E",
        parking: "none",
        garden: "none",
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
        tenure: "freehold",
        epcRating: "D",
        councilTaxBand: "G",
        parking: "garage",
        garden: "both",
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
        tenure: "leasehold",
        epcRating: "B",
        councilTaxBand: "C",
        parking: "none",
        garden: "none",
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
        tenure: "freehold",
        epcRating: "D",
        councilTaxBand: "H",
        parking: "driveway",
        garden: "both",
        description: "Magnificent Grade II listed Victorian property in Hampstead Village. Original features throughout.",
        userId: user.id,
      },
    }),
  ])

  console.log(`Created ${properties.length} properties`)

  // Create clients with enhanced fields
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        name: "Sarah Johnson",
        email: "sarah.johnson@email.com",
        phone: "07700 900123",
        type: "buyer",
        budget: 600000,
        budgetMax: 800000,
        source: "rightmove",
        preferredContact: "email",
        minBeds: 3,
        minPrice: 600000,
        maxPrice: 800000,
        preferredAreas: "Chelsea, Kensington, Fulham",
        preferredTypes: "semi-detached, terraced",
        idVerified: true,
        amlChecked: true,
        gdprConsent: true,
        consentDate: new Date(),
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
        source: "referral",
        preferredContact: "phone",
        idVerified: true,
        amlChecked: false,
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
        budget: 1000000,
        budgetMax: 1500000,
        source: "website",
        preferredContact: "whatsapp",
        minBeds: 4,
        minPrice: 1000000,
        maxPrice: 1500000,
        preferredAreas: "Richmond, Hampstead, Wimbledon",
        preferredTypes: "detached",
        idVerified: true,
        amlChecked: true,
        gdprConsent: true,
        consentDate: new Date(),
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
        budget: 300000,
        budgetMax: 400000,
        source: "walk-in",
        preferredContact: "email",
        minBeds: 1,
        minPrice: 250000,
        maxPrice: 400000,
        preferredAreas: "Shoreditch, Hackney, Bethnal Green",
        preferredTypes: "flat",
        idVerified: false,
        amlChecked: false,
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
        source: "zoopla",
        preferredContact: "phone",
        gdprConsent: true,
        consentDate: new Date(),
        notes: "Looking for 1-2 bed rental in East London. Has references.",
        userId: user.id,
      },
    }),
  ])

  console.log(`Created ${clients.length} clients`)

  // Create deals with enhanced fields
  const deals = await Promise.all([
    prisma.deal.create({
      data: {
        stage: "viewing-booked",
        value: 750000,
        fee: 11250,
        feePercent: 1.5,
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
        fee: 18750,
        feePercent: 1.5,
        solicitor: "Smith & Partners, 020 7946 1234",
        mortgage: "Halifax, Ref: HAL-789",
        notes: "Offer of 1.25M accepted. Solicitors instructed.",
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
        fee: 7500,
        feePercent: 1.5,
        notes: "Offered 500K on Kensington flat. Awaiting response.",
        propertyId: properties[1].id,
        clientId: clients[0].id,
        userId: user.id,
      },
    }),
  ])

  console.log(`Created ${deals.length} deals`)

  // Create viewings with enhanced fields
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
        feedback: "Very impressed with the garden and views. Wants to proceed.",
        rating: 5,
        status: "completed",
        propertyId: properties[2].id,
        clientId: clients[2].id,
        userId: user.id,
      },
    }),
  ])

  console.log(`Created ${viewings.length} viewings`)

  // Create offers
  const offers = await Promise.all([
    prisma.offer.create({
      data: {
        amount: 1250000,
        status: "accepted",
        conditions: "Subject to survey",
        notes: "Full asking price offer",
        propertyId: properties[2].id,
        clientId: clients[2].id,
        dealId: deals[1].id,
        userId: user.id,
      },
    }),
    prisma.offer.create({
      data: {
        amount: 500000,
        status: "pending",
        conditions: "Chain free, mortgage approved",
        notes: "Below asking - vendor considering",
        propertyId: properties[1].id,
        clientId: clients[0].id,
        dealId: deals[3].id,
        userId: user.id,
      },
    }),
  ])

  console.log(`Created ${offers.length} offers`)

  // Create tasks
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        title: "Follow up with Sarah Johnson re Chelsea viewing",
        description: "Call to confirm viewing time and discuss mortgage status",
        dueDate: tomorrow,
        priority: "high",
        category: "follow-up",
        userId: user.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Chase solicitors for Richmond property",
        description: "Need update on searches and mortgage offer",
        dueDate: new Date(Date.now() + 86400000 * 2),
        priority: "urgent",
        category: "follow-up",
        userId: user.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "AML check for David Chen",
        description: "Need ID verification and proof of funds for cash buyer",
        dueDate: nextWeek,
        priority: "high",
        category: "compliance",
        userId: user.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Update Hampstead listing photos",
        description: "Professional photographer booked for Thursday",
        dueDate: new Date(Date.now() + 86400000 * 4),
        priority: "medium",
        category: "general",
        userId: user.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Review tenant references for Lucy Palmer",
        priority: "medium",
        category: "compliance",
        userId: user.id,
      },
    }),
  ])

  console.log(`Created ${tasks.length} tasks`)

  // Create activities
  const activities = await Promise.all([
    prisma.activity.create({
      data: {
        type: "call",
        title: "Called Sarah about Chelsea property",
        description: "Discussed property details, she wants to view ASAP",
        clientId: clients[0].id,
        propertyId: properties[0].id,
        userId: user.id,
      },
    }),
    prisma.activity.create({
      data: {
        type: "email",
        title: "Sent brochure to Emma Thompson",
        description: "Emailed full property details for Richmond and Hampstead homes",
        clientId: clients[2].id,
        userId: user.id,
      },
    }),
    prisma.activity.create({
      data: {
        type: "viewing",
        title: "Completed viewing at Richmond Hill",
        description: "Emma very impressed. Offer expected within 24 hours.",
        clientId: clients[2].id,
        propertyId: properties[2].id,
        userId: user.id,
      },
    }),
    prisma.activity.create({
      data: {
        type: "offer",
        title: "Offer received on Kensington flat",
        description: "Sarah offered 500K. Vendor wants 520K. Negotiating.",
        clientId: clients[0].id,
        propertyId: properties[1].id,
        userId: user.id,
      },
    }),
    prisma.activity.create({
      data: {
        type: "note",
        title: "David Chen - investor meeting",
        description: "Met to discuss investment strategy. Interested in 1 bed flats for rental yield. Cash buyer.",
        clientId: clients[3].id,
        userId: user.id,
      },
    }),
  ])

  console.log(`Created ${activities.length} activities`)
  console.log("\nDemo account: demo@propflow.app / demo1234")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
