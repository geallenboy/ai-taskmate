"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Share2, Download, RefreshCw } from "lucide-react"
import { useAgentStore } from "@/stores/agent-store"

export default function ResultPage() {
  const router = useRouter()
  const { userGoal, finalResult, isComplete } = useAgentStore()

  useEffect(() => {
    if (!userGoal || !isComplete) {
      router.push("/")
    }
  }, [userGoal, isComplete, router])

  const handleShare = () => {
    // Implement share functionality
    alert("Share functionality would be implemented here")
  }

  const handleSave = () => {
    // Implement save functionality
    const blob = new Blob([finalResult], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "taskmate-result.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleRestart = () => {
    router.push("/")
  }

  if (!userGoal || !isComplete) {
    return null // Will redirect to home
  }

  return (
    <div className="container max-w-4xl py-12">
      <Card>
        <CardHeader>
          <CardTitle>Your Task Results</CardTitle>
          <CardDescription>Here's what our AI agents have prepared for your goal: {userGoal}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none dark:prose-invert">
            <div className="whitespace-pre-wrap rounded-lg bg-gray-50 p-6 dark:bg-gray-900">{finalResult}</div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleRestart}>
            <RefreshCw className="mr-2 h-4 w-4" />
            New Task
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button onClick={handleSave}>
              <Download className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
