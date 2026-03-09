"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Target,
  Sparkles,
  ArrowRight,
  Lightbulb
} from "lucide-react"
import Link from "next/link"

// Mock bill data for analysis
const bills = [
  { 
    id: 1, 
    title: "Endangered Species Protection Act",
    animal: "Eagle",
    summary: "This comprehensive bill aims to strengthen protections for endangered species by expanding critical habitat designations, increasing penalties for poaching, and providing additional funding for conservation programs. The act would affect over 1,200 species currently listed as endangered or threatened.",
    keywords: ["endangered species", "habitat protection", "conservation funding", "poaching penalties", "wildlife corridors"],
    impactScore: 95,
    impactBreakdown: {
      habitat: 92,
      funding: 88,
      enforcement: 95,
      research: 78
    },
    advocacyActions: [
      { priority: "high", action: "Submit public comment supporting habitat expansion provisions" },
      { priority: "high", action: "Contact local representatives to voice support" },
      { priority: "medium", action: "Organize community awareness campaign" },
      { priority: "low", action: "Share bill information on social media" },
    ],
    status: "Active",
    nextDeadline: "March 25, 2024"
  },
  { 
    id: 2, 
    title: "Marine Sanctuary Expansion Bill",
    animal: "Dolphin",
    summary: "Proposes to expand existing marine sanctuaries by 40% and establish three new protected areas along coastal regions. The bill includes provisions for sustainable fishing practices and marine research funding.",
    keywords: ["marine protection", "ocean conservation", "sustainable fishing", "sanctuary expansion", "coastal ecosystems"],
    impactScore: 82,
    impactBreakdown: {
      habitat: 88,
      funding: 75,
      enforcement: 80,
      research: 85
    },
    advocacyActions: [
      { priority: "high", action: "Attend upcoming senate hearing on marine protection" },
      { priority: "medium", action: "Partner with coastal communities for support" },
      { priority: "medium", action: "Submit scientific data supporting expansion" },
      { priority: "low", action: "Create educational materials about marine life" },
    ],
    status: "Pending",
    nextDeadline: "April 10, 2024"
  },
  { 
    id: 3, 
    title: "Forest Conservation Amendment",
    animal: "Bear",
    summary: "Amends existing forest management policies to prioritize old-growth forest preservation and implement stricter logging regulations. Includes provisions for reforestation programs and wildlife corridor maintenance.",
    keywords: ["forest preservation", "old-growth protection", "logging regulations", "reforestation", "carbon sequestration"],
    impactScore: 88,
    impactBreakdown: {
      habitat: 94,
      funding: 72,
      enforcement: 86,
      research: 80
    },
    advocacyActions: [
      { priority: "high", action: "Rally support from environmental organizations" },
      { priority: "high", action: "Provide testimony at committee hearing" },
      { priority: "medium", action: "Document affected forest areas" },
      { priority: "low", action: "Engage with timber industry stakeholders" },
    ],
    status: "Active",
    nextDeadline: "March 30, 2024"
  },
]

const animalIcons: Record<string, string> = {
  Eagle: "🦅",
  Dolphin: "🐬",
  Bear: "🐻",
}

export default function AnalysisPage() {
  const [selectedBillId, setSelectedBillId] = useState<string>("1")
  const selectedBill = bills.find(b => b.id.toString() === selectedBillId) || bills[0]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-destructive bg-destructive/10 text-destructive"
      case "medium": return "border-accent bg-accent/10 text-accent-foreground"
      case "low": return "border-muted bg-muted text-muted-foreground"
      default: return ""
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Bill Analysis
          </h1>
          <p className="text-muted-foreground">
            The Fox's Deep Dive - Detailed policy impact assessment
          </p>
        </div>
        <Select value={selectedBillId} onValueChange={setSelectedBillId}>
          <SelectTrigger className="w-full md:w-[320px]">
            <SelectValue placeholder="Select a bill to analyze" />
          </SelectTrigger>
          <SelectContent>
            {bills.map((bill) => (
              <SelectItem key={bill.id} value={bill.id.toString()}>
                <div className="flex items-center gap-2">
                  <span>{animalIcons[bill.animal]}</span>
                  <span>{bill.title}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bill Header Card */}
      <Card className="overflow-hidden">
        <div className="flex items-center gap-4 border-b border-border bg-muted/30 p-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
            {animalIcons[selectedBill.animal]}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{selectedBill.title}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Badge variant="default">{selectedBill.status}</Badge>
              <Badge variant="outline">Deadline: {selectedBill.nextDeadline}</Badge>
              <Badge variant="secondary">{selectedBill.animal} Guardian</Badge>
            </div>
          </div>
          <div className="hidden text-right md:block">
            <div className="text-3xl font-bold text-primary">{selectedBill.impactScore}</div>
            <div className="text-sm text-muted-foreground">Impact Score</div>
          </div>
        </div>
      </Card>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Summary and Keywords */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-muted-foreground">
                {selectedBill.summary}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Relevant Keywords
              </CardTitle>
              <CardDescription>Key terms and topics covered in this bill</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {selectedBill.keywords.map((keyword, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Suggested Advocacy Actions
              </CardTitle>
              <CardDescription>Recommended actions based on bill analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedBill.advocacyActions.map((item, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center gap-3 rounded-lg border p-3 ${getPriorityColor(item.priority)}`}
                  >
                    {item.priority === "high" ? (
                      <AlertTriangle className="h-5 w-5 shrink-0" />
                    ) : item.priority === "medium" ? (
                      <TrendingUp className="h-5 w-5 shrink-0" />
                    ) : (
                      <CheckCircle className="h-5 w-5 shrink-0" />
                    )}
                    <span className="flex-1 text-sm">{item.action}</span>
                    <Badge variant="outline" className="capitalize shrink-0">
                      {item.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Impact Score Breakdown */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Policy Impact Score
              </CardTitle>
              <CardDescription>Breakdown by category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="relative flex h-32 w-32 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-muted"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray={`${selectedBill.impactScore * 2.51} 251`}
                      className="text-primary transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <div className="text-3xl font-bold">{selectedBill.impactScore}</div>
                    <div className="text-xs text-muted-foreground">Overall</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {Object.entries(selectedBill.impactBreakdown).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{key}</span>
                      <span className="font-medium">{value}%</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Sparkles className="h-5 w-5" />
                Generate Comment
              </CardTitle>
              <CardDescription>Create an AI-powered advocacy letter</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link href={`/comments?bill=${selectedBill.id}`}>
                  Draft Comment Letter
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
