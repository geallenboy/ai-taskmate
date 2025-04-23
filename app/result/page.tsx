"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Share2, Download, RefreshCw, Clock } from "lucide-react"
import { useAgentStore } from "@/stores/agent-store"
import EvaluationDisplay from "@/components/evaluation-display"
import FeedbackForm from "@/components/feedback-form"
import { useAnalytics } from "@/hooks/use-analytics"

export default function ResultPage() {
  const router = useRouter()
  const { userGoal, finalResult, isComplete, evaluation } = useAgentStore()
  const { track } = useAnalytics()

  useEffect(() => {
    if (!userGoal || !isComplete) {
      router.push("/")
      return
    }

    track("result_page_view", { goal: userGoal })
  }, [userGoal, isComplete, router, track])

  const handleShare = () => {
    track("result_share_click")
    // 实现分享功能
    alert("分享功能将在此处实现")
  }

  const handleSave = () => {
    track("result_save_click")
    // 实现保存功能
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
    track("new_task_click")
    router.push("/")
  }

  if (!userGoal || !isComplete) {
    return null // 将重定向到首页
  }

  return (
    <div className="container max-w-4xl py-12">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>你的任务结果</CardTitle>
              <CardDescription>这是我们的AI代理为你的目标准备的内容：{userGoal}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none dark:prose-invert">
                <div className="whitespace-pre-wrap rounded-lg bg-gray-50 p-6 dark:bg-gray-900">{finalResult}</div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleRestart}>
                <RefreshCw className="mr-2 h-4 w-4" />
                新任务
              </Button>
              <Button variant="outline" onClick={() => router.push("/history")}>
                <Clock className="mr-2 h-4 w-4" />
                查看历史
              </Button>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  分享
                </Button>
                <Button onClick={handleSave}>
                  <Download className="mr-2 h-4 w-4" />
                  保存
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          {evaluation ? (
            <EvaluationDisplay evaluation={evaluation} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>结果评估</CardTitle>
                <CardDescription>评估数据不可用</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">无法获取此结果的评估数据。</p>
              </CardContent>
            </Card>
          )}

          <FeedbackForm taskId={Date.now().toString()} onFeedbackSubmitted={() => track("feedback_submitted")} />
        </div>
      </div>
    </div>
  )
}
