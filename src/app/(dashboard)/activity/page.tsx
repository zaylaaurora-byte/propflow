"use client"

import { useEffect, useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Plus, ClipboardList, Phone, Mail, FileText, Eye, PoundSterling,
  RefreshCw, Calendar, MessageSquare, Search, Filter,
} from "lucide-react"
import { formatDate } from "@/lib/utils"

interface Activity {
  id: string
  type: string
  title: string
  description: string | null
  property: { id: string; title: string } | null
  client: { id: string; name: string } | null
  deal: { id: string; stage: string } | null
  createdAt: string
}

interface Client { id: string; name: string }
interface Property { id: string; title: string }

const typeConfig: Record<string, { icon: typeof Phone; color: string; label: string }> = {
  call: { icon: Phone, color: "stat-icon-blue", label: "Phone Call" },
  email: { icon: Mail, color: "stat-icon-green", label: "Email" },
  note: { icon: FileText, color: "stat-icon-purple", label: "Note" },
  viewing: { icon: Eye, color: "stat-icon-orange", label: "Viewing" },
  offer: { icon: PoundSterling, color: "stat-icon-cyan", label: "Offer" },
  "status-change": { icon: RefreshCw, color: "stat-icon-pink", label: "Status Change" },
  task: { icon: ClipboardList, color: "stat-icon-blue", label: "Task" },
  meeting: { icon: Calendar, color: "stat-icon-green", label: "Meeting" },
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState("all")

  useEffect(() => {
    Promise.all([
      fetch("/api/activities").then((r) => r.json()),
      fetch("/api/clients").then((r) => r.json()),
      fetch("/api/properties").then((r) => r.json()),
    ]).then(([a, c, p]) => {
      setActivities(a)
      setClients(c)
      setProperties(p)
      setLoading(false)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await fetch("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: formData.get("type"),
        title: formData.get("title"),
        description: formData.get("description") || null,
        clientId: formData.get("clientId") || null,
        propertyId: formData.get("propertyId") || null,
      }),
    })
    setDialogOpen(false)
    const res = await fetch("/api/activities")
    setActivities(await res.json())
  }

  const filtered = activities.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      (a.client?.name.toLowerCase().includes(search.toLowerCase()) ?? false)
    const matchesType = filterType === "all" || a.type === filterType
    return matchesSearch && matchesType
  })

  // Group activities by date
  const grouped = filtered.reduce<Record<string, Activity[]>>((acc, activity) => {
    const date = new Date(activity.createdAt).toLocaleDateString("en-GB", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    })
    if (!acc[date]) acc[date] = []
    acc[date].push(activity)
    return acc
  }, {})

  // Activity type count summary
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    filtered.forEach((a) => {
      const label = typeConfig[a.type]?.label || a.type
      counts[label] = (counts[label] || 0) + 1
    })
    return counts
  }, [filtered])

  const summaryText = Object.entries(typeCounts)
    .map(([label, count]) => `${count} ${label}${count !== 1 ? "s" : ""}`)
    .join(", ")

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="page-header-icon stat-icon-green">
            <ClipboardList className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">Activity Log</h1>
            <p className="text-muted-foreground">Track all communications and actions</p>
          </div>
        </div>
        <button
          className="btn-gradient rounded-xl px-5 py-2.5 text-sm font-semibold flex items-center gap-2"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="h-4 w-4" /> Log Activity
        </button>
      </div>
      <div className="neon-line mt-4" />

      {/* Activity Type Summary Bar */}
      {!loading && filtered.length > 0 && (
        <div className="glass-card rounded-xl px-5 py-3 flex items-center gap-3">
          <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Summary</span>
          <span className="w-px h-4 bg-white/10" />
          <span className="text-sm text-white/70">{summaryText}</span>
          <span className="ml-auto text-xs text-white/40">{filtered.length} total</span>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search activities..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 glass-input" />
        </div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="h-10 w-44 rounded-lg px-3 text-sm glass-input">
          <option value="all">All Types</option>
          {Object.entries(typeConfig).map(([key, config]) => (
            <option key={key} value={key}>{config.label}</option>
          ))}
        </select>
      </div>

      {/* Activity Timeline */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="glass-card rounded-xl p-4 h-20 animate-shimmer" />
          ))}
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="glass-card rounded-xl py-16 text-center">
          <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">
            {search || filterType !== "all" ? "No activities match your filters" : "No activities logged yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <h3 className="text-base font-semibold text-white/90 mb-4 px-1 pb-2 border-b border-white/[0.06]">{date}</h3>
              {/* Timeline container with vertical connecting line */}
              <div className="relative pl-6">
                {/* Vertical gradient line */}
                <div
                  className="absolute left-[19px] top-2 bottom-2 w-px"
                  style={{
                    background: "linear-gradient(to bottom, oklch(0.72 0.19 230 / 0.5), oklch(0.68 0.16 290 / 0.5), transparent)",
                  }}
                />
                <div className="space-y-3">
                  {items.map((activity) => {
                    const config = typeConfig[activity.type] || typeConfig.note
                    const Icon = config.icon
                    const time = new Date(activity.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
                    return (
                      <div key={activity.id} className="relative flex items-start gap-4">
                        {/* Timeline dot */}
                        <div className="absolute -left-6 top-4 w-3 h-3 rounded-full bg-white/20 border-2 border-white/10 z-10" />
                        <div className="glass-card rounded-xl p-4 flex items-start gap-4 flex-1">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="font-medium text-sm">{activity.title}</p>
                              <span className="text-[11px] font-medium glass rounded-full px-2.5 py-0.5 text-muted-foreground">
                                {config.label}
                              </span>
                            </div>
                            {activity.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2">{activity.description}</p>
                            )}
                            <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground/70">
                              {activity.client && (
                                <span>Client: {activity.client.name}</span>
                              )}
                              {activity.property && (
                                <span>Property: {activity.property.title}</span>
                              )}
                            </div>
                          </div>
                          {/* Prominent time display */}
                          <div className="flex-shrink-0 text-right">
                            <span className="text-sm font-semibold text-white/70">{time}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Activity Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass-dialog border-white/[0.08]">
          <DialogHeader>
            <DialogTitle>Log Activity</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-white/80">Type</Label>
                <select name="type" required className="w-full h-10 rounded-lg px-3 text-sm glass-input">
                  {Object.entries(typeConfig).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-white/80">Title</Label>
                <Input name="title" required placeholder="Called about viewing..." className="glass-input" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-white/80">Description</Label>
              <Textarea name="description" rows={3} placeholder="Details of the activity..." className="glass-input" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-white/80">Client (optional)</Label>
                <select name="clientId" className="w-full h-10 rounded-lg px-3 text-sm glass-input">
                  <option value="">None</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-white/80">Property (optional)</Label>
                <select name="propertyId" className="w-full h-10 rounded-lg px-3 text-sm glass-input">
                  <option value="">None</option>
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-[oklch(0.72_0.19_230)] to-[oklch(0.68_0.16_290)] text-white border-0">
              Log Activity
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
