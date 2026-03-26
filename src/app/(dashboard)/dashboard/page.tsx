"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Home, Users, GitBranch, Calendar, TrendingUp, PoundSterling,
  ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, Building2, Eye,
} from "lucide-react"
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
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Loading your agency overview...</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card rounded-xl p-5">
              <div className="h-20 animate-shimmer rounded-lg" />
            </div>
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="glass-card rounded-xl p-6">
              <div className="h-48 animate-shimmer rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const stats = data?.stats

  const statCards = [
    {
      label: "Active Listings",
      value: stats?.activeListings ?? 0,
      icon: Home,
      iconClass: "stat-icon-blue",
      href: "/properties",
    },
    {
      label: "Total Clients",
      value: stats?.totalClients ?? 0,
      icon: Users,
      iconClass: "stat-icon-green",
      href: "/clients",
    },
    {
      label: "Active Deals",
      value: stats?.totalDeals ?? 0,
      icon: GitBranch,
      iconClass: "stat-icon-purple",
      href: "/pipeline",
    },
    {
      label: "Upcoming Viewings",
      value: stats?.upcomingViewings ?? 0,
      icon: Calendar,
      iconClass: "stat-icon-orange",
      href: "/viewings",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back. Here&apos;s your agency at a glance.</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/properties"
            className="glass-card rounded-lg px-4 py-2 text-sm font-medium hover:bg-white/[0.08] transition-all flex items-center gap-2"
          >
            <Home className="h-4 w-4" /> Add Listing
          </Link>
          <Link
            href="/viewings"
            className="glass-card rounded-lg px-4 py-2 text-sm font-medium hover:bg-white/[0.08] transition-all flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" /> Book Viewing
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href} className="glass-card rounded-xl p-5 group cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.iconClass}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
            </div>
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Pipeline Value + Completed Deals */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl stat-icon-green flex items-center justify-center">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Total Pipeline Value</p>
              <p className="text-3xl font-bold gradient-text">{formatCurrency(stats?.pipelineValue ?? 0)}</p>
            </div>
            <div className="text-right">
              <div className="glass rounded-lg px-3 py-1.5 inline-flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-[oklch(0.78_0.18_160)]" />
                <span className="font-semibold">{stats?.completedDeals ?? 0}</span>
                <span className="text-muted-foreground">completed</span>
              </div>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-6 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl stat-icon-cyan flex items-center justify-center">
              <PoundSterling className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Properties</p>
              <p className="text-2xl font-bold">{stats?.totalProperties ?? 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <Eye className="h-3 w-3" />
            <span>{stats?.activeListings ?? 0} currently on market</span>
          </div>
        </div>
      </div>

      {/* Recent Properties + Recent Clients */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Properties */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Building2 className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Recent Properties</h2>
            </div>
            <Link href="/properties" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="p-3">
            {data?.recentProperties.length === 0 ? (
              <div className="py-8 text-center">
                <Home className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">No properties yet</p>
                <Link href="/properties" className="text-xs text-primary hover:underline mt-1 inline-block">
                  Add your first listing
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                {data?.recentProperties.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.03] transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{p.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{p.address}</p>
                    </div>
                    <div className="text-right ml-3 flex-shrink-0">
                      <p className="font-semibold text-sm">{formatCurrency(p.price)}</p>
                      <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full border badge-${p.status}`}>
                        {p.status.replace("-", " ")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Clients */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Users className="h-5 w-5 text-[oklch(0.68_0.16_290)]" />
              <h2 className="font-semibold">Recent Clients</h2>
            </div>
            <Link href="/clients" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="p-3">
            {data?.recentClients.length === 0 ? (
              <div className="py-8 text-center">
                <Users className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">No clients yet</p>
                <Link href="/clients" className="text-xs text-primary hover:underline mt-1 inline-block">
                  Add your first contact
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                {data?.recentClients.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.03] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.68_0.16_290_/_20%)] to-[oklch(0.72_0.19_230_/_10%)] flex items-center justify-center text-xs font-bold text-[oklch(0.80_0.14_230)]">
                        {c.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.email || "No email"}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full border badge-${c.type}`}>
                        {c.type}
                      </span>
                      <p className="text-[10px] text-muted-foreground mt-1">{formatDate(c.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "New Property", href: "/properties", icon: Home, color: "stat-icon-blue" },
            { label: "New Client", href: "/clients", icon: Users, color: "stat-icon-green" },
            { label: "New Deal", href: "/pipeline", icon: GitBranch, color: "stat-icon-purple" },
            { label: "Book Viewing", href: "/viewings", icon: Calendar, color: "stat-icon-orange" },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="glass rounded-lg p-3 flex items-center gap-3 hover:bg-white/[0.06] transition-all group"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${action.color}`}>
                <action.icon className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
