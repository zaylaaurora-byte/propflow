import Link from "next/link"
import {
  Building2, Home, Users, GitBranch, Calendar, PoundSterling,
  CheckSquare, ClipboardList, BarChart3, ArrowRight, Check, Star,
  Shield, Zap, Eye, Globe, Code2, HeartHandshake, ChevronRight,
} from "lucide-react"

const features = [
  {
    icon: Home,
    title: "Property Management",
    description: "Full listings with EPC, tenure, council tax band, parking, garden details. Track every property from instruction to completion.",
    color: "stat-icon-blue",
  },
  {
    icon: Users,
    title: "Client CRM",
    description: "Manage buyers, sellers, landlords, tenants. Track search criteria, AML compliance, communication preferences, and budgets.",
    color: "stat-icon-green",
  },
  {
    icon: GitBranch,
    title: "Deal Pipeline",
    description: "Visual kanban board tracks every deal from new lead through to completion. See pipeline value at a glance with solicitor and mortgage tracking.",
    color: "stat-icon-purple",
  },
  {
    icon: Calendar,
    title: "Viewing Scheduler",
    description: "Book and manage viewings with feedback collection, interest ratings, and status tracking. Never miss a viewing again.",
    color: "stat-icon-orange",
  },
  {
    icon: PoundSterling,
    title: "Offer Management",
    description: "Record, accept, and reject offers with conditions tracking. See percentage of asking price and expiry dates instantly.",
    color: "stat-icon-cyan",
  },
  {
    icon: CheckSquare,
    title: "Task Management",
    description: "Never drop the ball with priority-based tasks, due date tracking, categories for follow-ups, compliance, and viewings.",
    color: "stat-icon-pink",
  },
  {
    icon: ClipboardList,
    title: "Activity Log",
    description: "Complete audit trail of every call, email, note, and meeting. Link activities to clients, properties, and deals.",
    color: "stat-icon-blue",
  },
  {
    icon: BarChart3,
    title: "Reports & Analytics",
    description: "Real-time KPIs, pipeline value, completion rates, conversion metrics. Know exactly how your agency is performing.",
    color: "stat-icon-green",
  },
]

const benefits = [
  { icon: Zap, title: "2-Minute Setup", text: "Register, add your first property, and you are live. No training needed." },
  { icon: Shield, title: "AML Compliance", text: "Built-in ID verification and AML check tracking for every client." },
  { icon: Globe, title: "UK-Focused", text: "EPC ratings, council tax bands, tenure types, GBP formatting. Built for UK agents." },
  { icon: Code2, title: "Open Source", text: "View and modify the code. Self-host if you want. Your data, your rules." },
  { icon: HeartHandshake, title: "No Lock-In", text: "Export all your data anytime. Switch away whenever you want." },
  { icon: Eye, title: "Always Improving", text: "Community-driven development. Features agents actually ask for." },
]

const faqs = [
  {
    q: "Is PropFlow really free?",
    a: "Yes. The core CRM is 100% free, forever. We offer optional paid hosting for agents who want a managed experience, but you can self-host for free.",
  },
  {
    q: "Can I import my existing data?",
    a: "Yes. PropFlow supports CSV import for properties, clients, and deals. We are also building direct migration tools for popular CRMs.",
  },
  {
    q: "Does it integrate with Rightmove and Zoopla?",
    a: "Portal feed integration is on our roadmap and coming soon. You can already manage your listings and we are building the RTDF feed support.",
  },
  {
    q: "Is my data secure?",
    a: "Your data is encrypted at rest and in transit. We use industry-standard security practices. You can also self-host for complete data control.",
  },
  {
    q: "How many users can I have?",
    a: "Unlimited. There is no per-seat pricing. Add your whole team for free.",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-sidebar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.72_0.19_230)] to-[oklch(0.68_0.16_290)] flex items-center justify-center">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">PropFlow</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#benefits" className="hover:text-foreground transition-colors">Benefits</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sign in
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium px-4 py-2 rounded-lg bg-gradient-to-r from-[oklch(0.72_0.19_230)] to-[oklch(0.68_0.16_290)] text-white hover:opacity-90 transition-opacity"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 hero-gradient relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="glass rounded-full px-4 py-1.5 text-xs font-medium inline-flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-[oklch(0.78_0.18_160)] animate-pulse" />
            Open Source &middot; Free Forever &middot; Built for UK Estate Agents
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            The CRM Estate Agents{" "}
            <span className="gradient-text">Actually Want</span>{" "}
            to Use
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Manage properties, clients, deals, viewings, offers, and compliance
            in one beautiful platform. Free forever. No per-seat pricing. No lock-in.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[oklch(0.72_0.19_230)] to-[oklch(0.68_0.16_290)] text-white font-semibold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-[oklch(0.72_0.19_230_/_25%)]"
            >
              Start Free Today <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="https://github.com/zaylaaurora-byte/propflow"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl glass text-foreground font-semibold text-lg hover:bg-white/[0.08] transition-all flex items-center justify-center gap-2"
            >
              <Code2 className="h-5 w-5" /> View on GitHub
            </a>
          </div>
        </div>

        {/* Stats bar */}
        <div className="max-w-3xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "100%", label: "Free Forever" },
            { value: "9", label: "Core Modules" },
            { value: "<2min", label: "Setup Time" },
            { value: "0", label: "Per-Seat Fees" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl p-4 text-center">
              <p className="text-2xl font-bold gradient-text">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything Your Agency Needs, <span className="gradient-text">Nothing It Doesn&apos;t</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Built by talking to real estate agents. Every feature solves a real problem.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature) => (
              <div key={feature.title} className="feature-card p-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Agents <span className="gradient-text">Switch to PropFlow</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="glass-card rounded-xl p-6 flex gap-4">
                <div className="w-10 h-10 rounded-xl stat-icon-purple flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, <span className="gradient-text">Honest Pricing</span>
            </h2>
            <p className="text-muted-foreground">No hidden fees. No surprises. No per-seat charges.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="glass-card rounded-2xl p-8 relative">
              <div className="glass rounded-full px-3 py-1 text-[10px] font-semibold inline-block mb-4 text-[oklch(0.78_0.18_160)]">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-1">Free</h3>
              <p className="text-4xl font-bold gradient-text mb-1">$0<span className="text-lg text-muted-foreground font-normal">/mo</span></p>
              <p className="text-sm text-muted-foreground mb-6">Everything you need to run your agency</p>
              <Link
                href="/register"
                className="block w-full py-3 rounded-xl bg-gradient-to-r from-[oklch(0.72_0.19_230)] to-[oklch(0.68_0.16_290)] text-white font-semibold text-center hover:opacity-90 transition-opacity mb-6"
              >
                Get Started Free
              </Link>
              <div className="space-y-3">
                {[
                  "Unlimited properties",
                  "Unlimited clients & deals",
                  "Deal pipeline (Kanban)",
                  "Viewing scheduler + feedback",
                  "Offer management",
                  "Task management",
                  "Activity log",
                  "Reports & analytics",
                  "AML compliance tracking",
                  "Data export (CSV/JSON)",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-[oklch(0.78_0.18_160)] flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Pro */}
            <div className="glass-card rounded-2xl p-8 relative border-[oklch(0.72_0.19_230_/_20%)]">
              <div className="glass rounded-full px-3 py-1 text-[10px] font-semibold inline-block mb-4 text-primary">
                COMING SOON
              </div>
              <h3 className="text-2xl font-bold mb-1">Pro Hosted</h3>
              <p className="text-4xl font-bold mb-1">$29<span className="text-lg text-muted-foreground font-normal">/mo</span></p>
              <p className="text-sm text-muted-foreground mb-6">Managed hosting + premium features</p>
              <div className="w-full py-3 rounded-xl glass text-center font-semibold text-muted-foreground mb-6">
                Join Waitlist
              </div>
              <div className="space-y-3">
                {[
                  "Everything in Free, plus:",
                  "Managed cloud hosting",
                  "Rightmove & Zoopla feeds",
                  "Custom domain",
                  "Email & SMS notifications",
                  "Automated matching alerts",
                  "Document generation",
                  "Priority support",
                  "Team permissions",
                  "API access",
                  "White-label branding",
                  "Dedicated account manager",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for <span className="gradient-text">Real Estate Agents</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                name: "Sarah Mitchell",
                role: "Independent Agent, London",
                text: "Finally a CRM that doesn't cost us hundreds per month. PropFlow has everything we need.",
              },
              {
                name: "James Harper",
                role: "Agency Owner, Manchester",
                text: "The pipeline view is brilliant. I can see every deal at a glance. Setup took literally 2 minutes.",
              },
              {
                name: "Emily Chen",
                role: "Lettings Manager, Bristol",
                text: "We switched from a legacy CRM and saved over a thousand pounds a month. The team loves the modern interface.",
              },
            ].map((t) => (
              <div key={t.name} className="glass-card rounded-xl p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.q} className="glass-card rounded-xl p-6">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-primary" />
                  {faq.q}
                </h3>
                <p className="text-sm text-muted-foreground pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card rounded-2xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to <span className="gradient-text">Transform Your Agency</span>?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Join estate agents across the UK who are saving money and working smarter with PropFlow.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[oklch(0.72_0.19_230)] to-[oklch(0.68_0.16_290)] text-white font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-[oklch(0.72_0.19_230_/_25%)]"
            >
              Start Free Today <ArrowRight className="h-5 w-5" />
            </Link>
            <p className="text-xs text-muted-foreground mt-4">No credit card required. Free forever.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[oklch(0.72_0.19_230)] to-[oklch(0.68_0.16_290)] flex items-center justify-center">
                  <Building2 className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="font-bold gradient-text">PropFlow</span>
              </Link>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The open source CRM built for UK estate agents. Free forever.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold mb-3">Product</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="#features" className="block hover:text-foreground transition-colors">Features</a>
                <a href="#pricing" className="block hover:text-foreground transition-colors">Pricing</a>
                <Link href="/login" className="block hover:text-foreground transition-colors">Sign In</Link>
                <Link href="/register" className="block hover:text-foreground transition-colors">Register</Link>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold mb-3">Resources</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="https://github.com/zaylaaurora-byte/propflow" target="_blank" rel="noopener noreferrer" className="block hover:text-foreground transition-colors">GitHub</a>
                <a href="#faq" className="block hover:text-foreground transition-colors">FAQ</a>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold mb-3">Contact</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>hello@propflow.app</p>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-white/[0.06] text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} PropFlow. Open source under MIT License.
          </div>
        </div>
      </footer>
    </div>
  )
}
