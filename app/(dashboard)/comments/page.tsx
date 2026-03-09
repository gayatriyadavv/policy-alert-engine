"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  MessageSquare, 
  Copy, 
  Download, 
  RefreshCw, 
  Check,
  Sparkles,
  Send,
  FileText
} from "lucide-react"

// Mock bills for comment generation
const bills = [
  { id: 1, title: "Endangered Species Protection Act", animal: "Eagle" },
  { id: 2, title: "Marine Sanctuary Expansion Bill", animal: "Dolphin" },
  { id: 3, title: "Forest Conservation Amendment", animal: "Bear" },
]

// Mock generated comments based on tone
const commentTemplates: Record<string, string> = {
  formal: `Dear Committee Members,

I am writing to express my strong support for the Endangered Species Protection Act currently under consideration. As a concerned citizen deeply invested in the preservation of our nation's biodiversity, I believe this legislation represents a crucial step forward in wildlife conservation.

The proposed expansion of critical habitat designations addresses a fundamental need for endangered species recovery. Scientific research consistently demonstrates that habitat loss remains the primary threat to species survival, and this bill's provisions would significantly strengthen protections for vulnerable ecosystems.

Furthermore, the increased penalties for poaching included in this legislation send a clear message about our society's commitment to wildlife protection. The additional funding for conservation programs will enable crucial research and on-the-ground protection efforts.

I urge you to support this bill and ensure its passage. Our wildlife heritage depends on decisive action today.

Respectfully submitted,
[Your Name]
[Your Organization]`,

  passionate: `To the Honorable Committee Members,

Our wildlife needs your voice NOW. The Endangered Species Protection Act is not just another piece of legislation - it's a lifeline for over 1,200 species hanging on the edge of extinction.

Every day we delay, we lose precious habitats. Every day we wait, another species inches closer to disappearing forever. This bill is our chance to turn the tide!

The expansion of critical habitat designations will create safe havens for our most vulnerable wildlife. The strengthened penalties will finally give poaching the serious consequences it deserves. And the conservation funding? It will empower the dedicated researchers and rangers fighting on the front lines of this battle.

I'm calling on you to be champions for those who cannot speak for themselves. Vote YES on this bill and write your name into the history of conservation heroes!

With urgent hope,
[Your Name]`,

  concise: `Dear Committee,

I support the Endangered Species Protection Act for three key reasons:

1. Habitat Protection: The expanded critical habitat designations directly address the primary cause of species decline.

2. Enforcement: Stronger poaching penalties will improve deterrence and compliance.

3. Investment: Additional conservation funding will accelerate recovery efforts for endangered species.

Please vote in favor of this important legislation.

Thank you,
[Your Name]`,
}

const animalIcons: Record<string, string> = {
  Eagle: "🦅",
  Dolphin: "🐬",
  Bear: "🐻",
}

export default function CommentsPage() {
  const [selectedBillId, setSelectedBillId] = useState<string>("1")
  const [tone, setTone] = useState<string>("formal")
  const [comment, setComment] = useState(commentTemplates.formal)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const selectedBill = bills.find(b => b.id.toString() === selectedBillId) || bills[0]

  const handleGenerate = () => {
    setIsGenerating(true)
    // Simulate AI generation delay
    setTimeout(() => {
      setComment(commentTemplates[tone] || commentTemplates.formal)
      setIsGenerating(false)
    }, 1500)
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
    a.download = `comment-${selectedBill.title.toLowerCase().replace(/\s+/g, "-")}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Comment Draft Generator
        </h1>
        <p className="text-muted-foreground">
          The Parrot's Voice - AI-powered advocacy letter generation
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Controls */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Select Bill
              </CardTitle>
              <CardDescription>Choose the legislation to comment on</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedBillId} onValueChange={setSelectedBillId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a bill" />
                </SelectTrigger>
                <SelectContent>
                  {bills.map((bill) => (
                    <SelectItem key={bill.id} value={bill.id.toString()}>
                      <div className="flex items-center gap-2">
                        <span>{animalIcons[bill.animal]}</span>
                        <span className="truncate">{bill.title}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Comment Tone
              </CardTitle>
              <CardDescription>Select the style of your letter</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { id: "formal", label: "Formal", description: "Professional and detailed" },
                { id: "passionate", label: "Passionate", description: "Urgent and emotional" },
                { id: "concise", label: "Concise", description: "Brief and to-the-point" },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setTone(option.id)}
                  className={`w-full rounded-lg border p-3 text-left transition-colors ${
                    tone === option.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-muted-foreground">{option.description}</div>
                </button>
              ))}
            </CardContent>
          </Card>

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

        {/* Generated Comment */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{animalIcons[selectedBill.animal]}</span>
                    Generated Comment
                  </CardTitle>
                  <CardDescription>
                    For: {selectedBill.title}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="capitalize">{tone}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[400px] resize-none font-mono text-sm leading-relaxed"
                placeholder="Your generated comment will appear here..."
              />
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={handleCopy}>
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy to Clipboard
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download as Text
                </Button>
                <Button className="ml-auto">
                  <Send className="mr-2 h-4 w-4" />
                  Submit Comment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
