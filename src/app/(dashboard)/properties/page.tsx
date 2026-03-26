"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Search, Home, Pencil, Trash2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface Property {
  id: string
  title: string
  address: string
  city: string
  postcode: string
  price: number
  bedrooms: number
  bathrooms: number
  sqft: number | null
  type: string
  status: string
  description: string | null
}

const propertyTypes = ["detached", "semi-detached", "terraced", "flat", "bungalow"]
const statusOptions = ["available", "under-offer", "sold", "let", "withdrawn"]

const statusColors: Record<string, string> = {
  available: "bg-green-100 text-green-800",
  "under-offer": "bg-yellow-100 text-yellow-800",
  sold: "bg-blue-100 text-blue-800",
  let: "bg-purple-100 text-purple-800",
  withdrawn: "bg-gray-100 text-gray-800",
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Property | null>(null)

  useEffect(() => {
    loadProperties()
  }, [])

  async function loadProperties() {
    const res = await fetch("/api/properties")
    const data = await res.json()
    setProperties(data)
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get("title"),
      address: formData.get("address"),
      city: formData.get("city"),
      postcode: formData.get("postcode"),
      price: parseFloat(formData.get("price") as string),
      bedrooms: parseInt(formData.get("bedrooms") as string),
      bathrooms: parseInt(formData.get("bathrooms") as string),
      sqft: formData.get("sqft") ? parseInt(formData.get("sqft") as string) : null,
      type: formData.get("type"),
      status: formData.get("status") || "available",
      description: formData.get("description") || null,
    }

    if (editing) {
      await fetch(`/api/properties/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
    } else {
      await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
    }

    setDialogOpen(false)
    setEditing(null)
    loadProperties()
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this property?")) return
    await fetch(`/api/properties/${id}`, { method: "DELETE" })
    loadProperties()
  }

  const filtered = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.address.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === "all" || p.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Properties</h1>
          <p className="text-muted-foreground">{properties.length} total listings</p>
        </div>
        <Button className="gap-2" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" /> Add Property
        </Button>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditing(null); }}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Property" : "Add New Property"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Listing Title</Label>
                <Input id="title" name="title" defaultValue={editing?.title} placeholder="3 Bed Semi in Kensington" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" name="address" defaultValue={editing?.address} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" defaultValue={editing?.city} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="postcode">Postcode</Label>
                  <Input id="postcode" name="postcode" defaultValue={editing?.postcode} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" name="price" type="number" defaultValue={editing?.price} required />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Beds</Label>
                  <Input id="bedrooms" name="bedrooms" type="number" min="0" defaultValue={editing?.bedrooms ?? 2} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Baths</Label>
                  <Input id="bathrooms" name="bathrooms" type="number" min="0" defaultValue={editing?.bathrooms ?? 1} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sqft">Sq Ft</Label>
                  <Input id="sqft" name="sqft" type="number" defaultValue={editing?.sqft ?? ""} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <select name="type" defaultValue={editing?.type ?? "detached"} className="w-full h-10 border rounded-md px-3 text-sm">
                    {propertyTypes.map((t) => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select name="status" defaultValue={editing?.status ?? "available"} className="w-full h-10 border rounded-md px-3 text-sm">
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace("-", " ")}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" defaultValue={editing?.description ?? ""} rows={3} />
              </div>
              <Button type="submit" className="w-full">
                {editing ? "Update Property" : "Add Property"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-8 w-40 border rounded-lg px-2.5 text-sm bg-transparent">
          <option value="all">All Status</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace("-", " ")}</option>
          ))}
        </select>
      </div>

      {/* Property Cards */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}><CardContent className="p-6"><div className="h-32 bg-muted animate-pulse rounded" /></CardContent></Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Home className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">
              {search || filterStatus !== "all" ? "No properties match your filters" : "No properties yet. Add your first listing!"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((property) => (
            <Card key={property.id} className="group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold truncate">{property.title}</h3>
                    <p className="text-sm text-muted-foreground">{property.address}, {property.city}</p>
                    <p className="text-xs text-muted-foreground">{property.postcode}</p>
                  </div>
                  <Badge className={statusColors[property.status] || ""}>
                    {property.status.replace("-", " ")}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-primary mb-3">{formatCurrency(property.price)}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span>{property.bedrooms} bed</span>
                  <span>{property.bathrooms} bath</span>
                  {property.sqft && <span>{property.sqft} sqft</span>}
                  <span className="capitalize">{property.type}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1"
                    onClick={() => { setEditing(property); setDialogOpen(true); }}
                  >
                    <Pencil className="h-3 w-3" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 text-destructive"
                    onClick={() => handleDelete(property.id)}
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
