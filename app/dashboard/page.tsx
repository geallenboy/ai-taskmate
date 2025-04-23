"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BarChart, Clock, Users } from "lucide-react"
import { getAllFeedback } from "@/lib/feedback"
import { getEvents } from "@/lib/analytics"
import { getEnv } from "@/lib/env"

// 获取环境配置
const env = getEnv()
console.log("获取环境变量配置...", process.env.OPENAI_API_KEY)
export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalTasks: 0,
    averageRating: 0,
    averageCompletionTime: 0,
    totalUsers: 0,
  })

  useEffect(() => {
    // 模拟从本地存储加载数据
    const loadData = async () => {
      try {
        // 使用本地数据
        const feedback = getAllFeedback()
        const events = getEvents()

        // 计算统计数据
        const completedTasks = events.filter((e) => e.eventType === "agent_flow_complete")
        const totalTasks = completedTasks.length

        // 计算平均评分
        const ratings = feedback.map((f) => f.rating)
        const averageRating = ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0

        // 计算平均完成时间
        const completionTimes = completedTasks.map((e) => e.properties.duration || 0)
        const averageCompletionTime =
          completionTimes.length > 0
            ? completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length / 1000
            : 0

        // 计算用户数量（基于唯一会话ID）
        const uniqueSessions = new Set(events.map((e) => e.sessionId))
        const totalUsers = uniqueSessions.size

        setStats({
          totalTasks,
          averageRating,
          averageCompletionTime,
          totalUsers,
        })

        setLoading(false)
      } catch (error) {
        console.error("加载仪表板数据失败:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">性能仪表板</h1>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回首页
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <p>加载数据中...</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总任务数</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTasks}</div>
              <p className="text-xs text-muted-foreground">已完成的AI任务总数</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">平均评分</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}/5</div>
              <p className="text-xs text-muted-foreground">用户对结果的平均评分</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">平均完成时间</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageCompletionTime.toFixed(1)}秒</div>
              <p className="text-xs text-muted-foreground">任务平均处理时间</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">用户数</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">使用系统的唯一用户数</p>
            </CardContent>
          </Card>

          {env.TRACING_ENABLED ? (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>LangSmith 集成</CardTitle>
                <CardDescription>查看更详细的性能数据和分析</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  您的应用已与 LangSmith 平台集成。要查看更详细的性能数据、跟踪信息和分析，请访问 LangSmith 控制台。
                </p>
                <Button
                  onClick={() => {
                    window.open("https://smith.langchain.com", "_blank")
                  }}
                >
                  打开 LangSmith 控制台
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>LangSmith 集成已禁用</CardTitle>
                <CardDescription>跟踪功能当前已禁用</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  LangChain 跟踪功能当前已禁用。如果您想启用详细的性能跟踪和分析，请将 LANGCHAIN_TRACING_V2
                  环境变量设置为 "true"，并提供有效的 LANGCHAIN_API_KEY。
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
