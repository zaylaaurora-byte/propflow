"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Home, Users, GitBranch, Calendar, TrendingUp, PoundSterling,
  ArrowUpRight, Clock, CheckCircle2, Building2, Eye,
  LayoutDashboard, Sparkles, FileText, Target, Zap, Bell,
  ChevronRight, Activity, Star, Rocket, AlertTriangle,
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
        <div className="flex items-center gap-4">
          <div className="page-header-icon stat-icon-blue">
            <LayoutDashboard className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold gradient-text">Dashboard</h1>
            <p className="text-muted-foreground">Loading your agency overview...</p>
          </div>
        </div>
        <div className="neon-line" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-fade">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-6">
              <div className="h-24 animate-shimmer rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const stats = data?.stats
  const estimatedFees = (stats?.pipelineValue ?? 0) * 0.015
  const activePipeline = (stats?.totalDeals ?? 0) - (stats?.completedDeals ?? 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="page-header-icon stat-icon-blue pulse-ring rounded-xl">
            <LayoutDashboard className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold gradient-text">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back. Here&apos;s your agency at a glance.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            href="/properties"
            className="btn-gradient rounded-xl px-5 py-2.5 text-sm font-bold flex items-center gap-2"
          >
            <Home className="h-4 w-4" /> Add Listing
          </Link>
          <Link
            href="/viewings"
            className="glass rounded-xl px-5 py-2.5 text-sm font-bold flex items-center gap-2 hover:bg-white/[0.08] transition-all"
          >
            <Calendar className="h-4 w-4" /> Book Viewing
          </Link>
        </div>
      </div>
      <div className="neon-line" />

      {/* Hero Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-fade">
        {[
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
        ].map((stat) => (
          <Link key={stat.label} href={stat.href} className="glass-card rounded-2xl p-6 group cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.iconClass} transition-transform group-hover:scale-110`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <p className="stat-number counter-up">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-2 font-semibold">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Pipeline Value + Revenue Forecast */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-hero rounded-2xl p-7">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl stat-icon-green flex items-center justify-center">
              <TrendingUp className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground font-semibold mb-1">Total Pipeline Value</p>
              <p className="stat-number-xl gradient-text">{formatCurrency(stats?.pipelineValue ?? 0)}</p>
            </div>
            <div className="text-right space-y-2">
              <div className="glass rounded-xl px-4 py-2 inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[oklch(0.80_0.20_160)]" />
                <span className="font-extrabold text-lg">{stats?.completedDeals ?? 0}</span>
                <span className="text-xs text-muted-foreground">completed</span>
              </div>
              <div className="glass rounded-xl px-4 py-2 inline-flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="font-extrabold text-lg">{activePipeline}</span>
                <span className="text-xs text-muted-foreground">active</span>
              </div>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-7 flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl stat-icon-purple flex items-center justify-center">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-semibold">Est. Fees</p>
              <p className="text-2xl font-extrabold gradient-text">{formatCurrency(estimatedFees)}</p>
            </div>
          </div>
          <div>
            <div className="w-full bg-white/5 rounded-full h-2.5 mb-2">
              <div
                className="bg-gradient-to-r from-[oklch(0.70_0.20_290)] to-[oklch(0.74_0.22_230)] h-2.5 rounded-full shadow-[0_0_12px_oklch(0.70_0.20_290/0.5)]"
                style={{ width: `${Math.min((activePipeline / Math.max(stats?.totalDeals ?? 1, 1)) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">Based on 1.5% avg commission</p>
          </div>
        </div>
      </div>

      {/* Recent Properties + Clients */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Properties */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg stat-icon-blue flex items-center justify-center">
                <Building2 className="h-5 w-5" />
              </div>
              <h2 className="font-extrabold text-base">Recent Properties</h2>
            </div>
            <Link href="/properties" className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="p-3">
            {data?.recentProperties.length === 0 ? (
              <div className="py-10 text-center">
                <div className="empty-state-icon">
                  <Home className="h-7 w-7 text-muted-foreground/40" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">No properties yet</p>
                <Link href="/properties" className="text-xs text-primary font-bold hover:underline">
                  Add your first listing
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                {data?.recentProperties.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3.5 rounded-xl hover:bg-white/[0.04] transition-colors group">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate group-hover:text-primary transition-colors">{p.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{p.address}</p>
                    </div>
                    <div className="text-right ml-3 flex-shrink-0">
                      <p className="font-extrabold text-sm gradient-text">{formatCurrency(p.price)}</p>
                      <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border badge-${p.status}`}>
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
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg stat-icon-purple flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
              <h2 className="font-extrabold text-base">Recent Clients</h2>
            </div>
            <Link href="/clients" className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="p-3">
            {data?.recentClients.length === 0 ? (
              <div className="py-10 text-center">
                <div className="empty-state-icon">
                  <Users className="h-7 w-7 text-muted-foreground/40" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">No clients yet</p>
                <Link href="/clients" className="text-xs text-primary font-bold hover:underline">
                  Add your first contact
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                {data?.recentClients.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3.5 rounded-xl hover:bg-white/[0.04] transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[oklch(0.70_0.20_290_/_25%)] to-[oklch(0.74_0.22_230_/_15%)] flex items-center justify-center text-xs font-extrabold text-primary">
                        {c.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-sm group-hover:text-primary transition-colors">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.email || "No email"}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border badge-${c.type}`}>
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

      {/* Quick Actions — BOLD */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-xs font-extrabold text-muted-foreground mb-5 uppercase tracking-widest">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 stagger-fade">
          {[
            { label: "New Property", href: "/properties", icon: Home, color: "stat-icon-blue" },
            { label: "New Client", href: "/clients", icon: Users, color: "stat-icon-green" },
            { label: "New Deal", href: "/pipeline", icon: GitBranch, color: "stat-icon-purple" },
            { label: "Book Viewing", href: "/viewings", icon: Calendar, color: "stat-icon-orange" },
            { label: "Match Buyers", href: "/matching", icon: Sparkles, color: "stat-icon-pink" },
            { label: "Documents", href: "/documents", icon: FileText, color: "stat-icon-emerald" },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="glass rounded-xl p-4 flex flex-col items-center gap-3 hover:bg-white/[0.06] transition-all group text-center"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.color} transition-transform group-hover:scale-110`}>
                <action.icon className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
