"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Plus,
  Search,
  Home,
  Pencil,
  Trash2,
  Building2,
  BedDouble,
  Bath,
  Ruler,
  MapPin,
  Car,
  Trees,
  Zap,
  Landmark,
} from "lucide-react"
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
  tenure: string | null
  epcRating: string | null
  councilTaxBand: string | null
  parking: string | null
  garden: string | null
  keyFeatures: string[] | null
}

const propertyTypes = [
  "detached",
  "semi-detached",
  "terraced",
  "flat",
  "bungalow",
  "cottage",
  "maisonette",
]

const statusOptions = [
  "available",
  "under-offer",
  "sstc",
  "exchanged",
  "completed",
  "sold",
  "let",
  "withdrawn",
]

const tenureOptions = ["freehold", "leasehold", "share-of-freehold"]
const epcRatings = ["A", "B", "C", "D", "E", "F", "G"]
const councilTaxBands = ["A", "B", "C", "D", "E", "F", "G", "H"]

const statusBadgeClass: Record<string, string> = {
  available: "badge-available",
  "under-offer": "badge-under-offer",
  sstc: "badge-sstc",
  exchanged: "badge-exchanged",
  completed: "badge-completed",
  sold: "badge-sold",
  let: "badge-let",
  withdrawn: "badge-withdrawn",
}

function formatStatus(status: string) {
  return status
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
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
      tenure: formData.get("tenure") || null,
      epcRating: formData.get("epcRating") || null,
      councilTaxBand: formData.get("councilTaxBand") || null,
      parking: formData.get("parking") || null,
      garden: formData.get("garden") || null,
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

  // Stats
  const totalValue = properties.reduce((sum, p) => sum + p.price, 0)
  const availableCount = properties.filter((p) => p.status === "available").length
  const underOfferCount = properties.filter(
    (p) => p.status === "under-offer" || p.status === "sstc" || p.status === "exchanged"
  ).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Properties</h1>
          <p className="text-sm text-white/50 mt-1">
            Manage your property portfolio
          </p>
        </div>
        <Button
          className="gap-2"
          onClick={() => {
            setEditing(null)
            setDialogOpen(true)
          }}
        >
          <Plus className="h-4 w-4" /> Add Property
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="stat-icon-blue p-2 rounded-lg">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-white/50">Total Listings</p>
              <p className="text-lg font-bold">{properties.length}</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="stat-icon-green p-2 rounded-lg">
              <Home className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-white/50">Available</p>
              <p className="text-lg font-bold">{availableCount}</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="stat-icon-purple p-2 rounded-lg">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-white/50">Under Offer / SSTC</p>
              <p className="text-lg font-bold">{underOfferCount}</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="stat-icon-blue p-2 rounded-lg">
              <Landmark className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-white/50">Portfolio Value</p>
              <p className="text-lg font-bold">{formatCurrency(totalValue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              placeholder="Search by title, address or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 rounded-lg pl-9 pr-3 text-sm glass-input"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-48 h-10 rounded-lg px-3 text-sm glass-input"
          >
            <option value="all">All Status</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {formatStatus(s)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setEditing(null)
        }}
      >
        <DialogContent className="glass-dialog max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="gradient-text text-lg">
              {editing ? "Edit Property" : "Add New Property"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white/70 text-sm">
                Listing Title
              </Label>
              <input
                id="title"
                name="title"
                defaultValue={editing?.title}
                placeholder="3 Bed Semi in Kensington"
                required
                className="w-full h-10 rounded-lg px-3 text-sm glass-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="address" className="text-white/70 text-sm">
                  Address
                </Label>
                <input
                  id="address"
                  name="address"
                  defaultValue={editing?.address}
                  required
                  className="w-full h-10 rounded-lg px-3 text-sm glass-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="text-white/70 text-sm">
                  City
                </Label>
                <input
                  id="city"
                  name="city"
                  defaultValue={editing?.city}
                  required
                  className="w-full h-10 rounded-lg px-3 text-sm glass-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="postcode" className="text-white/70 text-sm">
                  Postcode
                </Label>
                <input
                  id="postcode"
                  name="postcode"
                  defaultValue={editing?.postcode}
                  required
                  className="w-full h-10 rounded-lg px-3 text-sm glass-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price" className="text-white/70 text-sm">
                  Price
                </Label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  defaultValue={editing?.price}
                  required
                  className="w-full h-10 rounded-lg px-3 text-sm glass-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="bedrooms" className="text-white/70 text-sm">
                  Beds
                </Label>
                <input
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  min="0"
                  defaultValue={editing?.bedrooms ?? 2}
                  required
                  className="w-full h-10 rounded-lg px-3 text-sm glass-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms" className="text-white/70 text-sm">
                  Baths
                </Label>
                <input
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  min="0"
                  defaultValue={editing?.bathrooms ?? 1}
                  required
                  className="w-full h-10 rounded-lg px-3 text-sm glass-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sqft" className="text-white/70 text-sm">
                  Sq Ft
                </Label>
                <input
                  id="sqft"
                  name="sqft"
                  type="number"
                  defaultValue={editing?.sqft ?? ""}
                  className="w-full h-10 rounded-lg px-3 text-sm glass-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-white/70 text-sm">
                  Type
                </Label>
                <select
                  name="type"
                  defaultValue={editing?.type ?? "detached"}
                  className="w-full h-10 rounded-lg px-3 text-sm glass-input"
                >
                  {propertyTypes.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-white/70 text-sm">
                  Status
                </Label>
                <select
                  name="status"
                  defaultValue={editing?.status ?? "available"}
                  className="w-full h-10 rounded-lg px-3 text-sm glass-input"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {formatStatus(s)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="tenure" className="text-white/70 text-sm">
                  Tenure
                </Label>
                <select
                  name="tenure"
                  defaultValue={editing?.tenure ?? ""}
                  className="w-full h-10 rounded-lg px-3 text-sm glass-input"
                >
                  <option value="">Not set</option>
                  {tenureOptions.map((t) => (
                    <option key={t} value={t}>
                      {t
                        .split("-")
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ")}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="epcRating" className="text-white/70 text-sm">
                  EPC Rating
                </Label>
                <select
                  name="epcRating"
                  defaultValue={editing?.epcRating ?? ""}
                  className="w-full h-10 rounded-lg px-3 text-sm glass-input"
                >
                  <option value="">Not set</option>
                  {epcRatings.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="councilTaxBand" className="text-white/70 text-sm">
                  Council Tax
                </Label>
                <select
                  name="councilTaxBand"
                  defaultValue={editing?.councilTaxBand ?? ""}
                  className="w-full h-10 rounded-lg px-3 text-sm glass-input"
                >
                  <option value="">Not set</option>
                  {councilTaxBands.map((b) => (
                    <option key={b} value={b}>
                      Band {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="parking" className="text-white/70 text-sm">
                  Parking
                </Label>
                <input
                  id="parking"
                  name="parking"
                  defaultValue={editing?.parking ?? ""}
                  placeholder="e.g. Driveway, Garage"
                  className="w-full h-10 rounded-lg px-3 text-sm glass-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="garden" className="text-white/70 text-sm">
                  Garden
                </Label>
                <input
                  id="garden"
                  name="garden"
                  defaultValue={editing?.garden ?? ""}
                  placeholder="e.g. Rear, South-facing"
                  className="w-full h-10 rounded-lg px-3 text-sm glass-input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white/70 text-sm">
                Description
              </Label>
              <textarea
                id="description"
                name="description"
                defaultValue={editing?.description ?? ""}
                rows={3}
                className="w-full rounded-lg px-3 py-2 text-sm glass-input resize-none"
              />
            </div>

            <Button type="submit" className="w-full">
              {editing ? "Update Property" : "Add Property"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Property Cards */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card rounded-xl p-6">
              <div className="space-y-3">
                <div className="h-4 w-3/4 rounded bg-white/5 animate-shimmer" />
                <div className="h-3 w-1/2 rounded bg-white/5 animate-shimmer" />
                <div className="h-8 w-1/3 rounded bg-white/5 animate-shimmer mt-4" />
                <div className="flex gap-4 mt-4">
                  <div className="h-3 w-12 rounded bg-white/5 animate-shimmer" />
                  <div className="h-3 w-12 rounded bg-white/5 animate-shimmer" />
                  <div className="h-3 w-12 rounded bg-white/5 animate-shimmer" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-xl">
          <div className="py-16 text-center">
            <Home className="h-12 w-12 mx-auto text-white/20 mb-4" />
            <p className="text-white/50">
              {search || filterStatus !== "all"
                ? "No properties match your filters"
                : "No properties yet. Add your first listing!"}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((property) => (
            <div key={property.id} className="glass-card rounded-xl group">
              <div className="p-5 space-y-4">
                {/* Header: Title + Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate text-white/90">
                      {property.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1 text-white/40">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <p className="text-sm truncate">
                        {property.address}, {property.city}
                      </p>
                    </div>
                    <p className="text-xs text-white/30 ml-[18px]">{property.postcode}</p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                      statusBadgeClass[property.status] || "badge-available"
                    }`}
                  >
                    {formatStatus(property.status)}
                  </span>
                </div>

                {/* Price */}
                <p className="text-2xl font-bold gradient-text">
                  {formatCurrency(property.price)}
                </p>

                {/* Key details row */}
                <div className="flex items-center gap-4 text-sm text-white/50">
                  <span className="flex items-center gap-1">
                    <BedDouble className="h-3.5 w-3.5" /> {property.bedrooms}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="h-3.5 w-3.5" /> {property.bathrooms}
                  </span>
                  {property.sqft && (
                    <span className="flex items-center gap-1">
                      <Ruler className="h-3.5 w-3.5" /> {property.sqft.toLocaleString()} sqft
                    </span>
                  )}
                </div>

                {/* Property info tags */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs glass text-white/60">
                    <Building2 className="h-3 w-3" />
                    <span className="capitalize">{property.type}</span>
                  </span>
                  {property.tenure && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs glass text-white/60">
                      <Landmark className="h-3 w-3" />
                      <span className="capitalize">
                        {property.tenure.replace(/-/g, " ")}
                      </span>
                    </span>
                  )}
                  {property.epcRating && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs glass text-white/60">
                      <Zap className="h-3 w-3" />
                      EPC {property.epcRating}
                    </span>
                  )}
                  {property.councilTaxBand && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs glass text-white/60">
                      Tax {property.councilTaxBand}
                    </span>
                  )}
                  {property.parking && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs glass text-white/60">
                      <Car className="h-3 w-3" />
                      {property.parking}
                    </span>
                  )}
                  {property.garden && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs glass text-white/60">
                      <Trees className="h-3 w-3" />
                      {property.garden}
                    </span>
                  )}
                </div>

                {/* Description preview */}
                {property.description && (
                  <p className="text-xs text-white/30 line-clamp-2">
                    {property.description}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 glass text-white/70 border-white/10 hover:bg-white/10"
                    onClick={() => {
                      setEditing(property)
                      setDialogOpen(true)
                    }}
                  >
                    <Pencil className="h-3 w-3" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 glass text-red-400/80 border-white/10 hover:bg-red-500/10"
                    onClick={() => handleDelete(property.id)}
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
