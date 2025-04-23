"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download } from "lucide-react"
import { useAgentStore } from "@/stores/agent-store"
import { formatDate } from "@/lib/utils"
import type { TaskHistory } from "@/types"

export default function TaskDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { taskHistory } = useAgentStore()
  const [task, setTask] = useState<TaskHistory | null>(null)

  useEffect(() => {
    if (params.id && taskHistory.length > 0) {
      const foundTask = taskHistory.find((t) => t.id === params.id)
      if (foundTask) {
        setTask(foundTask)
      } else {
        router.push("/history")
      }
    }
  }, [params.id, taskHistory, router])

  const handleSave = () => {
    if (!task) return

    const blob = new Blob([task.result], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `taskmate-${task.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!task) {
    return null
  }

  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/history">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回历史
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-2">
            <CardTitle>{task.goal}</CardTitle>
            <CardDescription>创建于 {formatDate(task.date)}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none dark:prose-invert">
            <div className="whitespace-pre-wrap rounded-lg bg-gray-50 p-6 dark:bg-gray-900">{task.result}</div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSave}>
            <Download className="mr-2 h-4 w-4" />
            保存结果
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
