import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { Sidebar } from "@/components/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return (
    <div className="min-h-screen flex bg-muted/30">
      <Sidebar user={session.user} />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
