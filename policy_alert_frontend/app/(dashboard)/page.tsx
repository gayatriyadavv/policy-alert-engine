"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"



import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts"
import { FileText, Calendar, MessageSquare, TrendingUp, ArrowRight, RefreshCw, AlertTriangle } from "lucide-react"
import Link from "next/link"

// ── Types ────────────────────────────────────────────────────────────────────

interface Bill {
  id: string
  title: string
  impact_score: number
  priority: string
  category: string
}

interface Alert {
  bill_id: string
  title: string
  alert_level: string
  impact_score: number
}

// ── Constants ─────────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000"

// ── Helpers ───────────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${path}`)
  return res.json() as Promise<T>
}

function generateReportBlob(bills: Bill[]): Blob {
  const lines = bills.map((b, i) => `${i + 1}. ${b.title} (Impact ${b.impact_score})`)
  const content = [
    "Policy Alert Engine Report",
    "==========================",
    "",
    `Total Bills: ${bills.length}`,
    "",
    "Bills:",
    ...lines,
    "",
    `Generated: ${new Date().toLocaleString()}`,
  ].join("\n")
  return new Blob([content], { type: "text/plain" })
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  title, value, icon: Icon,
}: { title: string; value: number; icon: React.ElementType }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}

function BillRow({ bill, href }: { bill: Bill; href: string }) {
  return (
    <div className="flex items-center justify-between border p-3 rounded-lg hover:bg-muted transition-colors">
      <div>
        <p className="font-medium">{bill.title}</p>
        <p className="text-xs text-muted-foreground">
          Impact {bill.impact_score} • {bill.priority}
        </p>
      </div>
      <Link href={href} aria-label={`View analysis for ${bill.title}`}>
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [bills, setBills] = useState<Bill[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [billsData, alertsData] = await Promise.all([
        apiFetch<{ bills: Bill[] }>("/bills"),
        apiFetch<{ alerts: Alert[] }>("/alerts"),
      ])
      setBills(billsData.bills ?? [])
      setAlerts(alertsData.alerts ?? [])
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error"
      console.error("Dashboard load failed:", msg)
      setError(`Could not reach the API. Check that the server is running. (${msg})`)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const handleScan = async () => {
    setScanning(true)
    try {
      await apiFetch<unknown>("/scan")   // POST handled via apiFetch below
      await fetch(`${API_BASE}/scan`, { method: "POST" })
      await loadData()
    } catch (err) {
      console.error("Scan failed:", err)
    } finally {
      setScanning(false)
    }
  }

  const handleGenerateReport = () => {
    if (!bills.length) return alert("No bills available for report")
    const url = URL.createObjectURL(generateReportBlob(bills))
    const a = Object.assign(document.createElement("a"), { href: url, download: "policy-report.txt" })
    a.click()
    URL.revokeObjectURL(url)
  }

  // Derived data
  const topPriorityBills = [...bills].sort((a, b) => b.impact_score - a.impact_score).slice(0, 5)
  const recentBills = bills.slice(0, 5)

  const activityData = bills.slice(0, 6).map((_, i) => ({
    month: `Bill ${i + 1}`,
    bills: i + 2,
    comments: i + 1,
  }))

  const categoryData = Object.entries(
    bills.reduce<Record<string, number>>((acc, b) => {
      acc[b.category] = (acc[b.category] ?? 0) + 1
      return acc
    }, {})
  ).map(([category, count]) => ({ category, count }))

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Loading dashboard…
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Policy monitoring overview</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleScan} disabled={scanning}>
            <RefreshCw className={`mr-2 h-4 w-4 ${scanning ? "animate-spin" : ""}`} />
            {scanning ? "Scanning…" : "Scan Bills"}
          </Button>
          <Button onClick={handleGenerateReport} disabled={!bills.length}>
            <TrendingUp className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Error banner */}
      {error && <ErrorBanner message={error} />}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Bills Detected"  value={bills.length}        icon={FileText}      />
        <StatCard title="Comment Drafts"  value={bills.length}        icon={MessageSquare} />
        <StatCard title="Alerts"          value={alerts.length}       icon={Calendar}      />
        <StatCard title="Recent Bills"    value={recentBills.length}  icon={FileText}      />
      </div>

      {/* Top Priority Bills */}
      <Card>
        <CardHeader>
          <CardTitle>Top Priority Bills</CardTitle>
          <CardDescription>Highest impact animal-policy legislation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {topPriorityBills.length === 0 ? (
            <p className="text-muted-foreground text-sm">No bills found.</p>
          ) : (
            topPriorityBills.map((bill) => (
              <BillRow key={bill.id} bill={bill} href={`/analysis?bill=${bill.id}`} />
            ))
          )}
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Policy Activity</CardTitle>
            <CardDescription>Bills and comments over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="bills"    stroke="#16a34a" fill="#16a34a" fillOpacity={0.5} />
                <Area type="monotone" dataKey="comments" stroke="#2563eb" fill="#2563eb" fillOpacity={0.4} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bills by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bills */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Bills</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/bills">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {recentBills.map((bill) => (
            <BillRow key={bill.id} bill={bill} href={`/analysis?bill=${bill.id}`} />
          ))}
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {alerts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No alerts detected</p>
          ) : (
            alerts.slice(0, 5).map((alert) => (
              <div key={alert.bill_id} className="rounded-lg border p-3">
                <p className="font-medium">{alert.title}</p>
                <p className="text-sm text-red-500">
                  {alert.alert_level} • Impact {alert.impact_score}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
