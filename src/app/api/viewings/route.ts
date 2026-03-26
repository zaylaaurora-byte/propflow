import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const viewings = await prisma.viewing.findMany({
    where: { userId: session.user.id },
    include: { property: true, client: true },
    orderBy: { date: "asc" },
  })

  return NextResponse.json(viewings)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await req.json()
  const viewing = await prisma.viewing.create({
    data: { ...data, userId: session.user.id },
    include: { property: true, client: true },
  })

  return NextResponse.json(viewing, { status: 201 })
}
