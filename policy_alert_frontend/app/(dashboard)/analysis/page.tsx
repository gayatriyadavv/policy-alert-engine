"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AnalysisPage() {

  const [bill, setBill] = useState("")
  const [draft, setDraft] = useState("")
  const [impact, setImpact] = useState(0)
  const [category, setCategory] = useState("")
  const [priority, setPriority] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const params = new URLSearchParams(window.location.search)
    const billId = params.get("bill")

    if (!billId) {
      setLoading(false)
      return
    }

    fetch(`http://localhost:8000/analyze/${billId}`)
      .then(res => res.json())
      .then(data => {

        setBill(data.bill)
        setDraft(data.draft_comment)
        setImpact(data.impact_score)
        setCategory(data.category)
        setPriority(data.priority)
        setLoading(false)

      })
      .catch(err => {

        console.error("Failed to load analysis:", err)
        setLoading(false)

      })

  }, [])

  if (loading) {
    return (
      <div className="p-10">
        <h2 className="text-xl font-bold">Analyzing bill...</h2>
      </div>
    )
  }

  const priorityColor =
    priority === "Critical"
      ? "text-red-600"
      : priority === "High"
      ? "text-orange-500"
      : priority === "Medium"
      ? "text-yellow-500"
      : "text-gray-500"

  return (

    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">Bill Analysis</h1>
        <p className="text-muted-foreground">
          AI policy impact review
        </p>
      </div>

      {/* BILL INFO */}

      <Card>

        <CardHeader>
          <CardTitle>Bill Title</CardTitle>
        </CardHeader>

        <CardContent>

          <p className="font-medium mb-2">{bill}</p>

          <p className="text-sm text-muted-foreground">
            Category: {category}
          </p>

        </CardContent>

      </Card>


      {/* IMPACT SCORE */}

      <Card>

        <CardHeader>
          <CardTitle>Policy Impact Score</CardTitle>
        </CardHeader>

        <CardContent>

          <div className="flex items-center justify-between mb-2">

            <p className="text-lg font-semibold">
              {impact} / 100
            </p>

            <p className={`font-semibold ${priorityColor}`}>
              {priority} Priority
            </p>

          </div>

          <div className="w-full bg-gray-200 rounded-full h-4">

            <div
              className="bg-green-600 h-4 rounded-full"
              style={{ width: `${impact}%` }}
            />

          </div>

        </CardContent>

      </Card>


      {/* RECOMMENDED ACTION */}

      <Card>

        <CardHeader>
          <CardTitle>Recommended Action</CardTitle>
        </CardHeader>

        <CardContent>

          {priority === "Critical" && (
            <p>
              Immediate advocacy recommended. Submit public comments and notify policy teams.
            </p>
          )}

          {priority === "High" && (
            <p>
              Monitor closely and prepare advocacy comments before legislative deadlines.
            </p>
          )}

          {priority === "Medium" && (
            <p>
              Track policy developments and evaluate potential impact on animal welfare.
            </p>
          )}

          {priority === "Low" && (
            <p>
              Minimal immediate impact. Continue monitoring.
            </p>
          )}

        </CardContent>

      </Card>


      {/* AI DRAFT */}

      <Card>

        <CardHeader>
          <CardTitle>AI Generated Comment Draft</CardTitle>
        </CardHeader>

        <CardContent>

          <p className="whitespace-pre-wrap text-sm">
            {draft}
          </p>

        </CardContent>

      </Card>

    </div>

  )
}