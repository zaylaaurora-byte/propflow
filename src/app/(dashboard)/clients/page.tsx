"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Plus, Search, Users, Pencil, Trash2, Mail, Phone,
  UserCheck, UserPlus, Building2, Home, ShieldCheck, ShieldAlert,
  CheckCircle2, AlertTriangle, MessageSquare,
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"

interface Client {
  id: string
  name: string
  email: string | null
  phone: string | null
  type: string
  notes: string | null
  budget: number | null
  budgetMax: number | null
  source: string | null
  preferredContact: string | null
  minBeds: number | null
  maxPrice: number | null
  minPrice: number | null
  preferredAreas: string | null
  preferredTypes: string | null
  idVerified: boolean
  amlChecked: boolean
  gdprConsent: boolean
  createdAt: string
  _count?: { deals: number; viewings: number }
}

const clientTypes = ["buyer", "seller", "landlord", "tenant", "applicant", "vendor"]

const sourceOptions = ["rightmove", "zoopla", "walk-in", "referral", "website", "social-media", "phone"]

const preferredContactOptions = ["email", "phone", "whatsapp"]

const typeIcons: Record<string, React.ReactNode> = {
  buyer: <UserPlus className="h-3.5 w-3.5" />,
  seller: <UserCheck className="h-3.5 w-3.5" />,
  landlord: <Building2 className="h-3.5 w-3.5" />,
  tenant: <Home className="h-3.5 w-3.5" />,
  applicant: <Users className="h-3.5 w-3.5" />,
  vendor: <ShieldCheck className="h-3.5 w-3.5" />,
}

const gradientColors = [
  "from-blue-500 to-cyan-400",
  "from-purple-500 to-pink-400",
  "from-emerald-500 to-teal-400",
  "from-orange-500 to-amber-400",
  "from-rose-500 to-red-400",
  "from-indigo-500 to-violet-400",
]

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function getGradient(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return gradientColors[Math.abs(hash) % gradientColors.length]
}

function isSearchType(type: string) {
  return type === "buyer" || type === "applicant"
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Client | null>(null)
  const [formType, setFormType] = useState("buyer")

  useEffect(() => { loadClients() }, [])

  async function loadClients() {
    const res = await fetch("/api/clients")
    setClients(await res.json())
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const type = formData.get("type") as string
    const data: Record<string, unknown> = {
      name: formData.get("name"),
      email: formData.get("email") || null,
      phone: formData.get("phone") || null,
      type,
      notes: formData.get("notes") || null,
      budget: formData.get("budget") ? parseFloat(formData.get("budget") as string) : null,
      budgetMax: formData.get("budgetMax") ? parseFloat(formData.get("budgetMax") as string) : null,
      source: formData.get("source") || null,
      preferredContact: formData.get("preferredContact") || null,
      idVerified: formData.get("idVerified") === "on",
      amlChecked: formData.get("amlChecked") === "on",
      gdprConsent: formData.get("gdprConsent") === "on",
    }

    if (isSearchType(type)) {
      data.minBeds = formData.get("minBeds") ? parseInt(formData.get("minBeds") as string) : null
      data.minPrice = formData.get("minPrice") ? parseFloat(formData.get("minPrice") as string) : null
      data.maxPrice = formData.get("maxPrice") ? parseFloat(formData.get("maxPrice") as string) : null
      data.preferredAreas = formData.get("preferredAreas") || null
      data.preferredTypes = formData.get("preferredTypes") || null
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

  function openAdd() {
    setEditing(null)
    setFormType("buyer")
    setDialogOpen(true)
  }

  function openEdit(client: Client) {
    setEditing(client)
    setFormType(client.type)
    setDialogOpen(true)
  }

  const filtered = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.email?.toLowerCase().includes(search.toLowerCase()) ?? false)
    const matchesType = filterType === "all" || c.type === filterType
    return matchesSearch && matchesType
  })

  const stats = {
    total: clients.length,
    buyers: clients.filter((c) => c.type === "buyer").length,
    sellers: clients.filter((c) => c.type === "seller").length,
    verified: clients.filter((c) => c.idVerified && c.amlChecked).length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Clients</h1>
          <p className="text-white/50 text-sm mt-1">{clients.length} contacts in your portfolio</p>
        </div>
        <Button className="gap-2" onClick={openAdd}>
          <Plus className="h-4 w-4" /> Add Client
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="stat-icon-blue p-2 rounded-lg">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-xs text-white/50">Total Clients</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="stat-icon-green p-2 rounded-lg">
              <UserPlus className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.buyers}</p>
              <p className="text-xs text-white/50">Buyers</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="stat-icon-purple p-2 rounded-lg">
              <UserCheck className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.sellers}</p>
              <p className="text-xs text-white/50">Sellers</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="stat-icon-emerald p-2 rounded-lg">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.verified}</p>
              <p className="text-xs text-white/50">Fully Verified</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 rounded-lg pl-9 pr-3 text-sm glass-input"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full h-10 rounded-lg px-3 text-sm glass-input"
          style={{ width: "10rem" }}
        >
          <option value="all">All Types</option>
          {clientTypes.map((t) => (
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Client Table */}
      {loading ? (
        <div className="glass-card rounded-xl p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 rounded-lg animate-shimmer" />
            ))}
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-xl py-16 text-center">
          <Users className="h-12 w-12 mx-auto text-white/20 mb-4" />
          <p className="text-white/50">
            {search || filterType !== "all" ? "No clients match your filters" : "No clients yet. Add your first contact!"}
          </p>
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          <Table className="glass-table">
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-white/60">Client</TableHead>
                <TableHead className="text-white/60">Contact</TableHead>
                <TableHead className="text-white/60">Type</TableHead>
                <TableHead className="text-white/60">Budget</TableHead>
                <TableHead className="text-white/60">Compliance</TableHead>
                <TableHead className="text-white/60">Added</TableHead>
                <TableHead className="text-white/60 w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((client) => (
                <TableRow key={client.id} className="border-white/5 hover:bg-white/5 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${getGradient(client.name)} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                        {getInitials(client.name)}
                      </div>
                      <div>
                        <p className="font-medium text-white">{client.name}</p>
                        {client.notes && (
                          <p className="text-xs text-white/40 truncate max-w-48">{client.notes}</p>
                        )}
                        {client.source && (
                          <p className="text-xs text-white/30 capitalize">{client.source}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {client.email && (
                        <div className="flex items-center gap-1.5 text-sm text-white/70">
                          <Mail className="h-3 w-3 text-white/40" /> {client.email}
                        </div>
                      )}
                      {client.phone && (
                        <div className="flex items-center gap-1.5 text-sm text-white/70">
                          <Phone className="h-3 w-3 text-white/40" /> {client.phone}
                        </div>
                      )}
                      {client.preferredContact && (
                        <div className="flex items-center gap-1.5 text-xs text-white/30">
                          <MessageSquare className="h-3 w-3" /> Prefers {client.preferredContact}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`badge-${client.type} inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium`}>
                      {typeIcons[client.type]}
                      {client.type.charAt(0).toUpperCase() + client.type.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {client.budget ? (
                      <div>
                        <p className="text-sm text-white/80">{formatCurrency(client.budget)}</p>
                        {client.budgetMax && (
                          <p className="text-xs text-white/40">up to {formatCurrency(client.budgetMax)}</p>
                        )}
                      </div>
                    ) : (
                      <span className="text-white/30">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {client.idVerified ? (
                        <span title="ID Verified"><CheckCircle2 className="h-4 w-4 text-green-400" /></span>
                      ) : (
                        <span title="ID Not Verified"><AlertTriangle className="h-4 w-4 text-yellow-400" /></span>
                      )}
                      {client.amlChecked ? (
                        <span title="AML Checked"><CheckCircle2 className="h-4 w-4 text-green-400" /></span>
                      ) : (
                        <span title="AML Not Checked"><AlertTriangle className="h-4 w-4 text-yellow-400" /></span>
                      )}
                      {client.gdprConsent ? (
                        <span title="GDPR Consent"><CheckCircle2 className="h-4 w-4 text-green-400" /></span>
                      ) : (
                        <span title="No GDPR Consent"><AlertTriangle className="h-4 w-4 text-yellow-400" /></span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-white/50">{formatDate(client.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10" onClick={() => openEdit(client)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-red-400/60 hover:text-red-400 hover:bg-red-500/10" onClick={() => handleDelete(client.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditing(null); }}>
        <DialogContent className="glass-dialog sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="gradient-text text-lg">
              {editing ? "Edit Client" : "Add New Client"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white/70 text-sm">Full Name</Label>
              <input
                id="name"
                name="name"
                defaultValue={editing?.name}
                required
                className="w-full h-10 rounded-lg px-3 text-sm glass-input"
              />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/70 text-sm">Email</Label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={editing?.email ?? ""}
                  className="w-full h-10 rounded-lg px-3 text-sm glass-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white/70 text-sm">Phone</Label>
                <input
                  id="phone"
                  name="phone"
                  defaultValue={editing?.phone ?? ""}
                  className="w-full h-10 rounded-lg px-3 text-sm glass-input"
                />
              </div>
            </div>

            {/* Type & Source */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-white/70 text-sm">Type</Label>
                <select
                  name="type"
                  defaultValue={editing?.type ?? "buyer"}
                  onChange={(e) => setFormType(e.target.value)}
                  className="w-full h-10 rounded-lg px-3 text-sm glass-input"
                >
                  {clientTypes.map((t) => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="source" className="text-white/70 text-sm">Source</Label>
                <select
                  name="source"
                  defaultValue={editing?.source ?? ""}
                  className="w-full h-10 rounded-lg px-3 text-sm glass-input"
                >
                  <option value="">Select source...</option>
                  {sourceOptions.map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace("-", " ")}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Budget & Preferred Contact */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="budget" className="text-white/70 text-sm">Budget</Label>
                <input
                  id="budget"
                  name="budget"
                  type="number"
                  defaultValue={editing?.budget ?? ""}
                  placeholder="250000"
                  className="w-full h-10 rounded-lg px-3 text-sm glass-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredContact" className="text-white/70 text-sm">Preferred Contact</Label>
                <select
                  name="preferredContact"
                  defaultValue={editing?.preferredContact ?? ""}
                  className="w-full h-10 rounded-lg px-3 text-sm glass-input"
                >
                  <option value="">Select...</option>
                  {preferredContactOptions.map((c) => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Budget Max */}
            <div className="space-y-2">
              <Label htmlFor="budgetMax" className="text-white/70 text-sm">Budget Max</Label>
              <input
                id="budgetMax"
                name="budgetMax"
                type="number"
                defaultValue={editing?.budgetMax ?? ""}
                placeholder="500000"
                className="w-full h-10 rounded-lg px-3 text-sm glass-input"
              />
            </div>

            {/* Search Criteria (buyer/applicant only) */}
            {isSearchType(formType) && (
              <div className="glass rounded-lg p-4 space-y-4">
                <h3 className="text-sm font-semibold text-white/80 flex items-center gap-2">
                  <Search className="h-4 w-4 text-blue-400" />
                  Search Criteria
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="minBeds" className="text-white/70 text-xs">Min Beds</Label>
                    <input
                      id="minBeds"
                      name="minBeds"
                      type="number"
                      min="0"
                      defaultValue={editing?.minBeds ?? ""}
                      placeholder="2"
                      className="w-full h-10 rounded-lg px-3 text-sm glass-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minPrice" className="text-white/70 text-xs">Min Price</Label>
                    <input
                      id="minPrice"
                      name="minPrice"
                      type="number"
                      defaultValue={editing?.minPrice ?? ""}
                      placeholder="150000"
                      className="w-full h-10 rounded-lg px-3 text-sm glass-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxPrice" className="text-white/70 text-xs">Max Price</Label>
                    <input
                      id="maxPrice"
                      name="maxPrice"
                      type="number"
                      defaultValue={editing?.maxPrice ?? ""}
                      placeholder="350000"
                      className="w-full h-10 rounded-lg px-3 text-sm glass-input"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredAreas" className="text-white/70 text-xs">Preferred Areas</Label>
                  <input
                    id="preferredAreas"
                    name="preferredAreas"
                    defaultValue={editing?.preferredAreas ?? ""}
                    placeholder="e.g. Kensington, Chelsea, Mayfair"
                    className="w-full h-10 rounded-lg px-3 text-sm glass-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredTypes" className="text-white/70 text-xs">Preferred Property Types</Label>
                  <input
                    id="preferredTypes"
                    name="preferredTypes"
                    defaultValue={editing?.preferredTypes ?? ""}
                    placeholder="e.g. Detached, Semi-detached, Flat"
                    className="w-full h-10 rounded-lg px-3 text-sm glass-input"
                  />
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-white/70 text-sm">Notes</Label>
              <textarea
                id="notes"
                name="notes"
                defaultValue={editing?.notes ?? ""}
                rows={3}
                className="w-full rounded-lg px-3 py-2 text-sm glass-input resize-none"
              />
            </div>

            {/* Compliance Toggles */}
            <div className="glass rounded-lg p-4 space-y-3">
              <h3 className="text-sm font-semibold text-white/80 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Compliance
              </h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-2">
                    {editing?.idVerified ? (
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    )}
                    <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">ID Verified</span>
                  </div>
                  <input
                    type="checkbox"
                    name="idVerified"
                    defaultChecked={editing?.idVerified ?? false}
                    className="h-4 w-4 rounded accent-emerald-500"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-2">
                    {editing?.amlChecked ? (
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    )}
                    <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">AML Checked</span>
                  </div>
                  <input
                    type="checkbox"
                    name="amlChecked"
                    defaultChecked={editing?.amlChecked ?? false}
                    className="h-4 w-4 rounded accent-emerald-500"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-2">
                    {editing?.gdprConsent ? (
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    )}
                    <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">GDPR Consent</span>
                  </div>
                  <input
                    type="checkbox"
                    name="gdprConsent"
                    defaultChecked={editing?.gdprConsent ?? false}
                    className="h-4 w-4 rounded accent-emerald-500"
                  />
                </label>
              </div>
            </div>

            <Button type="submit" className="w-full">
              {editing ? "Update Client" : "Add Client"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
