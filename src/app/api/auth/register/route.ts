import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { name, email, password, company } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: { name, email, hashedPassword, company },
    })

    return NextResponse.json(
      { id: user.id, name: user.name, email: user.email },
      { status: 201 }
    )
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
