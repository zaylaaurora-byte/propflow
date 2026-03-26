"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Users, Pencil, Trash2, Mail, Phone } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"

interface Client {
  id: string
  name: string
  email: string | null
  phone: string | null
  type: string
  notes: string | null
  budget: number | null
  createdAt: string
  _count?: { deals: number; viewings: number }
}

const clientTypes = ["buyer", "seller", "landlord", "tenant"]

const typeColors: Record<string, string> = {
  buyer: "bg-blue-100 text-blue-800",
  seller: "bg-green-100 text-green-800",
  landlord: "bg-purple-100 text-purple-800",
  tenant: "bg-orange-100 text-orange-800",
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Client | null>(null)

  useEffect(() => { loadClients() }, [])

  async function loadClients() {
    const res = await fetch("/api/clients")
    setClients(await res.json())
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name"),
      email: formData.get("email") || null,
      phone: formData.get("phone") || null,
      type: formData.get("type"),
      notes: formData.get("notes") || null,
      budget: formData.get("budget") ? parseFloat(formData.get("budget") as string) : null,
    }

    if (editing) {
      await fetch(`/api/clients/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
    } else {
      await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
    }

    setDialogOpen(false)
    setEditing(null)
    loadClients()
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this client?")) return
    await fetch(`/api/clients/${id}`, { method: "DELETE" })
    loadClients()
  }

  const filtered = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.email?.toLowerCase().includes(search.toLowerCase()) ?? false)
    const matchesType = filterType === "all" || c.type === filterType
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-muted-foreground">{clients.length} contacts</p>
        </div>
        <Button className="gap-2" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" /> Add Client
        </Button>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditing(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Client" : "Add New Client"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" defaultValue={editing?.name} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" defaultValue={editing?.email ?? ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" defaultValue={editing?.phone ?? ""} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <select name="type" defaultValue={editing?.type ?? "buyer"} className="w-full h-10 border rounded-md px-3 text-sm">
                    {clientTypes.map((t) => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget</Label>
                  <Input id="budget" name="budget" type="number" defaultValue={editing?.budget ?? ""} placeholder="250000" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" defaultValue={editing?.notes ?? ""} rows={3} />
              </div>
              <Button type="submit" className="w-full">
                {editing ? "Update Client" : "Add Client"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search clients..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="h-8 w-40 border rounded-lg px-2.5 text-sm bg-transparent">
          <option value="all">All Types</option>
          {clientTypes.map((t) => (
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <Card><CardContent className="p-6"><div className="h-48 bg-muted animate-pulse rounded" /></CardContent></Card>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">
              {search || filterType !== "all" ? "No clients match your filters" : "No clients yet. Add your first contact!"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Added</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <p className="font-medium">{client.name}</p>
                    {client.notes && <p className="text-xs text-muted-foreground truncate max-w-48">{client.notes}</p>}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {client.email && (
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" /> {client.email}
                        </div>
                      )}
                      {client.phone && (
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" /> {client.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={typeColors[client.type] || ""}>{client.type}</Badge>
                  </TableCell>
                  <TableCell>{client.budget ? formatCurrency(client.budget) : "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(client.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => { setEditing(client); setDialogOpen(true); }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(client.id)}>
                        <Trash2 className="h-4 w-4" />
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
