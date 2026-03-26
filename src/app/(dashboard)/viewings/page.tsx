"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Plus, Calendar, Clock, MapPin, CheckCircle2, XCircle, UserX,
  Eye, Star, Trash2,
} from "lucide-react"
import { formatDate } from "@/lib/utils"

interface Viewing {
  id: string
  date: string
  time: string
  notes: string | null
  status: string
  feedback: string | null
  rating: number | null
  property: { id: string; title: string; address: string }
  client: { id: string; name: string }
}

interface Client { id: string; name: string }
interface Property { id: string; title: string; address: string }

const statusConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
  scheduled: {
    label: "Scheduled",
    bg: "oklch(0.72 0.19 230 / 15%)",
    text: "oklch(0.80 0.14 230)",
    border: "oklch(0.72 0.19 230 / 25%)",
  },
  confirmed: {
    label: "Confirmed",
    bg: "oklch(0.68 0.16 290 / 15%)",
    text: "oklch(0.78 0.12 290)",
    border: "oklch(0.68 0.16 290 / 25%)",
  },
  completed: {
    label: "Completed",
    bg: "oklch(0.78 0.18 160 / 15%)",
    text: "oklch(0.78 0.18 160)",
    border: "oklch(0.78 0.18 160 / 25%)",
  },
  cancelled: {
    label: "Cancelled",
    bg: "oklch(0.65 0.22 25 / 15%)",
    text: "oklch(0.75 0.18 25)",
    border: "oklch(0.65 0.22 25 / 25%)",
  },
  "no-show": {
    label: "No Show",
    bg: "oklch(0.5 0 0 / 15%)",
    text: "oklch(0.7 0 0)",
    border: "oklch(0.5 0 0 / 25%)",
  },
}

export default function ViewingsPage() {
  const [viewings, setViewings] = useState<Viewing[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false)
  const [completingId, setCompletingId] = useState<string | null>(null)
  const [completeFeedback, setCompleteFeedback] = useState("")
  const [completeRating, setCompleteRating] = useState(0)

  useEffect(() => {
    Promise.all([
      fetch("/api/viewings").then((r) => r.json()),
      fetch("/api/clients").then((r) => r.json()),
      fetch("/api/properties").then((r) => r.json()),
    ]).then(([v, c, p]) => {
      setViewings(v)
      setClients(c)
      setProperties(p)
      setLoading(false)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      propertyId: formData.get("propertyId"),
      clientId: formData.get("clientId"),
      date: new Date(formData.get("date") as string).toISOString(),
      time: formData.get("time"),
      notes: formData.get("notes") || null,
    }

    await fetch("/api/viewings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    setDialogOpen(false)
    const res = await fetch("/api/viewings")
    setViewings(await res.json())
  }

  async function updateStatus(id: string, status: string, extra?: { feedback?: string; rating?: number }) {
    await fetch(`/api/viewings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, ...extra }),
    })
    const res = await fetch("/api/viewings")
    setViewings(await res.json())
  }

  function openCompleteDialog(id: string) {
    setCompletingId(id)
    setCompleteFeedback("")
    setCompleteRating(0)
    setCompleteDialogOpen(true)
  }

  async function handleComplete() {
    if (!completingId) return
    await updateStatus(completingId, "completed", {
      feedback: completeFeedback || undefined,
      rating: completeRating || undefined,
    })
    setCompleteDialogOpen(false)
    setCompletingId(null)
  }

  async function deleteViewing(id: string) {
    if (!confirm("Delete this viewing?")) return
    await fetch(`/api/viewings/${id}`, { method: "DELETE" })
    const res = await fetch("/api/viewings")
    setViewings(await res.json())
  }

  const upcoming = viewings.filter((v) => v.status === "scheduled" || v.status === "confirmed")
  const past = viewings.filter((v) => v.status !== "scheduled" && v.status !== "confirmed")

  const canCreate = clients.length > 0 && properties.length > 0

  // Stats
  const totalScheduled = viewings.filter((v) => v.status === "scheduled" || v.status === "confirmed").length
  const today = new Date().toISOString().split("T")[0]
  const completedToday = viewings.filter(
    (v) => v.status === "completed" && v.date.startsWith(today)
  ).length
  const noShows = viewings.filter((v) => v.status === "no-show").length

  const statCards = [
    {
      label: "Scheduled",
      value: totalScheduled,
      icon: Calendar,
      iconClass: "stat-icon-blue",
    },
    {
      label: "Completed Today",
      value: completedToday,
      icon: CheckCircle2,
      iconClass: "stat-icon-green",
    },
    {
      label: "No-Shows",
      value: noShows,
      icon: UserX,
      iconClass: "stat-icon-orange",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Viewings</h1>
          <p className="text-muted-foreground">
            {upcoming.length} upcoming, {past.length} past
          </p>
        </div>
        <button
          disabled={!canCreate}
          onClick={() => setDialogOpen(true)}
          className="glass-card rounded-lg px-4 py-2 text-sm font-medium hover:bg-white/[0.08] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" /> Book Viewing
        </button>

        {/* Book Viewing Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="glass-dialog border-white/[0.08]">
            <DialogHeader>
              <DialogTitle className="gradient-text">Book a Viewing</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="propertyId">Property</Label>
                <select name="propertyId" required className="w-full h-10 rounded-lg px-3 text-sm glass-input">
                  <option value="">Select property...</option>
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>{p.title} - {p.address}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientId">Client</Label>
                <select name="clientId" required className="w-full h-10 rounded-lg px-3 text-sm glass-input">
                  <option value="">Select client...</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" name="date" type="date" required className="glass-input" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" name="time" type="time" required className="glass-input" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" rows={2} placeholder="Any special instructions..." className="glass-input" />
              </div>
              <button
                type="submit"
                className="w-full glass-card rounded-lg px-4 py-2.5 text-sm font-medium bg-primary/20 hover:bg-primary/30 text-primary-foreground transition-all"
              >
                Book Viewing
              </button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Complete Viewing Dialog (feedback + rating) */}
        <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
          <DialogContent className="glass-dialog border-white/[0.08]">
            <DialogHeader>
              <DialogTitle className="gradient-text">Complete Viewing</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setCompleteRating(star)}
                      className="p-1 rounded-lg hover:bg-white/[0.06] transition-colors"
                    >
                      <Star
                        className={`h-6 w-6 transition-colors ${
                          star <= completeRating
                            ? "fill-[oklch(0.75_0.15_50)] text-[oklch(0.75_0.15_50)]"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Feedback</Label>
                <Textarea
                  rows={3}
                  placeholder="How did the viewing go?"
                  value={completeFeedback}
                  onChange={(e) => setCompleteFeedback(e.target.value)}
                  className="glass-input"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCompleteDialogOpen(false)}
                  className="flex-1 glass-card rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-white/[0.08] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleComplete}
                  className="flex-1 glass-card rounded-lg px-4 py-2.5 text-sm font-medium bg-[oklch(0.78_0.18_160_/_15%)] text-[oklch(0.78_0.18_160)] hover:bg-[oklch(0.78_0.18_160_/_25%)] transition-all"
                >
                  Mark Complete
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.iconClass}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Cannot create notice */}
      {!canCreate && (
        <div className="glass-card rounded-xl p-8 text-center">
          <p className="text-muted-foreground">Add properties and clients first before booking viewings.</p>
        </div>
      )}

      {/* Main content */}
      {loading ? (
        <div className="glass-card rounded-xl p-6">
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 animate-shimmer rounded-lg" />
            ))}
          </div>
        </div>
      ) : viewings.length === 0 ? (
        <div className="glass-card rounded-xl py-16 text-center">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">No viewings scheduled yet.</p>
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          <Table className="glass-table">
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Feedback</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="w-56">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {viewings.map((viewing) => {
                const cfg = statusConfig[viewing.status] || statusConfig.scheduled
                return (
                  <TableRow key={viewing.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{formatDate(viewing.date)}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" /> {viewing.time}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-sm">{viewing.property.title}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {viewing.property.address}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-sm">{viewing.client.name}</TableCell>
                    <TableCell>
                      <span
                        className="inline-block text-[11px] font-medium px-2.5 py-1 rounded-full border"
                        style={{
                          background: cfg.bg,
                          color: cfg.text,
                          borderColor: cfg.border,
                        }}
                      >
                        {cfg.label}
                      </span>
                    </TableCell>
                    <TableCell>
                      {viewing.rating ? (
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`h-3 w-3 ${
                                  s <= viewing.rating!
                                    ? "fill-[oklch(0.75_0.15_50)] text-[oklch(0.75_0.15_50)]"
                                    : "text-muted-foreground/20"
                                }`}
                              />
                            ))}
                          </div>
                          {viewing.feedback && (
                            <p className="text-xs text-muted-foreground max-w-32 truncate">{viewing.feedback}</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">--</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-32 truncate">
                      {viewing.notes || "--"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1.5">
                        {(viewing.status === "scheduled" || viewing.status === "confirmed") && (
                          <>
                            <button
                              onClick={() => openCompleteDialog(viewing.id)}
                              className="glass rounded-lg px-2.5 py-1.5 text-xs font-medium text-[oklch(0.78_0.18_160)] hover:bg-[oklch(0.78_0.18_160_/_10%)] transition-all flex items-center gap-1"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Complete
                            </button>
                            <button
                              onClick={() => updateStatus(viewing.id, "no-show")}
                              className="glass rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-white/[0.06] transition-all flex items-center gap-1"
                            >
                              <UserX className="h-3.5 w-3.5" />
                              No-show
                            </button>
                            <button
                              onClick={() => updateStatus(viewing.id, "cancelled")}
                              className="glass rounded-lg px-2.5 py-1.5 text-xs font-medium text-[oklch(0.65_0.22_25)] hover:bg-[oklch(0.65_0.22_25_/_10%)] transition-all flex items-center gap-1"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              Cancel
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => deleteViewing(viewing.id)}
                          className="glass rounded-lg px-2 py-1.5 text-xs text-[oklch(0.65_0.22_25)] hover:bg-[oklch(0.65_0.22_25_/_10%)] transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
