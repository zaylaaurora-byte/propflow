"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, GitBranch, GripVertical, Calendar, Briefcase, TrendingUp, ChevronRight, Trash2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface Deal {
  id: string
  stage: string
  value: number | null
  notes: string | null
  fee: number | null
  feePercent: number | null
  solicitor: string | null
  mortgage: string | null
  targetDate: string | null
  clientId: string
  propertyId: string | null
  client: { id: string; name: string }
  property: { id: string; title: string; address: string } | null
}

interface Client {
  id: string
  name: string
}

interface Property {
  id: string
  title: string
}

const stages = [
  { id: "new-lead", label: "New Lead", color: "bg-gray-500", borderColor: "border-l-gray-400", dotColor: "bg-gray-400", textColor: "text-gray-400" },
  { id: "viewing-booked", label: "Viewing Booked", color: "bg-blue-500", borderColor: "border-l-blue-500", dotColor: "bg-blue-500", textColor: "text-blue-400" },
  { id: "offer-made", label: "Offer Made", color: "bg-yellow-500", borderColor: "border-l-yellow-500", dotColor: "bg-yellow-500", textColor: "text-yellow-400" },
  { id: "offer-accepted", label: "Offer Accepted", color: "bg-orange-500", borderColor: "border-l-orange-500", dotColor: "bg-orange-500", textColor: "text-orange-400" },
  { id: "under-contract", label: "Under Contract", color: "bg-purple-500", borderColor: "border-l-purple-500", dotColor: "bg-purple-500", textColor: "text-purple-400" },
  { id: "completed", label: "Completed", color: "bg-green-500", borderColor: "border-l-green-500", dotColor: "bg-green-500", textColor: "text-green-400" },
  { id: "fallen-through", label: "Fallen Through", color: "bg-red-500", borderColor: "border-l-red-500", dotColor: "bg-red-500", textColor: "text-red-400" },
]

export default function PipelinePage() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch("/api/pipeline").then((r) => r.json()),
      fetch("/api/clients").then((r) => r.json()),
      fetch("/api/properties").then((r) => r.json()),
    ]).then(([d, c, p]) => {
      setDeals(d)
      setClients(c)
      setProperties(p)
      setLoading(false)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      clientId: formData.get("clientId"),
      propertyId: formData.get("propertyId") || null,
      stage: formData.get("stage") || "new-lead",
      value: formData.get("value") ? parseFloat(formData.get("value") as string) : null,
      fee: formData.get("fee") ? parseFloat(formData.get("fee") as string) : null,
      feePercent: formData.get("feePercent") ? parseFloat(formData.get("feePercent") as string) : null,
      solicitor: formData.get("solicitor") || null,
      mortgage: formData.get("mortgage") || null,
      targetDate: formData.get("targetDate") ? new Date(formData.get("targetDate") as string).toISOString() : null,
      notes: formData.get("notes") || null,
    }

    await fetch("/api/pipeline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    setDialogOpen(false)
    const res = await fetch("/api/pipeline")
    setDeals(await res.json())
  }

  async function moveDeal(dealId: string, newStage: string) {
    await fetch(`/api/pipeline/${dealId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: newStage }),
    })
    const res = await fetch("/api/pipeline")
    setDeals(await res.json())
  }

  async function deleteDeal(dealId: string) {
    if (!confirm("Delete this deal?")) return
    await fetch(`/api/pipeline/${dealId}`, { method: "DELETE" })
    const res = await fetch("/api/pipeline")
    setDeals(await res.json())
  }

  const totalValue = deals.reduce((sum, d) => sum + (d.value || 0), 0)
  const totalFees = deals.reduce((sum, d) => sum + (d.fee || 0), 0)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="glass-card rounded-xl p-6">
          <div className="h-8 w-48 bg-white/5 animate-pulse rounded-lg" />
          <div className="h-4 w-32 bg-white/5 animate-pulse rounded-lg mt-2" />
        </div>
        <div className="flex gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="min-w-[300px] h-96 bg-white/[0.03] animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl stat-icon-purple flex items-center justify-center">
              <GitBranch className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Deal Pipeline</h1>
              <p className="text-sm text-white/50">{deals.length} active deals</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Summary Stats */}
          <div className="hidden md:flex items-center gap-4">
            <div className="glass-card rounded-xl px-4 py-2.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg stat-icon-green flex items-center justify-center">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/40 font-medium">Pipeline Value</p>
                <p className="text-sm font-bold text-white/90">{formatCurrency(totalValue)}</p>
              </div>
            </div>
            <div className="glass-card rounded-xl px-4 py-2.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg stat-icon-blue flex items-center justify-center">
                <Briefcase className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/40 font-medium">Total Fees</p>
                <p className="text-sm font-bold text-white/90">{formatCurrency(totalFees)}</p>
              </div>
            </div>
          </div>
          <Button
            className="gap-2 glass-card border-white/10 hover:bg-white/10 text-white"
            disabled={clients.length === 0}
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="h-4 w-4" /> Add Deal
          </Button>
        </div>

        {/* Add Deal Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="glass-dialog border-white/10 text-white sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold gradient-text">Add New Deal</DialogTitle>
              <p className="text-sm text-white/40">Create a new deal in your pipeline</p>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="clientId" className="text-white/70 text-xs font-medium">Client *</Label>
                  <select name="clientId" required className="w-full h-10 rounded-lg px-3 text-sm glass-input">
                    <option value="">Select a client...</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propertyId" className="text-white/70 text-xs font-medium">Property</Label>
                  <select name="propertyId" className="w-full h-10 rounded-lg px-3 text-sm glass-input">
                    <option value="">No property linked</option>
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="stage" className="text-white/70 text-xs font-medium">Stage</Label>
                  <select name="stage" defaultValue="new-lead" className="w-full h-10 rounded-lg px-3 text-sm glass-input">
                    {stages.map((s) => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value" className="text-white/70 text-xs font-medium">Deal Value</Label>
                  <Input id="value" name="value" type="number" placeholder="250000" className="glass-input border-white/10 text-white placeholder:text-white/30" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="fee" className="text-white/70 text-xs font-medium">Agency Fee</Label>
                  <Input id="fee" name="fee" type="number" step="0.01" placeholder="3750" className="glass-input border-white/10 text-white placeholder:text-white/30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feePercent" className="text-white/70 text-xs font-medium">Fee %</Label>
                  <Input id="feePercent" name="feePercent" type="number" step="0.01" placeholder="1.5" className="glass-input border-white/10 text-white placeholder:text-white/30" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="solicitor" className="text-white/70 text-xs font-medium">Solicitor</Label>
                  <Input id="solicitor" name="solicitor" type="text" placeholder="Smith & Co." className="glass-input border-white/10 text-white placeholder:text-white/30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mortgage" className="text-white/70 text-xs font-medium">Mortgage Broker</Label>
                  <Input id="mortgage" name="mortgage" type="text" placeholder="Broker name" className="glass-input border-white/10 text-white placeholder:text-white/30" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetDate" className="text-white/70 text-xs font-medium">Target Completion Date</Label>
                <Input id="targetDate" name="targetDate" type="date" className="glass-input border-white/10 text-white placeholder:text-white/30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-white/70 text-xs font-medium">Notes</Label>
                <Textarea id="notes" name="notes" rows={2} placeholder="Any additional details..." className="glass-input border-white/10 text-white placeholder:text-white/30 resize-none" />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-blue-500/20">
                Create Deal
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {clients.length === 0 && (
        <div className="glass-card rounded-xl p-8 text-center">
          <div className="w-12 h-12 rounded-xl stat-icon-orange flex items-center justify-center mx-auto mb-3">
            <Briefcase className="h-6 w-6" />
          </div>
          <p className="text-white/50">Add clients first before creating deals.</p>
        </div>
      )}

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
        {stages.map((stage) => {
          const stageDeals = deals.filter((d) => d.stage === stage.id)
          const stageValue = stageDeals.reduce((sum, d) => sum + (d.value || 0), 0)
          const stageFees = stageDeals.reduce((sum, d) => sum + (d.fee || 0), 0)
          return (
            <div key={stage.id} className="min-w-[300px] flex-shrink-0">
              <div className={`pipeline-column p-4 border-l-2 ${stage.borderColor}`}>
                {/* Column Header */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${stage.dotColor} shadow-sm`} />
                      <h3 className="text-sm font-semibold text-white/90">{stage.label}</h3>
                    </div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/[0.06] text-white/50">
                      {stageDeals.length}
                    </span>
                  </div>
                  {stageValue > 0 && (
                    <div className="flex items-center gap-3">
                      <p className={`text-lg font-bold ${stage.textColor}`}>
                        {formatCurrency(stageValue)}
                      </p>
                      {stageFees > 0 && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/[0.06] text-white/40">
                          Fees: {formatCurrency(stageFees)}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Deal Cards */}
                <div className="space-y-2.5 min-h-[200px]">
                  {stageDeals.map((deal) => {
                    const currentIndex = stages.findIndex((s) => s.id === stage.id)
                    const prevStage = currentIndex > 0 ? stages[currentIndex - 1] : null
                    const nextStage = currentIndex < stages.length - 1 ? stages[currentIndex + 1] : null

                    return (
                      <div key={deal.id} className="pipeline-card p-3.5 group">
                        {/* Card Header */}
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-semibold text-sm text-white/90">{deal.client.name}</p>
                          <GripVertical className="h-4 w-4 text-white/20 group-hover:text-white/40 transition-colors flex-shrink-0" />
                        </div>

                        {/* Property */}
                        {deal.property && (
                          <p className="text-xs text-white/40 mb-1.5 truncate">{deal.property.title}</p>
                        )}

                        {/* Value & Fee */}
                        <div className="flex items-center gap-2 mb-1.5">
                          {deal.value && (
                            <span className="text-sm font-bold gradient-text">{formatCurrency(deal.value)}</span>
                          )}
                          {deal.fee && (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">
                              Fee: {formatCurrency(deal.fee)}
                            </span>
                          )}
                        </div>

                        {/* Target Date */}
                        {deal.targetDate && (
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <Calendar className="h-3 w-3 text-white/30" />
                            <span className="text-[11px] text-white/40">
                              Target: {new Date(deal.targetDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>
                        )}

                        {/* Solicitor / Mortgage */}
                        {(deal.solicitor || deal.mortgage) && (
                          <div className="flex flex-wrap gap-1.5 mb-1.5">
                            {deal.solicitor && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 truncate max-w-[130px]">
                                Sol: {deal.solicitor}
                              </span>
                            )}
                            {deal.mortgage && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 truncate max-w-[130px]">
                                Mtg: {deal.mortgage}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Notes */}
                        {deal.notes && (
                          <p className="text-xs text-white/30 mt-1 line-clamp-2">{deal.notes}</p>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-white/[0.06]">
                          {prevStage && (
                            <button
                              onClick={() => moveDeal(deal.id, prevStage.id)}
                              className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-white/50 hover:bg-white/[0.08] hover:text-white/70 hover:border-white/[0.15] transition-all backdrop-blur-sm"
                            >
                              <ChevronRight className="h-3 w-3 rotate-180" />
                              {prevStage.label}
                            </button>
                          )}
                          {nextStage && (
                            <button
                              onClick={() => moveDeal(deal.id, nextStage.id)}
                              className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-white/50 hover:bg-white/[0.08] hover:text-white/70 hover:border-white/[0.15] transition-all backdrop-blur-sm"
                            >
                              {nextStage.label}
                              <ChevronRight className="h-3 w-3" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteDeal(deal.id)}
                            className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-red-500/[0.06] border border-red-500/[0.15] text-red-400/70 hover:bg-red-500/[0.15] hover:text-red-400 hover:border-red-500/30 transition-all ml-auto backdrop-blur-sm"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                  {stageDeals.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-32 text-white/20">
                      <div className={`w-8 h-8 rounded-full ${stage.dotColor} opacity-20 mb-2`} />
                      <span className="text-xs">No deals</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
