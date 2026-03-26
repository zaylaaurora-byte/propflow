import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json([], { status: 401 })

  const activities = await prisma.activity.findMany({
    where: { userId: session.user.id },
    include: {
      property: { select: { id: true, title: true } },
      client: { select: { id: true, name: true } },
      deal: { select: { id: true, stage: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  })

  return NextResponse.json(activities)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const data = await req.json()
  const activity = await prisma.activity.create({
    data: {
      ...data,
      userId: session.user.id,
    },
  })

  return NextResponse.json(activity, { status: 201 })
}
