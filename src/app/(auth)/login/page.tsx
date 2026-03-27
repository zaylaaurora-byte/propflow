"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Building2, ArrowRight, Sparkles } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    })

    if (result?.error) {
      setError("Invalid email or password")
      setLoading(false)
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="gradient-mesh" />
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[oklch(0.74_0.22_230)] to-[oklch(0.70_0.20_290)] flex items-center justify-center shadow-lg shadow-[oklch(0.74_0.22_230_/_30%)]">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-3xl font-extrabold gradient-text">PropFlow</span>
          </Link>
        </div>

        {/* Card */}
        <div className="glass-hero rounded-3xl p-9">
          <div className="text-center mb-7">
            <h1 className="text-2xl font-extrabold">Welcome back</h1>
            <p className="text-sm text-muted-foreground mt-1.5">Sign in to your agency dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/25 text-red-400 text-sm p-3.5 rounded-xl font-medium">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-bold">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@agency.com"
                required
                className="w-full h-12 rounded-xl px-4 text-sm glass-input"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-bold">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full h-12 rounded-xl px-4 text-sm glass-input"
              />
            </div>
            <button
              type="submit"
              className="w-full h-12 rounded-xl btn-gradient font-bold text-base flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-pulse">Signing in...</span>
              ) : (
                <>Sign in <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>

          <div className="mt-7 pt-5 border-t border-white/[0.08] text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline font-bold">
                Sign up free
              </Link>
            </p>
          </div>
        </div>

        {/* Demo credentials */}
        <div className="glass-card rounded-2xl p-5 mt-5 text-center rainbow-border">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <p className="text-xs font-bold text-muted-foreground">DEMO CREDENTIALS</p>
          </div>
          <p className="text-sm font-mono font-bold text-foreground/90">demo@propflow.app / demo1234</p>
        </div>
      </div>
    </div>
  )
}
