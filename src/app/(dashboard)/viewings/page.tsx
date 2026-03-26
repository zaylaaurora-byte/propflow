"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Calendar, Clock, MapPin } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface Viewing {
  id: string
  date: string
  time: string
  notes: string | null
  status: string
  property: { id: string; title: string; address: string }
  client: { id: string; name: string }
}

interface Client { id: string; name: string }
interface Property { id: string; title: string; address: string }

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  "no-show": "bg-gray-100 text-gray-800",
}

export default function ViewingsPage() {
  const [viewings, setViewings] = useState<Viewing[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)

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

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/viewings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    const res = await fetch("/api/viewings")
    setViewings(await res.json())
  }

  async function deleteViewing(id: string) {
    if (!confirm("Delete this viewing?")) return
    await fetch(`/api/viewings/${id}`, { method: "DELETE" })
    const res = await fetch("/api/viewings")
    setViewings(await res.json())
  }

  const upcoming = viewings.filter((v) => v.status === "scheduled")
  const past = viewings.filter((v) => v.status !== "scheduled")

  const canCreate = clients.length > 0 && properties.length > 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Viewings</h1>
          <p className="text-muted-foreground">{upcoming.length} upcoming, {past.length} past</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button className="gap-2" disabled={!canCreate} />}>
            <Plus className="h-4 w-4" /> Book Viewing
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Book a Viewing</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="propertyId">Property</Label>
                <select name="propertyId" required className="w-full h-10 border rounded-md px-3 text-sm">
                  <option value="">Select property...</option>
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>{p.title} - {p.address}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientId">Client</Label>
                <select name="clientId" required className="w-full h-10 border rounded-md px-3 text-sm">
                  <option value="">Select client...</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" name="date" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" name="time" type="time" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" rows={2} placeholder="Any special instructions..." />
              </div>
              <Button type="submit" className="w-full">Book Viewing</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {!canCreate && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Add properties and clients first before booking viewings.</p>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <Card><CardContent className="p-6"><div className="h-48 bg-muted animate-pulse rounded" /></CardContent></Card>
      ) : viewings.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No viewings scheduled yet.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="w-48">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {viewings.map((viewing) => (
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
                    <Badge className={statusColors[viewing.status] || ""}>
                      {viewing.status.replace("-", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-32 truncate">
                    {viewing.notes || "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {viewing.status === "scheduled" && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => updateStatus(viewing.id, "completed")}>
                            Complete
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => updateStatus(viewing.id, "no-show")}>
                            No-show
                          </Button>
                          <Button size="sm" variant="outline" className="text-destructive" onClick={() => updateStatus(viewing.id, "cancelled")}>
                            Cancel
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteViewing(viewing.id)}>
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
