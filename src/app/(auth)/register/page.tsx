"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2 } from "lucide-react"

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="flex items-center gap-2 text-primary">
              <Building2 className="h-8 w-8" />
              <span className="text-2xl font-bold">PropFlow</span>
            </div>
          </div>
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>Start managing properties in minutes</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="John Smith" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@agency.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Agency Name</Label>
              <Input id="company" name="company" placeholder="Smith & Co Estate Agents" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" minLength={8} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Get started free"}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
