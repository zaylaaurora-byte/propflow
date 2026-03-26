import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const properties = await prisma.property.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(properties)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await req.json()
  const property = await prisma.property.create({
    data: { ...data, userId: session.user.id },
  })

  return NextResponse.json(property, { status: 201 })
}
