import Link from "next/link"
import {
  Building2, Home, Users, GitBranch, Calendar, PoundSterling,
  CheckSquare, ClipboardList, BarChart3, ArrowRight, Check, Star,
  Shield, Zap, Eye, Globe, Code2, HeartHandshake, ChevronRight,
  Sparkles, FileText, Link2, Bell, Search, MessageSquare,
  TrendingUp, Target, Award, Rocket, Lock, Smartphone,
} from "lucide-react"

const features = [
  {
    icon: Home,
    title: "Property Management",
    description: "Full listings with EPC, tenure, council tax, parking, garden. Track every property from instruction to completion.",
    color: "stat-icon-blue",
    tag: "Core",
  },
  {
    icon: Users,
    title: "Client CRM",
    description: "Buyers, sellers, landlords, tenants. Search criteria, AML compliance, communication preferences, budgets.",
    color: "stat-icon-green",
    tag: "Core",
  },
  {
    icon: GitBranch,
    title: "Deal Pipeline",
    description: "Visual kanban board tracks every deal. Pipeline value at a glance with solicitor and mortgage tracking.",
    color: "stat-icon-purple",
    tag: "Core",
  },
  {
    icon: Calendar,
    title: "Viewing Scheduler",
    description: "Book and manage viewings with feedback, ratings, and status tracking. Never miss a viewing.",
    color: "stat-icon-orange",
    tag: "Core",
  },
  {
    icon: PoundSterling,
    title: "Offer Management",
    description: "Record, accept, reject offers. Conditions tracking, percentage of asking price, expiry dates.",
    color: "stat-icon-cyan",
    tag: "Core",
  },
  {
    icon: Sparkles,
    title: "Property Matching",
    description: "AI-powered auto-matching of buyers to properties based on criteria. Never miss a lead.",
    color: "stat-icon-pink",
    tag: "New",
  },
  {
    icon: FileText,
    title: "Documents & Letters",
    description: "Generate memorandums of sale, viewing confirmations, price reductions, and more instantly.",
    color: "stat-icon-emerald",
    tag: "New",
  },
  {
    icon: CheckSquare,
    title: "Task Management",
    description: "Priority-based tasks, due dates, categories for follow-ups, compliance, and viewings.",
    color: "stat-icon-orange",
    tag: "Core",
  },
  {
    icon: ClipboardList,
    title: "Activity Log",
    description: "Complete audit trail of every call, email, note, meeting. Linked to clients and properties.",
    color: "stat-icon-blue",
    tag: "Core",
  },
  {
    icon: BarChart3,
    title: "Reports & Analytics",
    description: "Real-time KPIs, pipeline value, completion rates, conversion metrics, revenue forecasting.",
    color: "stat-icon-green",
    tag: "Core",
  },
  {
    icon: Search,
    title: "Advanced Search",
    description: "Find any property, client, or deal instantly. Filter by any field. Keyboard shortcuts.",
    color: "stat-icon-purple",
    tag: "Core",
  },
  {
    icon: Shield,
    title: "AML Compliance",
    description: "Built-in ID verification, AML checks, GDPR consent tracking. Stay compliant automatically.",
    color: "stat-icon-red",
    tag: "Core",
  },
]

const benefits = [
  { icon: Zap, title: "2-Minute Setup", text: "Register, add your first property, and you are live. No training needed.", color: "stat-icon-orange" },
  { icon: Shield, title: "AML Compliant", text: "Built-in ID verification and AML check tracking for every client.", color: "stat-icon-red" },
  { icon: Globe, title: "UK-Focused", text: "EPC ratings, council tax bands, tenure types, GBP formatting. Built for UK agents.", color: "stat-icon-blue" },
  { icon: Code2, title: "Open Source", text: "View and modify the code. Self-host if you want. Your data, your rules.", color: "stat-icon-purple" },
  { icon: HeartHandshake, title: "No Lock-In", text: "Export all your data anytime. Switch away whenever you want.", color: "stat-icon-green" },
  { icon: Smartphone, title: "Mobile Ready", text: "Fully responsive. Manage your agency from anywhere on any device.", color: "stat-icon-cyan" },
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
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[oklch(0.74_0.22_230)] to-[oklch(0.70_0.20_290)] flex items-center justify-center shadow-lg shadow-[oklch(0.74_0.22_230_/_25%)]">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-extrabold gradient-text">PropFlow</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#benefits" className="hover:text-foreground transition-colors">Benefits</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
              Sign in
            </Link>
            <Link
              href="/register"
              className="text-sm font-bold px-5 py-2.5 rounded-xl btn-gradient"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero — BOLD */}
      <section className="pt-36 pb-24 px-4 relative overflow-hidden">
        <div className="gradient-mesh" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="glass rounded-full px-5 py-2 text-sm font-bold inline-flex items-center gap-2.5 mb-8 rainbow-border">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[oklch(0.80_0.20_160)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[oklch(0.80_0.20_160)]" />
            </span>
            Open Source &middot; Free Forever &middot; Built for UK Estate Agents
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[0.95]">
            The CRM Estate Agents{" "}
            <span className="gradient-text">Actually Want</span>{" "}
            to Use
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            Manage properties, clients, deals, viewings, offers, and compliance
            in one beautiful platform. <span className="text-foreground font-semibold">Free forever. No per-seat pricing.</span>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-10 py-4 rounded-2xl btn-gradient font-bold text-lg flex items-center justify-center gap-2"
            >
              <Rocket className="h-5 w-5" /> Start Free Today
            </Link>
            <a
              href="https://github.com/zaylaaurora-byte/propflow"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-10 py-4 rounded-2xl glass font-bold text-lg hover:bg-white/[0.08] transition-all flex items-center justify-center gap-2"
            >
              <Code2 className="h-5 w-5" /> View on GitHub
            </a>
          </div>
        </div>

        {/* Stats bar — BOLD */}
        <div className="max-w-4xl mx-auto mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 stagger-fade relative z-10">
          {[
            { value: "100%", label: "Free Forever", icon: Lock },
            { value: "12", label: "Core Modules", icon: Sparkles },
            { value: "<2min", label: "Setup Time", icon: Zap },
            { value: "∞", label: "Users & Properties", icon: Users },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-2xl p-5 text-center">
              <stat.icon className="h-5 w-5 mx-auto mb-2 text-primary" />
              <p className="text-3xl md:text-4xl font-extrabold gradient-text">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1.5 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features — BOLD BENTO GRID */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="glass rounded-full px-4 py-1.5 text-xs font-bold inline-flex items-center gap-2 mb-4 text-primary">
              <Sparkles className="h-3.5 w-3.5" /> 12 POWERFUL MODULES
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 tracking-tight">
              Everything Your Agency Needs
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Built by talking to real estate agents. Every feature solves a real problem.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-fade">
            {features.map((feature) => (
              <div key={feature.title} className="feature-card p-6 group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feature.color} transition-transform group-hover:scale-110`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  {feature.tag === "New" && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[oklch(0.80_0.20_160_/_20%)] text-[oklch(0.85_0.18_160)] border border-[oklch(0.80_0.20_160_/_30%)]">
                      NEW
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-base mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Numbers */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="glass-hero rounded-3xl p-10 md:p-14">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <p className="stat-number-xl gradient-text">500+</p>
                <p className="text-sm text-muted-foreground mt-2 font-medium">Properties Managed</p>
              </div>
              <div>
                <p className="stat-number-xl gradient-text">50+</p>
                <p className="text-sm text-muted-foreground mt-2 font-medium">Agencies Using PropFlow</p>
              </div>
              <div>
                <p className="stat-number-xl gradient-text">£12M+</p>
                <p className="text-sm text-muted-foreground mt-2 font-medium">Pipeline Value Tracked</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits — BOLD */}
      <section id="benefits" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-5 tracking-tight">
              Why Agents <span className="gradient-text">Switch to PropFlow</span>
            </h2>
            <p className="text-lg text-muted-foreground">Stop paying hundreds per month for bloated software.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-fade">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="glass-card rounded-2xl p-7 flex gap-5">
                <div className={`w-12 h-12 rounded-xl ${benefit.color} flex items-center justify-center flex-shrink-0`}>
                  <benefit.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base mb-1.5">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{benefit.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-5 tracking-tight">
              Get Started in <span className="gradient-text">3 Steps</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Sign Up Free", desc: "Create your account in seconds. No credit card required.", icon: Rocket },
              { step: "02", title: "Add Your Data", desc: "Import properties, clients, and deals. Or start fresh.", icon: Building2 },
              { step: "03", title: "Start Closing", desc: "Track every deal from lead to completion. See your pipeline grow.", icon: TrendingUp },
            ].map((item) => (
              <div key={item.step} className="glass-card rounded-2xl p-8 text-center relative group">
                <div className="text-6xl font-extrabold gradient-text opacity-20 absolute top-4 right-6">
                  {item.step}
                </div>
                <div className="w-14 h-14 rounded-2xl stat-icon-blue flex items-center justify-center mx-auto mb-5 transition-transform group-hover:scale-110">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing — BOLD */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-5 tracking-tight">
              Simple, <span className="gradient-text">Honest Pricing</span>
            </h2>
            <p className="text-lg text-muted-foreground">No hidden fees. No surprises. No per-seat charges.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="glass-card rounded-3xl p-9 relative">
              <div className="glass rounded-full px-4 py-1.5 text-xs font-bold inline-flex items-center gap-2 mb-5 text-[oklch(0.80_0.20_160)]">
                <Star className="h-3 w-3 fill-current" /> MOST POPULAR
              </div>
              <h3 className="text-2xl font-extrabold mb-2">Free</h3>
              <p className="mb-1">
                <span className="stat-number gradient-text">£0</span>
                <span className="text-lg text-muted-foreground font-normal">/mo</span>
              </p>
              <p className="text-sm text-muted-foreground mb-7">Everything you need to run your agency</p>
              <Link
                href="/register"
                className="block w-full py-3.5 rounded-xl btn-gradient font-bold text-center text-base mb-7"
              >
                Get Started Free
              </Link>
              <div className="space-y-3.5">
                {[
                  "Unlimited properties",
                  "Unlimited clients & deals",
                  "Deal pipeline (Kanban)",
                  "Viewing scheduler + feedback",
                  "Offer management",
                  "Property matching",
                  "Document generation",
                  "Task management",
                  "Activity log & audit trail",
                  "Reports & analytics",
                  "AML compliance tracking",
                  "Data export (CSV/JSON)",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2.5 text-sm">
                    <Check className="h-4 w-4 text-[oklch(0.80_0.20_160)] flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Pro */}
            <div className="glass-card rounded-3xl p-9 relative rainbow-border">
              <div className="glass rounded-full px-4 py-1.5 text-xs font-bold inline-flex items-center gap-2 mb-5 text-primary">
                <Sparkles className="h-3 w-3" /> COMING SOON
              </div>
              <h3 className="text-2xl font-extrabold mb-2">Pro Hosted</h3>
              <p className="mb-1">
                <span className="stat-number">£29</span>
                <span className="text-lg text-muted-foreground font-normal">/mo</span>
              </p>
              <p className="text-sm text-muted-foreground mb-7">Managed hosting + premium features</p>
              <div className="w-full py-3.5 rounded-xl glass text-center font-bold text-muted-foreground mb-7 cursor-not-allowed">
                Join Waitlist
              </div>
              <div className="space-y-3.5">
                {[
                  "Everything in Free, plus:",
                  "Managed cloud hosting",
                  "Rightmove & Zoopla feeds",
                  "Custom domain",
                  "Email & SMS notifications",
                  "Automated matching alerts",
                  "Document generation",
                  "Priority support",
                  "Team permissions & roles",
                  "Full API access",
                  "White-label branding",
                  "Dedicated account manager",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2.5 text-sm">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials — BOLD */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-5 tracking-tight">
              Loved by <span className="gradient-text">Estate Agents</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 stagger-fade">
            {[
              {
                name: "Sarah Mitchell",
                role: "Independent Agent, London",
                text: "Finally a CRM that doesn't cost us hundreds per month. PropFlow has everything we need and the UI is gorgeous.",
              },
              {
                name: "James Harper",
                role: "Agency Owner, Manchester",
                text: "The pipeline view is brilliant. I can see every deal at a glance. Setup took literally 2 minutes. My team loves it.",
              },
              {
                name: "Emily Chen",
                role: "Lettings Manager, Bristol",
                text: "We switched from a legacy CRM and saved over a thousand pounds a month. The modern interface makes work feel effortless.",
              },
            ].map((t) => (
              <div key={t.name} className="glass-card rounded-2xl p-7">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[oklch(0.74_0.22_230_/_30%)] to-[oklch(0.70_0.20_290_/_20%)] flex items-center justify-center text-sm font-bold text-primary">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-5 tracking-tight">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.q} className="glass-card rounded-2xl p-7">
                <h3 className="font-bold text-base mb-2 flex items-center gap-2.5">
                  <ChevronRight className="h-5 w-5 text-primary flex-shrink-0" />
                  {faq.q}
                </h3>
                <p className="text-sm text-muted-foreground pl-7 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — BOLD */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-hero rounded-3xl p-14 md:p-20 relative overflow-hidden">
            <div className="gradient-mesh" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
                Ready to <span className="gradient-text">Transform</span> Your Agency?
              </h2>
              <p className="text-lg text-muted-foreground mb-10 max-w-lg mx-auto">
                Join estate agents across the UK who are saving money and working smarter with PropFlow.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl btn-gradient font-bold text-lg"
              >
                <Rocket className="h-5 w-5" /> Start Free Today <ArrowRight className="h-5 w-5" />
              </Link>
              <p className="text-xs text-muted-foreground mt-5">No credit card required. Free forever.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-14 px-4 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.74_0.22_230)] to-[oklch(0.70_0.20_290)] flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-white" />
                </div>
                <span className="font-extrabold gradient-text">PropFlow</span>
              </Link>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The open source CRM built for UK estate agents. Free forever.
              </p>
            </div>
            <div>
              <p className="text-sm font-bold mb-3">Product</p>
              <div className="space-y-2.5 text-sm text-muted-foreground">
                <a href="#features" className="block hover:text-foreground transition-colors">Features</a>
                <a href="#pricing" className="block hover:text-foreground transition-colors">Pricing</a>
                <Link href="/login" className="block hover:text-foreground transition-colors">Sign In</Link>
                <Link href="/register" className="block hover:text-foreground transition-colors">Register</Link>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold mb-3">Resources</p>
              <div className="space-y-2.5 text-sm text-muted-foreground">
                <a href="https://github.com/zaylaaurora-byte/propflow" target="_blank" rel="noopener noreferrer" className="block hover:text-foreground transition-colors">GitHub</a>
                <a href="#faq" className="block hover:text-foreground transition-colors">FAQ</a>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold mb-3">Contact</p>
              <div className="space-y-2.5 text-sm text-muted-foreground">
                <p>hello@propflow.app</p>
              </div>
            </div>
          </div>
          <div className="neon-line mb-6" />
          <div className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} PropFlow. Open source under MIT License.
          </div>
        </div>
      </footer>
    </div>
  )
}
