import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const data = await req.json()

  const property = await prisma.property.updateMany({
    where: { id, userId: session.user.id },
    data,
  })

  if (property.count === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const updated = await prisma.property.findUnique({ where: { id } })
  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  await prisma.property.deleteMany({
    where: { id, userId: session.user.id },
  })

  return NextResponse.json({ success: true })
}
