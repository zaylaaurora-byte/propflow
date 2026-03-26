"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, GitBranch, GripVertical } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface Deal {
  id: string
  stage: string
  value: number | null
  notes: string | null
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
  { id: "new-lead", label: "New Lead", color: "bg-gray-500" },
  { id: "viewing-booked", label: "Viewing Booked", color: "bg-blue-500" },
  { id: "offer-made", label: "Offer Made", color: "bg-yellow-500" },
  { id: "offer-accepted", label: "Offer Accepted", color: "bg-orange-500" },
  { id: "under-contract", label: "Under Contract", color: "bg-purple-500" },
  { id: "completed", label: "Completed", color: "bg-green-500" },
  { id: "fallen-through", label: "Fallen Through", color: "bg-red-500" },
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

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Pipeline</h1>
        <div className="h-96 bg-muted animate-pulse rounded-lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Deal Pipeline</h1>
          <p className="text-muted-foreground">{deals.length} deals in pipeline</p>
        </div>
        <Button className="gap-2" disabled={clients.length === 0} onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" /> Add Deal
        </Button>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Deal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clientId">Client</Label>
                <select name="clientId" required className="w-full h-10 border rounded-md px-3 text-sm">
                  <option value="">Select a client...</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="propertyId">Property (optional)</Label>
                <select name="propertyId" className="w-full h-10 border rounded-md px-3 text-sm">
                  <option value="">No property linked</option>
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="stage">Stage</Label>
                  <select name="stage" defaultValue="new-lead" className="w-full h-10 border rounded-md px-3 text-sm">
                    {stages.map((s) => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">Deal Value</Label>
                  <Input id="value" name="value" type="number" placeholder="250000" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" rows={2} />
              </div>
              <Button type="submit" className="w-full">Create Deal</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {clients.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Add clients first before creating deals.</p>
          </CardContent>
        </Card>
      )}

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageDeals = deals.filter((d) => d.stage === stage.id)
          const stageValue = stageDeals.reduce((sum, d) => sum + (d.value || 0), 0)
          return (
            <div key={stage.id} className="min-w-[280px] flex-shrink-0">
              <Card className="bg-muted/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                      <CardTitle className="text-sm font-medium">{stage.label}</CardTitle>
                    </div>
                    <Badge variant="secondary" className="text-xs">{stageDeals.length}</Badge>
                  </div>
                  {stageValue > 0 && (
                    <p className="text-xs text-muted-foreground">{formatCurrency(stageValue)}</p>
                  )}
                </CardHeader>
                <CardContent className="space-y-2 min-h-[200px]">
                  {stageDeals.map((deal) => (
                    <Card key={deal.id} className="bg-white shadow-sm">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-medium text-sm">{deal.client.name}</p>
                          <GripVertical className="h-4 w-4 text-muted-foreground/50" />
                        </div>
                        {deal.property && (
                          <p className="text-xs text-muted-foreground mb-1">{deal.property.title}</p>
                        )}
                        {deal.value && (
                          <p className="text-sm font-semibold text-primary">{formatCurrency(deal.value)}</p>
                        )}
                        {deal.notes && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{deal.notes}</p>
                        )}
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {stages
                            .filter((s) => s.id !== stage.id)
                            .slice(0, 3)
                            .map((s) => (
                              <button
                                key={s.id}
                                onClick={() => moveDeal(deal.id, s.id)}
                                className="text-xs px-2 py-0.5 rounded border hover:bg-muted transition-colors"
                              >
                                {s.label}
                              </button>
                            ))}
                          <button
                            onClick={() => deleteDeal(deal.id)}
                            className="text-xs px-2 py-0.5 rounded border text-destructive hover:bg-destructive/10 transition-colors ml-auto"
                          >
                            Delete
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {stageDeals.length === 0 && (
                    <div className="flex items-center justify-center h-24 text-muted-foreground/50 text-sm">
                      No deals
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}
