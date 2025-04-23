"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, ExternalLink } from "lucide-react"
import { useAgentStore } from "@/stores/agent-store"
import { formatDate } from "@/lib/utils"

export default function HistoryPage() {
  const { taskHistory } = useAgentStore()
  const router = useRouter()

  if (taskHistory.length === 0) {
    return (
      <div className="container max-w-4xl py-12">
        <Card>
          <CardHeader>
            <CardTitle>任务历史</CardTitle>
            <CardDescription>您还没有完成任何任务</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="mb-6 text-center text-muted-foreground">开始您的第一个任务，它将显示在这里</p>
            <Button onClick={() => router.push("/")}>创建新任务</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">任务历史</h1>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回首页
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {taskHistory.map((task) => (
          <Card key={task.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{task.goal}</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-4 w-4" />
                  {formatDate(task.date)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3 text-sm text-muted-foreground">{task.result.substring(0, 200)}...</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" onClick={() => router.push(`/history/${task.id}`)}>
                查看完整结果
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
