import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const deals = await prisma.deal.findMany({
    where: { userId: session.user.id },
    include: { client: true, property: true },
    orderBy: { updatedAt: "desc" },
  })

  return NextResponse.json(deals)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await req.json()
  const deal = await prisma.deal.create({
    data: { ...data, userId: session.user.id },
    include: { client: true, property: true },
  })

  return NextResponse.json(deal, { status: 201 })
}
