import type { Metadata, Viewport } from "next"
import { Nunito, Space_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"

import "./globals.css"
import { AnimalSidebar } from "@/components/animal-sidebar"

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
})

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
})

export const metadata: Metadata = {
  title: "Wild Policy Watch - Animal-Themed Legislative Tracker",
  description:
    "Monitor wildlife legislation and policy with our fun, animal-themed advocacy dashboard",
}

export const viewport: Viewport = {
  themeColor: "#2d7a4f",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${nunito.variable} ${spaceMono.variable} font-sans antialiased`}
      >
        <div className="flex min-h-screen bg-background">

          {/* Sidebar */}
          <AnimalSidebar />

          {/* Main Content */}
          <main className="flex-1 p-6">
            {children}
          </main>

        </div>

        <Analytics />
      </body>
    </html>
  )
}