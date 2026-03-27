"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import {
  Building2,
  LayoutDashboard,
  Home,
  Users,
  GitBranch,
  Calendar,
  LogOut,
  Menu,
  X,
  PoundSterling,
  ClipboardList,
  CheckSquare,
  BarChart3,
  Sparkles,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const mainLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/properties", label: "Properties", icon: Home },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/pipeline", label: "Pipeline", icon: GitBranch },
  { href: "/viewings", label: "Viewings", icon: Calendar },
]

const manageLinks = [
  { href: "/offers", label: "Offers", icon: PoundSterling },
  { href: "/matching", label: "Matching", icon: Sparkles, isNew: true },
  { href: "/documents", label: "Documents", icon: FileText, isNew: true },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/activity", label: "Activity Log", icon: ClipboardList },
  { href: "/reports", label: "Reports", icon: BarChart3 },
]

interface SidebarProps {
  user: { name: string; email: string }
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const renderLink = (link: { href: string; label: string; icon: React.ElementType; isNew?: boolean }) => {
    const isActive = pathname === link.href
    return (
      <Link
        key={link.href}
        href={link.href}
        onClick={() => setOpen(false)}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-[oklch(0.74_0.22_230_/_18%)] text-[oklch(0.85_0.15_230)] shadow-[0_0_15px_oklch(0.74_0.22_230_/_10%)]"
            : "text-muted-foreground hover:text-foreground hover:bg-white/[0.06]"
        )}
      >
        <link.icon className={cn(
          "h-[18px] w-[18px] transition-colors",
          isActive && "text-[oklch(0.74_0.22_230)]"
        )} />
        {link.label}
        {link.isNew && (
          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-[oklch(0.80_0.20_160_/_20%)] text-[oklch(0.85_0.18_160)] ml-auto">
            NEW
          </span>
        )}
        {isActive && !link.isNew && (
          <div className="ml-auto w-2 h-2 rounded-full bg-[oklch(0.74_0.22_230)] shadow-[0_0_8px_oklch(0.74_0.22_230)]" />
        )}
      </Link>
    )
  }

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden text-foreground"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:static inset-y-0 left-0 z-40 w-64 glass-sidebar flex flex-col transition-transform md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="p-5 border-b border-white/[0.08]">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[oklch(0.74_0.22_230)] to-[oklch(0.70_0.20_290)] flex items-center justify-center shadow-lg shadow-[oklch(0.74_0.22_230_/_25%)]">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold gradient-text">PropFlow</span>
              <p className="text-[10px] text-muted-foreground -mt-0.5 tracking-widest font-bold">ESTATE AGENT CRM</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <p className="px-3 pt-3 pb-2 text-[10px] font-extrabold tracking-widest text-muted-foreground/50 uppercase">Main</p>
          {mainLinks.map(renderLink)}

          <p className="px-3 pt-5 pb-2 text-[10px] font-extrabold tracking-widest text-muted-foreground/50 uppercase">Manage</p>
          {manageLinks.map(renderLink)}
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-white/[0.08]">
          <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[oklch(0.74_0.22_230)] to-[oklch(0.70_0.20_290)] flex items-center justify-center text-sm font-extrabold text-white shadow-md">
              {user.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate text-foreground">{user.name}</p>
              <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-white/[0.06] text-sm h-9 rounded-xl"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>
    </>
  )
}
