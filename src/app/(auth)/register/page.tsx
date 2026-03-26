"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, ArrowRight, Check } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      company: formData.get("company"),
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const json = await res.json()
      setError(json.error || "Registration failed")
      setLoading(false)
      return
    }

    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    router.push("/dashboard")
  }

  const features = [
    "Unlimited properties & clients",
    "Deal pipeline & offer tracking",
    "Viewing scheduler with feedback",
    "Activity log & task management",
    "Reports & analytics dashboard",
  ]

  return (
    <div className="min-h-screen flex items-center justify-center px-4 hero-gradient">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[oklch(0.72_0.19_230)] to-[oklch(0.68_0.16_290)] flex items-center justify-center shadow-lg">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">PropFlow</span>
          </Link>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold">Create your account</h1>
            <p className="text-sm text-muted-foreground mt-1">Start managing your agency for free</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="John Smith" required className="glass-input h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@agency.com" required className="glass-input h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Agency Name</Label>
              <Input id="company" name="company" placeholder="Smith & Co Estate Agents" className="glass-input h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" minLength={8} required className="glass-input h-11" />
              <p className="text-[10px] text-muted-foreground">Minimum 8 characters</p>
            </div>
            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-[oklch(0.72_0.19_230)] to-[oklch(0.68_0.16_290)] text-white border-0 hover:opacity-90 font-medium"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Get started free"}
              {!loading && <ArrowRight className="h-4 w-4 ml-2" />}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/[0.06] text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="glass rounded-xl p-4 mt-4">
          <p className="text-xs text-muted-foreground mb-2 font-medium">Free forever includes:</p>
          <div className="space-y-1.5">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-2 text-xs text-foreground/80">
                <Check className="h-3 w-3 text-[oklch(0.78_0.18_160)] flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
