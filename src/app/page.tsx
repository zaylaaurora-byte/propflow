import Link from "next/link"
import {
  Building2,
  BarChart3,
  Users,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  Star,
  Clock,
  TrendingUp,
  Globe,
  HeartHandshake,
  Laptop,
  Phone,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Building2,
    title: "Property Listings",
    description:
      "Add and manage your full property portfolio. Track status, pricing, bedrooms, and type — all searchable and filterable.",
  },
  {
    icon: Users,
    title: "Client CRM",
    description:
      "Keep buyers, sellers, landlords and tenants organised. Store budgets, notes, and contact details. Never lose a lead.",
  },
  {
    icon: BarChart3,
    title: "Deal Pipeline",
    description:
      "Visual kanban board tracks every deal stage — from new lead to completion. Drag deals, see values, spot bottlenecks.",
  },
  {
    icon: Calendar,
    title: "Viewing Scheduler",
    description:
      "Book viewings, link to properties and clients, track outcomes. See your schedule at a glance across all listings.",
  },
]

const benefits = [
  { text: "Free forever — open source core", icon: HeartHandshake },
  { text: "Set up in under 2 minutes", icon: Clock },
  { text: "Built specifically for UK agents", icon: Globe },
  { text: "No per-seat pricing ever", icon: Users },
  { text: "Your data stays yours", icon: Shield },
  { text: "Works on desktop, tablet & mobile", icon: Laptop },
]

const stats = [
  { value: "100%", label: "Free to use" },
  { value: "4", label: "Core modules" },
  { value: "<2min", label: "Setup time" },
  { value: "24/7", label: "Self-hosted uptime" },
]

const testimonials = [
  {
    quote: "Finally a CRM that understands how estate agents actually work. Simple, fast, and free.",
    name: "Sarah Mitchell",
    role: "Independent Estate Agent, Bristol",
  },
  {
    quote: "We replaced three different tools with PropFlow. Our team was up and running in minutes.",
    name: "James Henderson",
    role: "Director, Henderson Properties",
  },
  {
    quote: "The deal pipeline alone saved us hours each week. Love that it's open source too.",
    name: "Priya Sharma",
    role: "Lettings Manager, London",
  },
]

const pricingFeatures = [
  "Unlimited properties",
  "Unlimited clients",
  "Deal pipeline with kanban",
  "Viewing scheduler",
  "Dashboard analytics",
  "Full API access",
  "Email support",
  "Regular updates",
]

const faqs = [
  {
    q: "Is PropFlow really free?",
    a: "Yes. The core platform is 100% free and open source. We offer optional paid hosting and priority support for agencies that want a managed solution.",
  },
  {
    q: "Who is PropFlow built for?",
    a: "PropFlow is designed specifically for UK estate agents — independent agents, small agencies, and lettings managers who need a simple, powerful CRM.",
  },
  {
    q: "Can I self-host PropFlow?",
    a: "Absolutely. PropFlow is open source. Clone the repo, deploy to your own server, and you own everything. We also offer managed hosting if you prefer.",
  },
  {
    q: "How is this different from Rightmove/Zoopla CRMs?",
    a: "Those are listing portals, not CRMs. PropFlow manages your internal workflow — clients, deals, viewings, pipeline. It complements portal listings.",
  },
  {
    q: "Is my data secure?",
    a: "Your data is stored securely with encryption at rest. Self-hosted users have complete control. Our managed hosting uses enterprise-grade infrastructure.",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Building2 className="h-7 w-7" />
            <span className="text-xl font-bold">PropFlow</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Reviews</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
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
      <section className="py-20 md:py-32 px-4 bg-gradient-to-b from-blue-50/50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Zap className="h-4 w-4" />
            Open source property management for estate agents
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
            The CRM estate agents{" "}
            <span className="text-primary">actually want</span> to use
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            PropFlow gives you property listings, client management, a visual deal pipeline, and
            viewing scheduling — all in one beautiful, free tool built specifically for UK estate agents.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-base px-8 gap-2 shadow-lg shadow-primary/25">
                Start for free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-base px-8 gap-2">
                <Shield className="h-4 w-4" /> Try the demo
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required. Free forever. Set up in under 2 minutes.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y bg-muted/20">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to close more deals
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Stop juggling spreadsheets, emails, and sticky notes. PropFlow brings your whole workflow together.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-8 border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="bg-primary/10 text-primary w-14 h-14 rounded-xl flex items-center justify-center mb-5">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-muted/30 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Up and running in 3 steps</h2>
            <p className="text-muted-foreground text-lg">No complex setup. No training needed.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Create your account",
                description: "Sign up free in 30 seconds. No credit card, no commitment.",
              },
              {
                step: "2",
                title: "Add your properties & clients",
                description: "Import your listings and client contacts. Everything in one dashboard.",
              },
              {
                step: "3",
                title: "Track deals & viewings",
                description: "Use the pipeline to manage deals. Schedule viewings. Close more sales.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why agents choose PropFlow</h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.text}
                className="flex items-start gap-3 p-4 rounded-lg border bg-white"
              >
                <div className="bg-green-100 text-green-600 rounded-lg p-2 shrink-0">
                  <benefit.icon className="h-5 w-5" />
                </div>
                <span className="font-medium text-sm leading-relaxed pt-1">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-muted/30 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by agents across the UK</h2>
            <p className="text-muted-foreground text-lg">
              See what estate agents are saying about PropFlow.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-xl p-8 border shadow-sm">
                <div className="flex gap-1 text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-muted-foreground">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, honest pricing</h2>
            <p className="text-muted-foreground text-lg">
              Start free. Upgrade only if you want managed hosting.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free plan */}
            <div className="bg-white rounded-xl p-8 border-2 border-primary shadow-lg relative">
              <div className="absolute -top-3 left-6 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </div>
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Everything you need. Free forever.
              </p>
              <ul className="space-y-3 mb-8">
                {pricingFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button className="w-full" size="lg">
                  Get started free
                </Button>
              </Link>
            </div>

            {/* Pro plan */}
            <div className="bg-white rounded-xl p-8 border">
              <h3 className="text-xl font-bold mb-2">Pro Hosted</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold">$29</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                We host it, manage it, back it up.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  ...pricingFeatures,
                  "Managed cloud hosting",
                  "Automatic backups",
                  "Priority support",
                  "Custom domain",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button className="w-full" size="lg" variant="outline">
                Coming soon
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-muted/30 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently asked questions</h2>
          </div>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-white rounded-xl p-6 border">
                <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to streamline your agency?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
            Join estate agents across the UK who use PropFlow to manage properties, close deals faster, and grow their business.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="text-base px-8 gap-2">
                Get started — it&apos;s free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                Try the demo
              </Button>
            </Link>
          </div>
          <p className="text-primary-foreground/60 text-sm mt-6">
            demo@propflow.app / demo1234
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 text-primary mb-4">
                <Building2 className="h-6 w-6" />
                <span className="text-lg font-bold">PropFlow</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Open source property management built for UK estate agents.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#testimonials" className="hover:text-foreground transition-colors">Reviews</a></li>
                <li><a href="#faq" className="hover:text-foreground transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="https://github.com/zaylaaurora-byte/propflow" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a></li>
                <li><Link href="/login" className="hover:text-foreground transition-colors">Demo Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>hello@propflow.app</li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} PropFlow. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Made with care for estate agents
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
