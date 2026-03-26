import Link from "next/link"
import { Building2, BarChart3, Users, Calendar, ArrowRight, CheckCircle2, Zap, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Building2,
    title: "Property Management",
    description: "Track all your listings in one place. Status updates, pricing, and details at a glance.",
  },
  {
    icon: Users,
    title: "Client CRM",
    description: "Manage buyers, sellers, landlords, and tenants. Never lose track of a lead again.",
  },
  {
    icon: BarChart3,
    title: "Deal Pipeline",
    description: "Visual kanban board to track every deal from first contact to completion.",
  },
  {
    icon: Calendar,
    title: "Viewing Scheduler",
    description: "Book and manage property viewings. Track outcomes and follow up automatically.",
  },
]

const benefits = [
  "Free to use — open source core",
  "Set up in under 5 minutes",
  "Built for UK estate agents",
  "No per-seat pricing",
  "Your data, your control",
  "Works on any device",
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Building2 className="h-7 w-7" />
            <span className="text-xl font-bold">PropFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 md:py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Zap className="h-4 w-4" />
            Open source property management
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            The CRM estate agents{" "}
            <span className="text-primary">actually want</span> to use
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            PropFlow gives you property listings, client management, deal tracking, and viewing
            scheduling — all in one beautiful, free tool built specifically for estate agents.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-base px-8 gap-2">
                Start for free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="text-base px-8 gap-2">
                <Shield className="h-4 w-4" /> View on GitHub
              </Button>
            </a>
          </div>
          <p className="text-sm text-muted-foreground mt-4">No credit card required. Free forever.</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need to close more deals</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Stop juggling spreadsheets, emails, and sticky notes. PropFlow brings it all together.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white rounded-xl p-6 border shadow-sm">
                <div className="bg-primary/10 text-primary w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Why agents choose PropFlow</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-left">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 p-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                <span className="font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to streamline your agency?</h2>
          <p className="text-primary-foreground/80 text-lg mb-8">
            Join hundreds of estate agents already using PropFlow to manage their properties and close more deals.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-base px-8 gap-2">
              Get started — it&apos;s free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-5 w-5" />
            <span className="font-semibold">PropFlow</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Open source property management. Built for estate agents.
          </p>
        </div>
      </footer>
    </div>
  )
}
