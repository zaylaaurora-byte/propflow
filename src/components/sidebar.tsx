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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/properties", label: "Properties", icon: Home },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/pipeline", label: "Pipeline", icon: GitBranch },
  { href: "/viewings", label: "Viewings", icon: Calendar },
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
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r flex flex-col transition-transform md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 border-b">
          <Link href="/dashboard" className="flex items-center gap-2 text-primary">
            <Building2 className="h-6 w-6" />
            <span className="text-lg font-bold">PropFlow</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 px-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
              {user.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground"
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
