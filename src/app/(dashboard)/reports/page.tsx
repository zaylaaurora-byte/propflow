"use client"

import { useEffect, useState } from "react"
import {
  BarChart3, TrendingUp, Home, Users, PoundSterling, Calendar,
  GitBranch, Eye, ArrowUpRight, ArrowDownRight, Target, Award,
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface ReportData {
  stats: {
    totalProperties: number
    activeListings: number
    totalClients: number
    totalDeals: number
    completedDeals: number
    upcomingViewings: number
    pipelineValue: number
  }
}

export default function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false))
  }, [])

  const stats = data?.stats

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Reports</h1>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card rounded-xl p-6 h-32 animate-shimmer" />
          ))}
        </div>
      </div>
    )
  }

  const completionRate = (stats?.totalDeals ?? 0) > 0
    ? Math.round(((stats?.completedDeals ?? 0) / (stats?.totalDeals ?? 1)) * 100)
    : 0

  const avgDealValue = (stats?.completedDeals ?? 0) > 0
    ? (stats?.pipelineValue ?? 0) / Math.max(stats?.totalDeals ?? 1, 1)
    : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Agency performance overview</p>
        </div>
        <div className="glass rounded-lg px-3 py-1.5 text-xs text-muted-foreground">
          Live data
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl stat-icon-blue flex items-center justify-center">
              <PoundSterling className="h-5 w-5" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </div>
          <p className="text-2xl font-bold gradient-text">{formatCurrency(stats?.pipelineValue ?? 0)}</p>
          <p className="text-xs text-muted-foreground mt-1">Pipeline Value</p>
        </div>

        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl stat-icon-green flex items-center justify-center">
              <Target className="h-5 w-5" />
            </div>
            <span className="text-xs text-green-400 font-medium">{completionRate}%</span>
          </div>
          <p className="text-2xl font-bold">{stats?.completedDeals ?? 0}</p>
          <p className="text-xs text-muted-foreground mt-1">Deals Completed</p>
        </div>

        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl stat-icon-purple flex items-center justify-center">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(avgDealValue)}</p>
          <p className="text-xs text-muted-foreground mt-1">Avg Deal Value</p>
        </div>

        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl stat-icon-orange flex items-center justify-center">
              <Eye className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-bold">{stats?.upcomingViewings ?? 0}</p>
          <p className="text-xs text-muted-foreground mt-1">Upcoming Viewings</p>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Property Stats */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="p-5 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <Home className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Property Overview</h2>
            </div>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Properties</span>
              <span className="text-sm font-bold">{stats?.totalProperties ?? 0}</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[oklch(0.72_0.19_230)] to-[oklch(0.68_0.16_290)] h-2 rounded-full transition-all"
                style={{ width: `${Math.min(((stats?.activeListings ?? 0) / Math.max(stats?.totalProperties ?? 1, 1)) * 100, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active Listings</span>
              <span className="text-sm font-bold text-primary">{stats?.activeListings ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Off Market</span>
              <span className="text-sm font-bold">{(stats?.totalProperties ?? 0) - (stats?.activeListings ?? 0)}</span>
            </div>
          </div>
        </div>

        {/* Deal Pipeline */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="p-5 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <GitBranch className="h-5 w-5 text-[oklch(0.68_0.16_290)]" />
              <h2 className="font-semibold">Deal Pipeline</h2>
            </div>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Deals</span>
              <span className="text-sm font-bold">{stats?.totalDeals ?? 0}</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[oklch(0.78_0.18_160)] to-[oklch(0.72_0.19_230)] h-2 rounded-full transition-all"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completion Rate</span>
              <span className="text-sm font-bold text-[oklch(0.78_0.18_160)]">{completionRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active in Pipeline</span>
              <span className="text-sm font-bold">{(stats?.totalDeals ?? 0) - (stats?.completedDeals ?? 0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Client & Viewing Stats */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl stat-icon-green flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">Client Base</p>
              <p className="text-xs text-muted-foreground">Total contacts</p>
            </div>
          </div>
          <p className="text-4xl font-bold">{stats?.totalClients ?? 0}</p>
        </div>

        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl stat-icon-orange flex items-center justify-center">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">Viewings</p>
              <p className="text-xs text-muted-foreground">Scheduled</p>
            </div>
          </div>
          <p className="text-4xl font-bold">{stats?.upcomingViewings ?? 0}</p>
        </div>

        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl stat-icon-cyan flex items-center justify-center">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">Conversion</p>
              <p className="text-xs text-muted-foreground">Deals from listings</p>
            </div>
          </div>
          <p className="text-4xl font-bold">
            {(stats?.totalProperties ?? 0) > 0
              ? Math.round(((stats?.totalDeals ?? 0) / (stats?.totalProperties ?? 1)) * 100)
              : 0}%
          </p>
        </div>
      </div>
    </div>
  )
}
