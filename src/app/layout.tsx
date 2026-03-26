import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Providers } from "@/components/providers"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "PropFlow — The Free CRM for Estate Agents | Property Management Software",
  description:
    "PropFlow is the open source property management platform built for UK estate agents. Manage listings, clients, deals, and viewings — free forever. No per-seat pricing.",
  keywords: [
    "estate agent CRM",
    "property management software",
    "estate agent software",
    "property CRM",
    "free estate agent software",
    "UK property management",
    "open source CRM",
    "estate agent tools",
    "property listing management",
    "deal pipeline estate agents",
  ],
  openGraph: {
    title: "PropFlow — The Free CRM for Estate Agents",
    description: "Manage properties, clients, deals and viewings in one place. Free forever.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PropFlow — Free Property Management for Estate Agents",
    description: "The open source CRM estate agents actually want to use.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
