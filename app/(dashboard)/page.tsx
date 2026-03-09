"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { 
  FileText, 
  Calendar, 
  MessageSquare, 
  TrendingUp,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react"
import Link from "next/link"

// Mock data for the dashboard
const activityData = [
  { month: "Jan", bills: 12, hearings: 4, comments: 8 },
  { month: "Feb", bills: 19, hearings: 6, comments: 15 },
  { month: "Mar", bills: 15, hearings: 8, comments: 12 },
  { month: "Apr", bills: 25, hearings: 10, comments: 22 },
  { month: "May", bills: 32, hearings: 12, comments: 28 },
  { month: "Jun", bills: 28, hearings: 9, comments: 25 },
]

const categoryData = [
  { category: "Wildlife", count: 24 },
  { category: "Marine", count: 18 },
  { category: "Forests", count: 15 },
  { category: "Climate", count: 21 },
  { category: "Agriculture", count: 12 },
]

const recentBills = [
  { id: 1, title: "Endangered Species Protection Act", status: "active", impact: "high", animal: "Eagle" },
  { id: 2, title: "Marine Sanctuary Expansion Bill", status: "pending", impact: "medium", animal: "Dolphin" },
  { id: 3, title: "Forest Conservation Amendment", status: "active", impact: "high", animal: "Bear" },
  { id: 4, title: "Wildlife Corridor Funding Act", status: "review", impact: "medium", animal: "Wolf" },
]

const upcomingEvents = [
  { id: 1, title: "Senate Hearing: Wildlife Protection", date: "Mar 15", type: "hearing" },
  { id: 2, title: "Comment Period Ends: Marine Bill", date: "Mar 18", type: "deadline" },
  { id: 3, title: "House Vote: Forest Amendment", date: "Mar 22", type: "vote" },
]

const animalIcons: Record<string, string> = {
  Eagle: "🦅",
  Dolphin: "🐬",
  Bear: "🐻",
  Wolf: "🐺",
}

export default function DashboardPage() {
  // Compute colors for charts
  const chartColors = {
    primary: "#2d7a4f",
    secondary: "#c9a227",
    tertiary: "#3b82f6",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome to the Jungle
          </h1>
          <p className="text-muted-foreground">
            Your wild guide to policy monitoring and advocacy
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            This Week
          </Button>
          <Button size="sm">
            <TrendingUp className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Bills Detected</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-primary">+12%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Hearings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Next hearing in <span className="text-accent">3 days</span>
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-chart-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Comment Periods</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-destructive">3 closing soon</span>
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-chart-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Policy Activity Over Time</CardTitle>
            <CardDescription>
              Track bills, hearings, and comment periods across months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                bills: { label: "Bills", color: chartColors.primary },
                hearings: { label: "Hearings", color: chartColors.secondary },
                comments: { label: "Comments", color: chartColors.tertiary },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="bills"
                    stackId="1"
                    stroke={chartColors.primary}
                    fill={chartColors.primary}
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="hearings"
                    stackId="2"
                    stroke={chartColors.secondary}
                    fill={chartColors.secondary}
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="comments"
                    stackId="3"
                    stroke={chartColors.tertiary}
                    fill={chartColors.tertiary}
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Bills by Category</CardTitle>
            <CardDescription>
              Distribution of active legislation by policy area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: { label: "Bills", color: chartColors.primary },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical" margin={{ top: 10, right: 30, left: 60, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="category" type="category" className="text-xs" width={60} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill={chartColors.primary} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bills and Events */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Bills</CardTitle>
              <CardDescription>Latest legislation requiring attention</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/bills">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBills.map((bill) => (
                <div
                  key={bill.id}
                  className="flex items-center gap-4 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg">
                    {animalIcons[bill.animal]}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{bill.title}</p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={bill.status === "active" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {bill.status}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          bill.impact === "high" ? "border-destructive text-destructive" : ""
                        }`}
                      >
                        {bill.impact} impact
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Important dates and deadlines</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/alerts">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-4 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    event.type === "hearing" ? "bg-primary/10 text-primary" :
                    event.type === "deadline" ? "bg-destructive/10 text-destructive" :
                    "bg-accent/20 text-accent-foreground"
                  }`}>
                    {event.type === "hearing" ? <Calendar className="h-5 w-5" /> :
                     event.type === "deadline" ? <Clock className="h-5 w-5" /> :
                     <CheckCircle className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.date}, 2024</p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {event.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
