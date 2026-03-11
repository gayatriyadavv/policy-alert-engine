"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Search } from "lucide-react"
import Link from "next/link"

const categories = ["All", "Wildlife", "Marine", "Forest", "Climate", "Agriculture"]
const statuses = ["All", "Active", "Pending", "Review"]

const animalIcons: Record<string, string> = {
  Owl: "🦉",
  Eagle: "🦅",
  Dolphin: "🐬",
  Bear: "🐻"
}

export default function BillsPage() {

  const [allBills, setAllBills] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [sortBy, setSortBy] = useState<"date" | "impact">("impact")

  useEffect(() => {

    async function loadBills() {

      try {

        const res = await fetch("http://localhost:8000/bills")
        const data = await res.json()

        if (!data?.bills) return

        const billsWithImpact = data.bills.map((bill:any) => ({

          id: bill.id,
          title: bill.title || "Untitled Bill",
          category: bill.category || "Other",

          /* use backend impact score directly */
          impact: bill.impact_score || 0,

          status: bill.status || "Active",
          animal: "Owl",
          date: new Date().toISOString()

        }))

        setAllBills(billsWithImpact)

      } catch (err) {

        console.error("Failed to fetch bills:", err)

      }

    }

    loadBills()

  }, [])


  const filteredBills = useMemo(() => {

    return allBills
      .filter((bill) => {

        const matchesSearch =
          (bill.title || "").toLowerCase().includes(searchQuery.toLowerCase())

        const matchesCategory =
          categoryFilter === "All" || bill.category === categoryFilter

        const matchesStatus =
          statusFilter === "All" || bill.status === statusFilter

        return matchesSearch && matchesCategory && matchesStatus

      })
      .sort((a, b) => {

        if (sortBy === "impact") return b.impact - a.impact

        return new Date(b.date).getTime() - new Date(a.date).getTime()

      })

  }, [allBills, searchQuery, categoryFilter, statusFilter, sortBy])


  /* FIXED PRIORITY LOGIC */
  const getPriority = (impact:number) => {

    if (impact >= 85) return { label: "Critical", variant: "destructive" }
    if (impact >= 65) return { label: "High", variant: "destructive" }
    if (impact >= 45) return { label: "Medium", variant: "default" }

    return { label: "Low", variant: "secondary" }

  }


  return (

    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Bill Monitor
        </h1>
        <p className="text-muted-foreground">
          Search and filter all tracked legislation
        </p>
      </div>


      <Card>

        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Filters</CardTitle>
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
                placeholder="Search bills..."
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


      <Card>

        <CardContent className="p-0">

          <Table>

            <TableHeader>

              <TableRow>
                <TableHead></TableHead>
                <TableHead>Bill Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Impact</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>

            </TableHeader>

            <TableBody>

              {filteredBills.map((bill:any) => {

                const priority = getPriority(bill.impact)

                return (

                  <TableRow key={bill.id}>

                    <TableCell>
                      {animalIcons[bill.animal] || "🦉"}
                    </TableCell>

                    <TableCell className="max-w-[600px] truncate">
                      {bill.title}
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline">{bill.category}</Badge>
                    </TableCell>

                    <TableCell>

                      <Badge
                        variant={
                          bill.impact >= 65
                            ? "destructive"
                            : bill.impact >= 45
                            ? "default"
                            : "secondary"
                        }
                      >
                        {bill.impact}
                      </Badge>

                    </TableCell>

                    <TableCell>
                      <Badge variant={priority.variant as any}>
                        {priority.label}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge 
                        variant={
                          bill.status === "Active" ? "default" :
                          bill.status === "Review" ? "secondary" : 
                          "outline"
                        }
                      >
                        {bill.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">

                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/analysis?bill=${bill.id}`}>
                          Analyze
                        </Link>
                      </Button>

                    </TableCell>

                  </TableRow>

                )

              })}

            </TableBody>

          </Table>

        </CardContent>

      </Card>

    </div>

  )
}