"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Plus, PoundSterling, Search, Check, X, Clock, AlertTriangle, Trash2,
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"

interface Offer {
  id: string
  amount: number
  status: string
  conditions: string | null
  notes: string | null
  expiresAt: string | null
  property: { id: string; title: string; address: string; price: number }
  client: { id: string; name: string }
  createdAt: string
}

interface Client { id: string; name: string }
interface Property { id: string; title: string; price: number }

const statusConfig: Record<string, { icon: typeof Check; color: string; badgeClass: string }> = {
  pending: { icon: Clock, color: "text-yellow-400", badgeClass: "badge-under-offer" },
  accepted: { icon: Check, color: "text-green-400", badgeClass: "badge-available" },
  rejected: { icon: X, color: "text-red-400", badgeClass: "badge-withdrawn" },
  withdrawn: { icon: AlertTriangle, color: "text-gray-400", badgeClass: "badge-withdrawn" },
  expired: { icon: Clock, color: "text-gray-400", badgeClass: "badge-withdrawn" },
}

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch("/api/offers").then((r) => r.json()),
      fetch("/api/clients").then((r) => r.json()),
      fetch("/api/properties").then((r) => r.json()),
    ]).then(([o, c, p]) => {
      setOffers(o)
      setClients(c)
      setProperties(p)
      setLoading(false)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await fetch("/api/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        propertyId: formData.get("propertyId"),
        clientId: formData.get("clientId"),
        amount: parseFloat(formData.get("amount") as string),
        conditions: formData.get("conditions") || null,
        notes: formData.get("notes") || null,
        expiresAt: formData.get("expiresAt") ? new Date(formData.get("expiresAt") as string).toISOString() : null,
      }),
    })
    setDialogOpen(false)
    const res = await fetch("/api/offers")
    setOffers(await res.json())
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/offers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    const res = await fetch("/api/offers")
    setOffers(await res.json())
  }

  async function deleteOffer(id: string) {
    if (!confirm("Delete this offer?")) return
    await fetch(`/api/offers/${id}`, { method: "DELETE" })
    const res = await fetch("/api/offers")
    setOffers(await res.json())
  }

  const filtered = offers.filter((o) => {
    const matchesSearch =
      o.client.name.toLowerCase().includes(search.toLowerCase()) ||
      o.property.title.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === "all" || o.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const pendingCount = offers.filter((o) => o.status === "pending").length
  const acceptedCount = offers.filter((o) => o.status === "accepted").length
  const totalValue = offers.filter((o) => o.status === "pending" || o.status === "accepted").reduce((sum, o) => sum + o.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Offers</h1>
          <p className="text-muted-foreground">{offers.length} total offers</p>
        </div>
        <Button
          className="gap-2 bg-gradient-to-r from-[oklch(0.72_0.19_230)] to-[oklch(0.68_0.16_290)] text-white border-0 hover:opacity-90"
          disabled={clients.length === 0 || properties.length === 0}
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="h-4 w-4" /> Record Offer
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl stat-icon-orange flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingCount}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl stat-icon-green flex items-center justify-center">
              <Check className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{acceptedCount}</p>
              <p className="text-xs text-muted-foreground">Accepted</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl stat-icon-blue flex items-center justify-center">
              <PoundSterling className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
              <p className="text-xs text-muted-foreground">Active Value</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search offers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 glass-input" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-10 w-40 rounded-lg px-3 text-sm glass-input">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="withdrawn">Withdrawn</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Offers List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card rounded-xl p-5 h-28 animate-shimmer" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-xl py-16 text-center">
          <PoundSterling className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">
            {search || filterStatus !== "all" ? "No offers match your filters" : "No offers recorded yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((offer) => {
            const config = statusConfig[offer.status] || statusConfig.pending
            const StatusIcon = config.icon
            const percentOfAsking = ((offer.amount / offer.property.price) * 100).toFixed(1)
            return (
              <div key={offer.id} className="glass-card rounded-xl p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-semibold text-lg">{formatCurrency(offer.amount)}</p>
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${config.badgeClass}`}>
                        <StatusIcon className="h-3 w-3" />
                        {offer.status}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {percentOfAsking}% of asking
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <span className="text-foreground font-medium">{offer.client.name}</span>
                      {" on "}
                      <span className="text-foreground">{offer.property.title}</span>
                      <span className="text-muted-foreground"> ({formatCurrency(offer.property.price)} asking)</span>
                    </p>
                    {offer.conditions && (
                      <p className="text-xs text-muted-foreground mt-1">Conditions: {offer.conditions}</p>
                    )}
                    {offer.notes && (
                      <p className="text-xs text-muted-foreground mt-0.5">{offer.notes}</p>
                    )}
                    <p className="text-[10px] text-muted-foreground/60 mt-2">
                      Submitted {formatDate(offer.createdAt)}
                      {offer.expiresAt && ` · Expires ${formatDate(offer.expiresAt)}`}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {offer.status === "pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(offer.id, "accepted")}
                          className="glass rounded-lg px-3 py-1.5 text-xs font-medium text-green-400 hover:bg-green-400/10 transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateStatus(offer.id, "rejected")}
                          className="glass rounded-lg px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-400/10 transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => deleteOffer(offer.id)}
                      className="glass rounded-lg px-2 py-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add Offer Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass-dialog">
          <DialogHeader>
            <DialogTitle>Record New Offer</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Property</Label>
              <select name="propertyId" required className="w-full h-10 rounded-lg px-3 text-sm glass-input">
                <option value="">Select property...</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>{p.title} ({formatCurrency(p.price)})</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Client (Buyer)</Label>
              <select name="clientId" required className="w-full h-10 rounded-lg px-3 text-sm glass-input">
                <option value="">Select client...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Offer Amount</Label>
                <Input name="amount" type="number" required placeholder="250000" className="glass-input" />
              </div>
              <div className="space-y-2">
                <Label>Expires</Label>
                <Input name="expiresAt" type="date" className="glass-input" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Conditions</Label>
              <Input name="conditions" placeholder="Subject to survey, chain free..." className="glass-input" />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea name="notes" rows={2} placeholder="Additional notes..." className="glass-input" />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-[oklch(0.72_0.19_230)] to-[oklch(0.68_0.16_290)] text-white border-0">
              Record Offer
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
