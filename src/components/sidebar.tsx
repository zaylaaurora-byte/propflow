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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/properties", label: "Properties", icon: Home },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/pipeline", label: "Pipeline", icon: GitBranch },
  { href: "/viewings", label: "Viewings", icon: Calendar },
  { href: "/offers", label: "Offers", icon: PoundSterling },
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
        <div className="p-5 border-b border-white/[0.06]">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[oklch(0.72_0.19_230)] to-[oklch(0.68_0.16_290)] flex items-center justify-center shadow-lg">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold gradient-text">PropFlow</span>
              <p className="text-[10px] text-muted-foreground -mt-0.5 tracking-wide">ESTATE AGENT CRM</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <p className="px-3 pt-2 pb-1.5 text-[10px] font-semibold tracking-wider text-muted-foreground/60 uppercase">Main</p>
          {links.slice(0, 5).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                pathname === link.href
                  ? "bg-[oklch(0.72_0.19_230_/_15%)] text-[oklch(0.80_0.14_230)] shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.05]"
              )}
            >
              <link.icon className={cn(
                "h-[18px] w-[18px]",
                pathname === link.href && "text-[oklch(0.72_0.19_230)]"
              )} />
              {link.label}
              {pathname === link.href && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[oklch(0.72_0.19_230)]" />
              )}
            </Link>
          ))}

          <p className="px-3 pt-4 pb-1.5 text-[10px] font-semibold tracking-wider text-muted-foreground/60 uppercase">Manage</p>
          {links.slice(5).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                pathname === link.href
                  ? "bg-[oklch(0.72_0.19_230_/_15%)] text-[oklch(0.80_0.14_230)] shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.05]"
              )}
            >
              <link.icon className={cn(
                "h-[18px] w-[18px]",
                pathname === link.href && "text-[oklch(0.72_0.19_230)]"
              )} />
              {link.label}
              {pathname === link.href && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[oklch(0.72_0.19_230)]" />
              )}
            </Link>
          ))}
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.72_0.19_230)] to-[oklch(0.68_0.16_290)] flex items-center justify-center text-sm font-bold text-white shadow-md">
              {user.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-foreground">{user.name}</p>
              <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-white/[0.05] text-sm h-9"
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
