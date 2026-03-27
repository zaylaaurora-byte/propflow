"use client"

import { useEffect, useState } from "react"
import {
  Sparkles,
  Users,
  BedDouble,
  MapPin,
  Home,
  Send,
  TrendingUp,
  Star,
  Search,
  Filter,
  Mail,
  Phone,
  Tag,
  Building2,
  ArrowRight,
  Bath,
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface MatchedProperty {
  id: string
  title: string
  address: string
  city: string
  postcode: string
  price: number
  bedrooms: number
  bathrooms: number
  type: string
  status: string
  matchScore: number
  matchedCriteria: string[]
  totalCriteria: number
}

interface ClientMatch {
  clientId: string
  clientName: string
  clientEmail: string | null
  clientPhone: string | null
  clientType: string
  minBeds: number | null
  minPrice: number | null
  maxPrice: number | null
  preferredAreas: string | null
  preferredTypes: string | null
  matches: MatchedProperty[]
}

function getScoreColor(score: number) {
  if (score >= 80) return { bar: "bg-emerald-500", text: "text-emerald-400", bg: "bg-emerald-500/10" }
  if (score >= 50) return { bar: "bg-amber-500", text: "text-amber-400", bg: "bg-amber-500/10" }
  return { bar: "bg-red-400", text: "text-red-400", bg: "bg-red-500/10" }
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

const gradientColors = [
  "from-blue-500 to-cyan-400",
  "from-purple-500 to-pink-400",
  "from-emerald-500 to-teal-400",
  "from-orange-500 to-amber-400",
  "from-rose-500 to-red-400",
  "from-indigo-500 to-violet-400",
]

function getGradient(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return gradientColors[Math.abs(hash) % gradientColors.length]
}

export default function MatchingPage() {
  const [data, setData] = useState<ClientMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "strong" | "moderate">("all")
  const [search, setSearch] = useState("")

  useEffect(() => {
    loadMatches()
  }, [])

  async function loadMatches() {
    try {
      const res = await fetch("/api/matching")
      const json = await res.json()
      setData(json)
    } catch {
      setData([])
    } finally {
      setLoading(false)
    }
  }

  // Filter data based on match quality and search
  const filtered = data
    .map((client) => {
      let filteredMatches = client.matches
      if (filter === "strong") {
        filteredMatches = client.matches.filter((m) => m.matchScore >= 80)
      } else if (filter === "moderate") {
        filteredMatches = client.matches.filter((m) => m.matchScore >= 50)
      }
      return { ...client, matches: filteredMatches }
    })
    .filter((client) => client.matches.length > 0)
    .filter((client) => {
      if (!search) return true
      const s = search.toLowerCase()
      return (
        client.clientName.toLowerCase().includes(s) ||
        client.matches.some((m) => m.title.toLowerCase().includes(s) || m.city.toLowerCase().includes(s))
      )
    })

  const totalMatches = filtered.reduce((sum, c) => sum + c.matches.length, 0)
  const clientsWithMatches = filtered.length
  const newMatchesToday = filtered.reduce(
    (sum, c) => sum + c.matches.filter((m) => m.matchScore >= 80).length,
    0
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="page-header-icon stat-icon-purple">
            <Sparkles className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">Property Matching</h1>
            <p className="text-white/50 text-sm mt-1">
              Auto-match buyers and applicants to available properties
            </p>
          </div>
        </div>
      </div>

      <div className="neon-line mt-4" />

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="stat-icon-blue p-2.5 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalMatches}</p>
              <p className="text-xs text-white/50">Total Matches</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="stat-icon-green p-2.5 rounded-lg">
              <Users className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{clientsWithMatches}</p>
              <p className="text-xs text-white/50">Clients with Matches</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="stat-icon-emerald p-2.5 rounded-lg">
              <Star className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{newMatchesToday}</p>
              <p className="text-xs text-white/50">Strong Matches (80%+)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            placeholder="Search clients or properties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 rounded-lg pl-9 pr-3 text-sm glass-input"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-white/40" />
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === "all"
                ? "bg-white/15 text-white"
                : "text-white/50 hover:text-white/70 hover:bg-white/5"
            }`}
          >
            All Matches
          </button>
          <button
            onClick={() => setFilter("strong")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === "strong"
                ? "bg-emerald-500/20 text-emerald-400"
                : "text-white/50 hover:text-white/70 hover:bg-white/5"
            }`}
          >
            Strong (80%+)
          </button>
          <button
            onClick={() => setFilter("moderate")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === "moderate"
                ? "bg-amber-500/20 text-amber-400"
                : "text-white/50 hover:text-white/70 hover:bg-white/5"
            }`}
          >
            Moderate (50%+)
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card rounded-xl p-6">
              <div className="space-y-4">
                <div className="h-10 rounded-lg animate-shimmer" />
                <div className="h-24 rounded-lg animate-shimmer" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-xl py-20 text-center">
          <Sparkles className="h-14 w-14 mx-auto text-white/15 mb-4" />
          <h3 className="text-lg font-semibold text-white/60 mb-2">No Matches Found</h3>
          <p className="text-white/40 text-sm max-w-md mx-auto">
            {data.length === 0
              ? "Add buyers or applicants with search criteria and available properties to start matching."
              : "No matches for the current filter. Try adjusting your filter settings."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((client) => (
            <div key={client.clientId} className="glass-card rounded-xl overflow-hidden">
              {/* Client Header */}
              <div className="p-5 border-b border-white/[0.06]">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-11 w-11 rounded-full bg-gradient-to-br ${getGradient(
                        client.clientName
                      )} flex items-center justify-center text-white text-sm font-bold shrink-0`}
                    >
                      {getInitials(client.clientName)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">{client.clientName}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-500/15 text-purple-400 uppercase tracking-wide">
                          {client.clientType}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        {client.clientEmail && (
                          <span className="flex items-center gap-1 text-xs text-white/40">
                            <Mail className="h-3 w-3" />
                            {client.clientEmail}
                          </span>
                        )}
                        {client.clientPhone && (
                          <span className="flex items-center gap-1 text-xs text-white/40">
                            <Phone className="h-3 w-3" />
                            {client.clientPhone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white/70">
                      {client.matches.length} match{client.matches.length !== 1 ? "es" : ""}
                    </p>
                  </div>
                </div>

                {/* Client Criteria Tags */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {client.minPrice !== null && client.maxPrice !== null && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-blue-500/10 text-blue-400">
                      <Tag className="h-3 w-3" />
                      {formatCurrency(client.minPrice)} - {formatCurrency(client.maxPrice)}
                    </span>
                  )}
                  {client.minPrice !== null && client.maxPrice === null && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-blue-500/10 text-blue-400">
                      <Tag className="h-3 w-3" />
                      From {formatCurrency(client.minPrice)}
                    </span>
                  )}
                  {client.minPrice === null && client.maxPrice !== null && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-blue-500/10 text-blue-400">
                      <Tag className="h-3 w-3" />
                      Up to {formatCurrency(client.maxPrice)}
                    </span>
                  )}
                  {client.minBeds !== null && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-purple-500/10 text-purple-400">
                      <BedDouble className="h-3 w-3" />
                      {client.minBeds}+ beds
                    </span>
                  )}
                  {client.preferredAreas && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-400">
                      <MapPin className="h-3 w-3" />
                      {client.preferredAreas}
                    </span>
                  )}
                  {client.preferredTypes && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-amber-500/10 text-amber-400">
                      <Home className="h-3 w-3" />
                      {client.preferredTypes}
                    </span>
                  )}
                </div>
              </div>

              {/* Matched Properties */}
              <div className="p-4 space-y-3">
                {client.matches.map((property) => {
                  const scoreStyle = getScoreColor(property.matchScore)
                  return (
                    <div
                      key={property.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-colors"
                    >
                      {/* Property Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-white/40 shrink-0" />
                          <h4 className="font-medium text-white truncate">{property.title}</h4>
                        </div>
                        <p className="text-xs text-white/40 mt-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {property.address}, {property.city} {property.postcode}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-sm font-semibold text-white">
                            {formatCurrency(property.price)}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-white/50">
                            <BedDouble className="h-3 w-3" />
                            {property.bedrooms} bed
                          </span>
                          <span className="flex items-center gap-1 text-xs text-white/50">
                            <Bath className="h-3 w-3" />
                            {property.bathrooms} bath
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 text-white/50 capitalize">
                            {property.type}
                          </span>
                        </div>
                      </div>

                      {/* Match Score */}
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-32 sm:w-36">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs font-medium ${scoreStyle.text}`}>
                              {property.matchScore}% match
                            </span>
                            <span className="text-[10px] text-white/30">
                              {property.matchedCriteria.length}/{property.totalCriteria}
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                            <div
                              className={`h-full rounded-full ${scoreStyle.bar} transition-all duration-500`}
                              style={{ width: `${property.matchScore}%` }}
                            />
                          </div>
                        </div>
                        <button className="btn-gradient rounded-xl px-5 py-2.5 text-sm font-semibold flex items-center gap-1.5 shrink-0">
                          <Send className="h-3.5 w-3.5" />
                          Send Match
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
