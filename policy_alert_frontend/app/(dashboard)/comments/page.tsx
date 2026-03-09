"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Copy,
  Download,
  RefreshCw,
  Check,
  Sparkles,
  Send,
  FileText,
  MessageSquare
} from "lucide-react"

const animalIcons: Record<string, string> = {
  Owl: "🦉",
  Eagle: "🦅",
  Dolphin: "🐬",
  Bear: "🐻",
}

export default function CommentsPage() {

  const [bills, setBills] = useState<any[]>([])
  const [selectedBillId, setSelectedBillId] = useState("")
  const [tone, setTone] = useState("formal")
  const [comment, setComment] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {

    fetch("http://localhost:8000/bills")
      .then(res => res.json())
      .then(data => {

        setBills(data.bills || [])

        if (data.bills && data.bills.length > 0) {
          setSelectedBillId(data.bills[0].id.toString())
        }

      })

  }, [])

  const selectedBill =
    bills.find((b: any) => b.id.toString() === selectedBillId)

  const handleGenerate = () => {

    if (!selectedBillId) return

    setIsGenerating(true)

    fetch(`http://localhost:8000/analyze/${selectedBillId}?tone=${tone}`)
      .then(res => res.json())
      .then(data => {

        setComment(data.draft_comment || "")
        setIsGenerating(false)

      })
      .catch(err => {

        console.error(err)
        setIsGenerating(false)

      })

  }

  const handleCopy = async () => {

    await navigator.clipboard.writeText(comment)

    setCopied(true)

    setTimeout(() => setCopied(false), 2000)

  }

  const handleDownload = () => {

    const blob = new Blob([comment], { type: "text/plain" })

    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")

    a.href = url

    a.download = `comment-${selectedBillId}.txt`

    document.body.appendChild(a)

    a.click()

    document.body.removeChild(a)

    URL.revokeObjectURL(url)

  }

  return (

    <div className="space-y-6 max-w-7xl mx-auto">

      <div>

        <h1 className="text-3xl font-bold tracking-tight">
          Comment Draft Generator
        </h1>

        <p className="text-muted-foreground">
          Generate AI advocacy letters for legislation
        </p>

      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {/* LEFT PANEL */}

        <div className="space-y-6">

          {/* BILL SELECT */}

          <Card>

            <CardHeader>

              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Select Bill
              </CardTitle>

              <CardDescription>
                Choose legislation to comment on
              </CardDescription>

            </CardHeader>

            <CardContent>

              <Select
                value={selectedBillId}
                onValueChange={setSelectedBillId}
              >

                <SelectTrigger>
                  <SelectValue placeholder="Select bill" />
                </SelectTrigger>

                <SelectContent>

                  {bills.map((bill: any) => (

                    <SelectItem
                      key={bill.id}
                      value={bill.id.toString()}
                    >

                      <div className="flex items-center gap-2">

                        <span>{animalIcons["Owl"]}</span>

                        <span className="truncate max-w-[220px]">
                          {bill.title}
                        </span>

                      </div>

                    </SelectItem>

                  ))}

                </SelectContent>

              </Select>

            </CardContent>

          </Card>

          {/* TONE SELECT */}

          <Card>

            <CardHeader>

              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Comment Tone
              </CardTitle>

              <CardDescription>
                Choose writing style
              </CardDescription>

            </CardHeader>

            <CardContent>

              <Select value={tone} onValueChange={setTone}>

                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>

                <SelectContent>

                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="passionate">Passionate</SelectItem>
                  <SelectItem value="concise">Concise</SelectItem>

                </SelectContent>

              </Select>

            </CardContent>

          </Card>

          {/* GENERATE BUTTON */}

          <Card className="bg-primary/5 border-primary/20">

            <CardContent className="pt-6">

              <Button
                className="w-full"
                size="lg"
                onClick={handleGenerate}
                disabled={isGenerating}
              >

                {isGenerating ? (

                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>

                ) : (

                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Comment
                  </>

                )}

              </Button>

            </CardContent>

          </Card>

        </div>

        {/* RIGHT PANEL */}

        <div className="lg:col-span-2">

          <Card className="h-full">

            <CardHeader>

              <CardTitle>
                Generated Comment Draft
              </CardTitle>

              <CardDescription className="break-words">
                {selectedBill ? selectedBill.title : "Select a bill"}
              </CardDescription>

            </CardHeader>

            <CardContent className="space-y-4 w-full overflow-hidden">

              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full min-h-[400px] max-h-[500px] resize-none font-mono text-sm overflow-y-auto break-words"
                placeholder="Generated comment will appear here..."
              />

              <div className="flex flex-wrap gap-2">

                <Button variant="outline" onClick={handleCopy}>

                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </>
                  )}

                </Button>

                <Button variant="outline" onClick={handleDownload}>

                  <Download className="mr-2 h-4 w-4" />
                  Download

                </Button>

                <Button className="ml-auto">

                  <Send className="mr-2 h-4 w-4" />
                  Submit

                </Button>

              </div>

            </CardContent>

          </Card>

        </div>

      </div>

    </div>

  )

}