"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, Filter, FileText, ExternalLink, SlidersHorizontal } from "lucide-react"
import Link from "next/link"

// Mock bill data with animal associations
const allBills = [
  { id: 1, title: "Endangered Species Protection Act", category: "Wildlife", impact: 95, status: "Active", animal: "Eagle", date: "2024-03-01" },
  { id: 2, title: "Marine Sanctuary Expansion Bill", category: "Marine", impact: 82, status: "Pending", animal: "Dolphin", date: "2024-02-28" },
  { id: 3, title: "Forest Conservation Amendment", category: "Forests", impact: 88, status: "Active", animal: "Bear", date: "2024-02-25" },
  { id: 4, title: "Wildlife Corridor Funding Act", category: "Wildlife", impact: 76, status: "Review", animal: "Wolf", date: "2024-02-22" },
  { id: 5, title: "Clean Water for Habitats Act", category: "Marine", impact: 91, status: "Active", animal: "Otter", date: "2024-02-20" },
  { id: 6, title: "National Park Expansion Initiative", category: "Forests", impact: 84, status: "Pending", animal: "Deer", date: "2024-02-18" },
  { id: 7, title: "Pollinator Protection Program", category: "Wildlife", impact: 79, status: "Active", animal: "Bee", date: "2024-02-15" },
  { id: 8, title: "Wetland Preservation Act", category: "Marine", impact: 86, status: "Review", animal: "Heron", date: "2024-02-12" },
  { id: 9, title: "Climate Resilience for Wildlife", category: "Climate", impact: 93, status: "Active", animal: "Polar Bear", date: "2024-02-10" },
  { id: 10, title: "Sustainable Agriculture Reform", category: "Agriculture", impact: 71, status: "Pending", animal: "Owl", date: "2024-02-08" },
  { id: 11, title: "Coral Reef Protection Act", category: "Marine", impact: 89, status: "Active", animal: "Sea Turtle", date: "2024-02-05" },
  { id: 12, title: "Migratory Bird Treaty Update", category: "Wildlife", impact: 77, status: "Review", animal: "Goose", date: "2024-02-03" },
]

const categories = ["All", "Wildlife", "Marine", "Forests", "Climate", "Agriculture"]
const statuses = ["All", "Active", "Pending", "Review"]

const animalIcons: Record<string, string> = {
  Eagle: "🦅",
  Dolphin: "🐬",
  Bear: "🐻",
  Wolf: "🐺",
  Otter: "🦦",
  Deer: "🦌",
  Bee: "🐝",
  Heron: "🦩",
  "Polar Bear": "🐻‍❄️",
  Owl: "🦉",
  "Sea Turtle": "🐢",
  Goose: "🦆",
}

export default function BillsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [sortBy, setSortBy] = useState<"date" | "impact">("date")

  const filteredBills = useMemo(() => {
    return allBills
      .filter((bill) => {
        const matchesSearch = bill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bill.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bill.animal.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = categoryFilter === "All" || bill.category === categoryFilter
        const matchesStatus = statusFilter === "All" || bill.status === statusFilter
        return matchesSearch && matchesCategory && matchesStatus
      })
      .sort((a, b) => {
        if (sortBy === "impact") return b.impact - a.impact
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })
  }, [searchQuery, categoryFilter, statusFilter, sortBy])

  const getImpactColor = (impact: number) => {
    if (impact >= 90) return "bg-destructive/10 text-destructive border-destructive/20"
    if (impact >= 80) return "bg-accent/20 text-accent-foreground border-accent/30"
    if (impact >= 70) return "bg-primary/10 text-primary border-primary/20"
    return "bg-muted text-muted-foreground border-muted"
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Active": return "default"
      case "Pending": return "secondary"
      case "Review": return "outline"
      default: return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Bill Monitor
        </h1>
        <p className="text-muted-foreground">
          The Owl's Eye View - Search and filter all tracked legislation
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Filters</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Showing {filteredBills.length} of {allBills.length} bills
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search bills, categories, or animals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              variant={sortBy === "date" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("date")}
            >
              Sort by Date
            </Button>
            <Button
              variant={sortBy === "impact" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("impact")}
            >
              Sort by Impact
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bills Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-12"></TableHead>
                <TableHead>Bill Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-center">Impact Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBills.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">No bills found matching your criteria</p>
                      <Button variant="ghost" size="sm" onClick={() => {
                        setSearchQuery("")
                        setCategoryFilter("All")
                        setStatusFilter("All")
                      }}>
                        Clear filters
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBills.map((bill) => (
                  <TableRow key={bill.id} className="group">
                    <TableCell>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-lg">
                        {animalIcons[bill.animal] || "🐾"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{bill.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {bill.animal} Guardian • {new Date(bill.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{bill.category}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className={`inline-flex items-center justify-center rounded-full border px-3 py-1 text-sm font-semibold ${getImpactColor(bill.impact)}`}>
                        {bill.impact}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(bill.status)}>{bill.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/analysis?bill=${bill.id}`}>
                            Analyze
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
