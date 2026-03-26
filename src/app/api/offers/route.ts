import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json([], { status: 401 })

  const offers = await prisma.offer.findMany({
    where: { userId: session.user.id },
    include: {
      property: { select: { id: true, title: true, address: true, price: true } },
      client: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(offers)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const data = await req.json()
  const offer = await prisma.offer.create({
    data: {
      ...data,
      userId: session.user.id,
    },
  })

  return NextResponse.json(offer, { status: 201 })
}
