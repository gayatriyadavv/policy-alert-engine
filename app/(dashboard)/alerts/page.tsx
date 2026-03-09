"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Bell, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  CheckCircle,
  X,
  Settings,
  Filter,
  ChevronRight,
  Volume2,
  VolumeX
} from "lucide-react"
import Link from "next/link"

// Mock alert data
const allAlerts = [
  {
    id: 1,
    type: "urgent",
    title: "Endangered Species Act Vote Tomorrow",
    description: "Final Senate vote scheduled for tomorrow at 2 PM EST. All stakeholders encouraged to contact representatives.",
    animal: "Eagle",
    deadline: "March 7, 2024",
    time: "2 hours ago",
    read: false,
    category: "vote"
  },
  {
    id: 2,
    type: "warning",
    title: "Comment Period Closing: Marine Sanctuary Bill",
    description: "Public comment period ends in 3 days. Ensure all advocacy letters are submitted before deadline.",
    animal: "Dolphin",
    deadline: "March 10, 2024",
    time: "5 hours ago",
    read: false,
    category: "deadline"
  },
  {
    id: 3,
    type: "urgent",
    title: "Emergency Hearing: Forest Amendment",
    description: "Unexpected committee hearing added. Key testimony opportunity for conservation advocates.",
    animal: "Bear",
    deadline: "March 8, 2024",
    time: "1 day ago",
    read: false,
    category: "hearing"
  },
  {
    id: 4,
    type: "info",
    title: "New Co-sponsor Added: Wildlife Corridor Act",
    description: "Senator Johnson has joined as a co-sponsor, bringing total support to 48 senators.",
    animal: "Wolf",
    deadline: null,
    time: "2 days ago",
    read: true,
    category: "update"
  },
  {
    id: 5,
    type: "warning",
    title: "Amendment Proposed: Clean Water Act",
    description: "New amendment could weaken protections for wetland habitats. Review and prepare response.",
    animal: "Otter",
    deadline: "March 15, 2024",
    time: "3 days ago",
    read: true,
    category: "amendment"
  },
  {
    id: 6,
    type: "info",
    title: "House Passes Pollinator Protection Bill",
    description: "Bill moves to Senate with bipartisan support. 287-148 vote margin.",
    animal: "Bee",
    deadline: null,
    time: "4 days ago",
    read: true,
    category: "update"
  },
]

const upcomingDeadlines = [
  { id: 1, title: "Senate Vote: Endangered Species Act", date: "Mar 7", type: "vote", urgent: true },
  { id: 2, title: "Comment Deadline: Marine Sanctuary", date: "Mar 10", type: "comment", urgent: true },
  { id: 3, title: "Hearing: Forest Amendment", date: "Mar 12", type: "hearing", urgent: false },
  { id: 4, title: "Committee Review: Wildlife Corridor", date: "Mar 18", type: "review", urgent: false },
  { id: 5, title: "Public Forum: Climate Bill", date: "Mar 22", type: "forum", urgent: false },
]

const animalIcons: Record<string, string> = {
  Eagle: "🦅",
  Dolphin: "🐬",
  Bear: "🐻",
  Wolf: "🐺",
  Otter: "🦦",
  Bee: "🐝",
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(allAlerts)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [filter, setFilter] = useState("all")

  const unreadCount = alerts.filter(a => !a.read).length

  const filteredAlerts = alerts.filter(alert => {
    if (filter === "all") return true
    if (filter === "unread") return !alert.read
    return alert.type === filter
  })

  const markAsRead = (id: number) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, read: true } : a))
  }

  const dismissAlert = (id: number) => {
    setAlerts(alerts.filter(a => a.id !== id))
  }

  const markAllRead = () => {
    setAlerts(alerts.map(a => ({ ...a, read: true })))
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "urgent": return <AlertTriangle className="h-5 w-5 text-destructive" />
      case "warning": return <Clock className="h-5 w-5 text-accent" />
      case "info": return <CheckCircle className="h-5 w-5 text-primary" />
      default: return <Bell className="h-5 w-5" />
    }
  }

  const getAlertStyle = (type: string, read: boolean) => {
    const base = read ? "opacity-60" : ""
    switch (type) {
      case "urgent": return `${base} border-l-4 border-l-destructive bg-destructive/5`
      case "warning": return `${base} border-l-4 border-l-accent bg-accent/5`
      case "info": return `${base} border-l-4 border-l-primary bg-primary/5`
      default: return base
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Alerts Center
          </h1>
          <p className="text-muted-foreground">
            The Meerkat's Watch - Stay vigilant on policy developments
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Notifications</span>
            <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setSoundEnabled(!soundEnabled)}
            aria-label={soundEnabled ? "Mute sounds" : "Enable sounds"}
          >
            {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Alerts List */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5" />
                  <CardTitle>Policy Alerts</CardTitle>
                  {unreadCount > 0 && (
                    <Badge variant="destructive">{unreadCount} new</Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={markAllRead}>
                    Mark all read
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" onValueChange={setFilter}>
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unread">Unread</TabsTrigger>
                  <TabsTrigger value="urgent">Urgent</TabsTrigger>
                  <TabsTrigger value="warning">Warnings</TabsTrigger>
                </TabsList>

                <TabsContent value={filter} className="space-y-3">
                  {filteredAlerts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <CheckCircle className="h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-4 text-muted-foreground">No alerts to show</p>
                    </div>
                  ) : (
                    filteredAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`group rounded-lg border p-4 transition-all hover:shadow-sm ${getAlertStyle(alert.type, alert.read)}`}
                        onClick={() => markAsRead(alert.id)}
                      >
                        <div className="flex gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background text-lg shadow-sm">
                            {animalIcons[alert.animal]}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                {getAlertIcon(alert.type)}
                                <h4 className="font-semibold">{alert.title}</h4>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  dismissAlert(alert.id)
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground">{alert.description}</p>
                            <div className="flex flex-wrap items-center gap-2 pt-2">
                              {alert.deadline && (
                                <Badge variant="outline" className="gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {alert.deadline}
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground">{alert.time}</span>
                              {!alert.read && (
                                <Badge className="bg-primary/10 text-primary">New</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Deadlines
              </CardTitle>
              <CardDescription>Key dates for the next 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingDeadlines.map((deadline) => (
                  <div
                    key={deadline.id}
                    className={`flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 ${
                      deadline.urgent ? "border-destructive/50" : ""
                    }`}
                  >
                    <div className={`rounded-lg px-2 py-1 text-center ${
                      deadline.urgent ? "bg-destructive/10 text-destructive" : "bg-muted"
                    }`}>
                      <div className="text-xs font-medium">{deadline.date.split(" ")[0]}</div>
                      <div className="text-lg font-bold">{deadline.date.split(" ")[1]}</div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{deadline.title}</p>
                      <Badge variant="outline" className="mt-1 text-xs capitalize">
                        {deadline.type}
                      </Badge>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Alert Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Alerts</p>
                  <p className="text-sm text-muted-foreground">Receive daily digest</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Urgent Only</p>
                  <p className="text-sm text-muted-foreground">High priority items</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Comment Deadlines</p>
                  <p className="text-sm text-muted-foreground">48-hour reminders</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button variant="outline" className="w-full">
                <Filter className="mr-2 h-4 w-4" />
                Customize Filters
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
