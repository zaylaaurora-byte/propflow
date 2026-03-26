"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, GitBranch, Calendar, TrendingUp, Home } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"

interface DashboardData {
  stats: {
    totalProperties: number
    activeListings: number
    totalClients: number
    totalDeals: number
    completedDeals: number
    upcomingViewings: number
    pipelineValue: number
  }
  recentProperties: Array<{
    id: string
    title: string
    address: string
    price: number
    status: string
    createdAt: string
  }>
  recentClients: Array<{
    id: string
    name: string
    type: string
    email: string
    createdAt: string
  }>
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-16 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const stats = data?.stats

  const statCards = [
    { label: "Active Listings", value: stats?.activeListings ?? 0, icon: Home, color: "text-blue-600" },
    { label: "Total Clients", value: stats?.totalClients ?? 0, icon: Users, color: "text-green-600" },
    { label: "Active Deals", value: stats?.totalDeals ?? 0, icon: GitBranch, color: "text-purple-600" },
    { label: "Upcoming Viewings", value: stats?.upcomingViewings ?? 0, icon: Calendar, color: "text-orange-600" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your agency activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color} opacity-80`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pipeline Value */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 text-green-700 w-12 h-12 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pipeline Value</p>
              <p className="text-2xl font-bold">{formatCurrency(stats?.pipelineValue ?? 0)}</p>
            </div>
            <div className="ml-auto">
              <Badge variant="secondary">{stats?.completedDeals ?? 0} deals completed</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Properties */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5" /> Recent Properties
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data?.recentProperties.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">
                No properties yet. Add your first listing!
              </p>
            ) : (
              <div className="space-y-3">
                {data?.recentProperties.map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium text-sm">{p.title}</p>
                      <p className="text-xs text-muted-foreground">{p.address}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{formatCurrency(p.price)}</p>
                      <Badge variant={p.status === "available" ? "default" : "secondary"} className="text-xs">
                        {p.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Clients */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" /> Recent Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data?.recentClients.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">
                No clients yet. Add your first contact!
              </p>
            ) : (
              <div className="space-y-3">
                {data?.recentClients.map((c) => (
                  <div key={c.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium text-sm">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.email}</p>
                    </div>
                    <div>
                      <Badge variant="outline" className="text-xs capitalize">{c.type}</Badge>
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(c.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
