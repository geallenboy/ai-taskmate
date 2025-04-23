"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BarChart, Clock, Users } from "lucide-react"
import { getAllFeedback } from "@/lib/feedback"
import { getEvents } from "@/lib/analytics"
import { getEnv } from "@/lib/env"
import { motion } from "framer-motion"

// 获取环境配置
const env = getEnv()

// 动画配置
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="container max-w-5xl py-8 px-4 md:py-12 md:px-6 m-auto">
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
            性能仪表板
          </h1>
          <Link href="/">
            <Button 
              variant="outline" 
              className="border-slate-700 bg-slate-800/50 text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回首页
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex h-60 items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-600 border-t-indigo-500"></div>
              <p className="text-slate-300">加载数据中...</p>
            </div>
          </div>
        ) : (
          <motion.div 
            className="grid gap-6 md:grid-cols-2"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={item}>
              <Card className="overflow-hidden border-0 bg-slate-800/50 backdrop-blur-sm shadow-lg hover:shadow-indigo-500/10 transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-slate-700/30">
                  <CardTitle className="text-sm font-medium text-slate-200">总任务数</CardTitle>
                  <div className="rounded-full bg-indigo-500/10 p-2">
                    <BarChart className="h-4 w-4 text-indigo-400" />
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-white">{stats.totalTasks}</div>
                  <p className="text-xs text-slate-400 mt-2">已完成的AI任务总数</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="overflow-hidden border-0 bg-slate-800/50 backdrop-blur-sm shadow-lg hover:shadow-purple-500/10 transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-slate-700/30">
                  <CardTitle className="text-sm font-medium text-slate-200">平均评分</CardTitle>
                  <div className="rounded-full bg-purple-500/10 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="none"
                      className="h-4 w-4 text-purple-400"
                    >
                      <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z" />
                    </svg>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-white">{stats.averageRating.toFixed(1)}<span className="text-lg text-slate-400">/5</span></div>
                  <p className="text-xs text-slate-400 mt-2">用户对结果的平均评分</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="overflow-hidden border-0 bg-slate-800/50 backdrop-blur-sm shadow-lg hover:shadow-cyan-500/10 transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-slate-700/30">
                  <CardTitle className="text-sm font-medium text-slate-200">平均完成时间</CardTitle>
                  <div className="rounded-full bg-cyan-500/10 p-2">
                    <Clock className="h-4 w-4 text-cyan-400" />
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-white">{stats.averageCompletionTime.toFixed(1)}<span className="text-lg text-slate-400">秒</span></div>
                  <p className="text-xs text-slate-400 mt-2">任务平均处理时间</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="overflow-hidden border-0 bg-slate-800/50 backdrop-blur-sm shadow-lg hover:shadow-emerald-500/10 transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-slate-700/30">
                  <CardTitle className="text-sm font-medium text-slate-200">用户数</CardTitle>
                  <div className="rounded-full bg-emerald-500/10 p-2">
                    <Users className="h-4 w-4 text-emerald-400" />
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-white">{stats.totalUsers}</div>
                  <p className="text-xs text-slate-400 mt-2">使用系统的唯一用户数</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div 
              variants={item}
              className="md:col-span-2"
            >
              {env.TRACING_ENABLED ? (
                <Card className="overflow-hidden border-0 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm shadow-lg">
                  <CardHeader className="border-b border-slate-700/30">
                    <CardTitle className="text-lg text-slate-100">LangSmith 集成</CardTitle>
                    <CardDescription className="text-slate-400">查看更详细的性能数据和分析</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="mb-6 text-slate-300">
                      您的应用已与 LangSmith 平台集成。要查看更详细的性能数据、跟踪信息和分析，请访问 LangSmith 控制台。
                    </p>
                    <Button
                      onClick={() => {
                        window.open("https://smith.langchain.com", "_blank")
                      }}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-blue-500/20 transition-all duration-200"
                    >
                      打开 LangSmith 控制台
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="overflow-hidden border-0 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm shadow-lg">
                  <CardHeader className="border-b border-slate-700/30">
                    <CardTitle className="text-lg text-slate-100">LangSmith 集成已禁用</CardTitle>
                    <CardDescription className="text-slate-400">跟踪功能当前已禁用</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-slate-300">
                      LangChain 跟踪功能当前已禁用。如果您想启用详细的性能跟踪和分析，请将 LANGCHAIN_TRACING_V2
                      环境变量设置为 "true"，并提供有效的 LANGCHAIN_API_KEY。
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
