"use client"

import {
  FileText,
  ScrollText,
  Mail,
  TrendingDown,
  ClipboardCheck,
  FilePlus,
  HandCoins,
  ArrowRightLeft,
  PartyPopper,
  Download,
  Eye,
  FileStack,
  LayoutTemplate,
  CalendarDays,
} from "lucide-react"

interface DocumentTemplate {
  id: string
  name: string
  description: string
  icon: typeof FileText
  category: "Sales" | "Lettings" | "General"
  iconColor: string
}

const templates: DocumentTemplate[] = [
  {
    id: "memo-of-sale",
    name: "Memorandum of Sale",
    description: "Formal document sent to all parties confirming agreed sale details, price, and solicitor information.",
    icon: ScrollText,
    category: "Sales",
    iconColor: "stat-icon-blue",
  },
  {
    id: "viewing-confirmation",
    name: "Viewing Confirmation Letter",
    description: "Confirmation letter sent to applicants with viewing date, time, property address, and agent details.",
    icon: Mail,
    category: "General",
    iconColor: "stat-icon-green",
  },
  {
    id: "price-reduction",
    name: "Price Reduction Notice",
    description: "Notification to vendor confirming the agreed price reduction with updated marketing details.",
    icon: TrendingDown,
    category: "Sales",
    iconColor: "stat-icon-orange",
  },
  {
    id: "market-appraisal",
    name: "Market Appraisal Report",
    description: "Comprehensive property valuation report with comparable evidence and recommended asking price.",
    icon: ClipboardCheck,
    category: "General",
    iconColor: "stat-icon-purple",
  },
  {
    id: "new-instruction",
    name: "New Instruction Confirmation",
    description: "Welcome letter confirming agency terms, marketing plan, and next steps for newly instructed properties.",
    icon: FilePlus,
    category: "Sales",
    iconColor: "stat-icon-cyan",
  },
  {
    id: "offer-notification",
    name: "Offer Notification Letter",
    description: "Formal notification to the vendor detailing a received offer, buyer position, and recommendation.",
    icon: HandCoins,
    category: "Sales",
    iconColor: "stat-icon-pink",
  },
  {
    id: "exchange-confirmation",
    name: "Exchange Confirmation",
    description: "Letter confirming exchange of contracts with completion date, deposit paid, and outstanding actions.",
    icon: ArrowRightLeft,
    category: "Sales",
    iconColor: "stat-icon-blue",
  },
  {
    id: "completion-letter",
    name: "Completion Letter",
    description: "Final letter confirming legal completion, key collection arrangements, and post-completion steps.",
    icon: PartyPopper,
    category: "Sales",
    iconColor: "stat-icon-green",
  },
]

const categoryBadge: Record<string, string> = {
  Sales: "badge-buyer",
  Lettings: "badge-landlord",
  General: "badge-applicant",
}

interface RecentDocument {
  id: string
  name: string
  type: string
  property: string
  generatedDate: string
}

const recentDocuments: RecentDocument[] = [
  {
    id: "1",
    name: "Memorandum of Sale - 14 Elm Grove",
    type: "Memorandum of Sale",
    property: "14 Elm Grove, Bristol, BS6 7QR",
    generatedDate: "2026-03-26",
  },
  {
    id: "2",
    name: "Viewing Confirmation - 7 Oak Lane",
    type: "Viewing Confirmation Letter",
    property: "7 Oak Lane, Bath, BA1 3NH",
    generatedDate: "2026-03-25",
  },
  {
    id: "3",
    name: "Offer Notification - 22 Park Street",
    type: "Offer Notification Letter",
    property: "22 Park Street, London, SW1A 1AA",
    generatedDate: "2026-03-24",
  },
  {
    id: "4",
    name: "Market Appraisal - 3 Riverside Walk",
    type: "Market Appraisal Report",
    property: "3 Riverside Walk, Oxford, OX1 4AJ",
    generatedDate: "2026-03-23",
  },
  {
    id: "5",
    name: "Exchange Confirmation - 9 Victoria Terrace",
    type: "Exchange Confirmation",
    property: "9 Victoria Terrace, Manchester, M1 2EQ",
    generatedDate: "2026-03-22",
  },
  {
    id: "6",
    name: "Completion Letter - 31 King Edward Road",
    type: "Completion Letter",
    property: "31 King Edward Road, Leeds, LS1 5BA",
    generatedDate: "2026-03-20",
  },
]

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="page-header-icon stat-icon-purple flex items-center justify-center">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-3xl font-bold gradient-text">Documents</h1>
          <p className="text-muted-foreground">Generate letters and documents for your properties and clients</p>
        </div>
      </div>
      <div className="neon-line mt-4" />

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl stat-icon-blue flex items-center justify-center">
              <FileStack className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold gradient-text">{recentDocuments.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Total Documents</p>
        </div>

        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl stat-icon-purple flex items-center justify-center">
              <LayoutTemplate className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold">{templates.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Templates Available</p>
        </div>

        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl stat-icon-green flex items-center justify-center">
              <CalendarDays className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold">4</p>
          <p className="text-xs text-muted-foreground mt-1">Generated This Month</p>
        </div>
      </div>

      {/* Template Cards */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Document Templates</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {templates.map((template) => (
            <div key={template.id} className="feature-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${template.iconColor}`}>
                  <template.icon className="h-6 w-6" />
                </div>
                <span
                  className={`${categoryBadge[template.category]} text-[11px] font-semibold px-2.5 py-1 rounded-full border`}
                >
                  {template.category}
                </span>
              </div>
              <h3 className="font-semibold mb-2">{template.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {template.description}
              </p>
              <button className="btn-gradient w-full px-4 py-2 rounded-lg text-sm font-medium">
                Generate
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Documents Table */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Documents</h2>
        <div className="glass-card rounded-xl overflow-hidden">
          <table className="glass-table w-full">
            <thead>
              <tr>
                <th className="text-left px-4 py-3">Document</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-left px-4 py-3">Related Property</th>
                <th className="text-left px-4 py-3">Generated</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentDocuments.map((doc) => (
                <tr key={doc.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="font-medium text-sm">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{doc.type}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{doc.property}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(doc.generatedDate)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
                        title="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
