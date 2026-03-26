import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id

  const [
    totalProperties,
    activeListings,
    totalClients,
    totalDeals,
    completedDeals,
    upcomingViewings,
    recentProperties,
    recentClients,
    dealsByStage,
  ] = await Promise.all([
    prisma.property.count({ where: { userId } }),
    prisma.property.count({ where: { userId, status: "available" } }),
    prisma.client.count({ where: { userId } }),
    prisma.deal.count({ where: { userId } }),
    prisma.deal.count({ where: { userId, stage: "completed" } }),
    prisma.viewing.count({
      where: { userId, status: "scheduled", date: { gte: new Date() } },
    }),
    prisma.property.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.client.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.deal.groupBy({
      by: ["stage"],
      where: { userId },
      _count: { id: true },
    }),
  ])

  const pipelineValue = await prisma.deal.aggregate({
    where: { userId, stage: { notIn: ["completed", "fallen-through"] } },
    _sum: { value: true },
  })

  return NextResponse.json({
    stats: {
      totalProperties,
      activeListings,
      totalClients,
      totalDeals,
      completedDeals,
      upcomingViewings,
      pipelineValue: pipelineValue._sum.value || 0,
    },
    recentProperties,
    recentClients,
    dealsByStage,
  })
}
