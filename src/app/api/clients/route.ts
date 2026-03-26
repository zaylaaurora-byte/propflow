import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const clients = await prisma.client.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { deals: true, viewings: true } } },
  })

  return NextResponse.json(clients)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await req.json()
  const client = await prisma.client.create({
    data: { ...data, userId: session.user.id },
  })

  return NextResponse.json(client, { status: 201 })
}
