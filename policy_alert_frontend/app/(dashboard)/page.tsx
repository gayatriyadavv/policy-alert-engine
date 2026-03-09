"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts"

import {
  FileText,
  Calendar,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  RefreshCw
} from "lucide-react"

import Link from "next/link"

export default function DashboardPage() {

  const [bills, setBills] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    async function loadData() {

      try {

        const billsRes = await fetch("http://127.0.0.1:8000/bills")
        const billsData = await billsRes.json()

        if (billsData?.bills) {
          setBills(billsData.bills)
        }

        const alertsRes = await fetch("http://127.0.0.1:8000/alerts")
        const alertsData = await alertsRes.json()

        if (alertsData?.alerts) {
          setAlerts(alertsData.alerts)
        }

      } catch (err) {

        console.error("Dashboard API error:", err)

      }

      setLoading(false)

    }

    loadData()

  }, [])

  const totalBills = bills.length
  const commentDrafts = totalBills
  const alertCount = alerts.length
  const recentBills = bills.slice(0,5)

  const topPriorityBills = [...bills]
    .sort((a:any,b:any)=>b.impact_score-a.impact_score)
    .slice(0,5)

  const handleScan = async () => {

    await fetch("http://127.0.0.1:8000/scan",{
      method:"POST"
    })

    window.location.reload()

  }

  const handleGenerateReport = () => {

    if (!bills.length) {
      alert("No bills available for report")
      return
    }

    const report = `
Policy Alert Engine Report
==========================

Total Bills: ${bills.length}

Bills:
${bills.map((b:any,i:number)=>`${i+1}. ${b.title} (Impact ${b.impact_score})`).join("\n")}

Generated: ${new Date().toLocaleString()}
`

    const blob = new Blob([report], { type: "text/plain" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "policy-report.txt"
    a.click()

    URL.revokeObjectURL(url)
  }

  const activityData = bills.slice(0,6).map((b,i)=>({
    month:`Bill ${i+1}`,
    bills:i+2,
    comments:i+1
  }))

  const categories:any = {}

  bills.forEach((b:any)=>{
    categories[b.category] = (categories[b.category] || 0) + 1
  })

  const categoryData = Object.keys(categories).map((c)=>({
    category:c,
    count:categories[c]
  }))

  if (loading) {
    return <div className="p-10 text-lg">Loading dashboard...</div>
  }

  return (

    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Policy monitoring overview</p>
        </div>

        <div className="flex gap-2">

          <Button onClick={handleScan}>
            <RefreshCw className="mr-2 h-4 w-4"/>
            Scan Bills
          </Button>

          <Button onClick={handleGenerateReport}>
            <TrendingUp className="mr-2 h-4 w-4"/>
            Generate Report
          </Button>

        </div>

      </div>

      {/* STATS */}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm">Bills Detected</CardTitle>
            <FileText className="h-4 w-4"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBills}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm">Comment Drafts</CardTitle>
            <MessageSquare className="h-4 w-4"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{commentDrafts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm">Alerts</CardTitle>
            <Calendar className="h-4 w-4"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm">Recent Bills</CardTitle>
            <FileText className="h-4 w-4"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentBills.length}</div>
          </CardContent>
        </Card>

      </div>

      {/* TOP PRIORITY BILLS */}

      <Card>

        <CardHeader>
          <CardTitle>Top Priority Bills</CardTitle>
          <CardDescription>
            Highest impact animal-policy legislation
          </CardDescription>
        </CardHeader>

        <CardContent>

          {topPriorityBills.map((bill:any)=>(
            <div
              key={bill.id}
              className="flex justify-between border p-3 rounded-lg mb-2"
            >

              <div>
                <p className="font-medium">{bill.title}</p>
                <p className="text-xs text-muted-foreground">
                  Impact {bill.impact_score} • {bill.priority}
                </p>
              </div>

              <Link href={`/analysis?bill=${bill.id}`}>
                <ArrowRight className="h-4 w-4"/>
              </Link>

            </div>
          ))}

        </CardContent>

      </Card>

      {/* CHARTS */}

      <div className="grid gap-4 lg:grid-cols-2">

        <Card>

          <CardHeader>
            <CardTitle>Policy Activity</CardTitle>
            <CardDescription>Bills and comments</CardDescription>
          </CardHeader>

          <CardContent className="h-[300px]">

            <ResponsiveContainer width="100%" height="100%">

              <AreaChart data={activityData}>

                <CartesianGrid strokeDasharray="3 3"/>

                <XAxis dataKey="month"/>

                <YAxis/>

                <Tooltip/>

                <Area
                  type="monotone"
                  dataKey="bills"
                  stroke="#16a34a"
                  fill="#16a34a"
                  fillOpacity={0.5}
                />

                <Area
                  type="monotone"
                  dataKey="comments"
                  stroke="#2563eb"
                  fill="#2563eb"
                  fillOpacity={0.4}
                />

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

                <CartesianGrid strokeDasharray="3 3"/>

                <XAxis dataKey="category"/>

                <YAxis/>

                <Tooltip/>

                <Bar dataKey="count" fill="#16a34a"/>

              </BarChart>

            </ResponsiveContainer>

          </CardContent>

        </Card>

      </div>

      {/* RECENT BILLS */}

      <Card>

        <CardHeader className="flex justify-between">

          <CardTitle>Recent Bills</CardTitle>

          <Button variant="ghost" size="sm" asChild>

            <Link href="/bills">
              View All
              <ArrowRight className="ml-2 h-4 w-4"/>
            </Link>

          </Button>

        </CardHeader>

        <CardContent>

          <div className="space-y-3">

            {recentBills.map((bill:any)=>(
              <div
                key={bill.id}
                className="flex justify-between border p-3 rounded-lg hover:bg-muted"
              >

                <div>
                  <span>{bill.title}</span>
                  <p className="text-xs text-muted-foreground">
                    Impact {bill.impact_score}
                  </p>
                </div>

                <Link href={`/analysis?bill=${bill.id}`}>
                  <ArrowRight className="h-4 w-4"/>
                </Link>

              </div>
            ))}

          </div>

        </CardContent>

      </Card>

      {/* RECENT ALERTS */}

      <Card>

        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>

        <CardContent>

          {alerts.length === 0 ? (
            <p className="text-muted-foreground">No alerts detected</p>
          ) : (
            alerts.slice(0,5).map((alert:any)=>(
              <div
                key={alert.bill_id}
                className="border rounded-lg p-3 mb-2"
              >
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