import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const data = await req.json()

  // If marking as completed, set completedAt
  if (data.completed === true) {
    data.completedAt = new Date()
  } else if (data.completed === false) {
    data.completedAt = null
  }

  const task = await prisma.task.update({
    where: { id, userId: session.user.id },
    data,
  })

  return NextResponse.json(task)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  await prisma.task.delete({
    where: { id, userId: session.user.id },
  })

  return NextResponse.json({ success: true })
}
