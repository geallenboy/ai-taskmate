"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, ExternalLink, Plus, Loader2 } from "lucide-react"
import { useAgentStore } from "@/stores/agent-store"
import { formatDate } from "@/lib/utils"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

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

export default function HistoryPage() {
  const { taskHistory, initializeFromStorage } = useAgentStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 显式初始化存储
    initializeFromStorage()
    setIsLoading(false)
    
    // 调试输出
    console.log("任务历史数据:", taskHistory)
  }, [initializeFromStorage, taskHistory])

  // 显示加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 px-4 text-white">
        <div className="w-fulls  py-8 md:py-12">
          <Card className="border-0 bg-slate-800/50 backdrop-blur-sm shadow-xl">
            <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
              <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
              <p className="text-center text-slate-400">加载任务历史...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (taskHistory.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 px-4 text-white">
        <div className="w-full  py-8 md:py-12">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
              任务历史
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
          
          <Card className="border-0 bg-slate-800/50 backdrop-blur-sm shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-lg pointer-events-none"></div>
            <CardHeader className="border-b border-slate-700/30">
              <CardTitle className="text-slate-100">暂无历史记录</CardTitle>
              <CardDescription className="text-slate-400">您还没有完成任何任务</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-16 space-y-6">
              <div className="p-6 rounded-full bg-slate-700/30 text-slate-400">
                <Clock className="h-12 w-12" />
              </div>
              <p className="text-center text-slate-400 max-w-md">
                开始您的第一个任务，完成后的记录将显示在这里
              </p>
              <Button 
                onClick={() => router.push("/")}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/20 transition-all duration-200"
              >
                <Plus className="mr-2 h-4 w-4" />
                创建新任务
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 px-4 text-white">
      <div className="w-fulls py-8 md:py-12">
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
            任务历史
          </h1>
          <div className="flex space-x-3">
            <Button 
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/20 transition-all duration-200"
            >
              <Plus className="mr-2 h-4 w-4" />
              新任务
            </Button>
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
        </div>

        <motion.div 
          className="space-y-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {taskHistory.map((task) => (
            <motion.div key={task.id} variants={item}>
              <Card className="border-0 bg-slate-800/50 backdrop-blur-sm shadow-lg hover:shadow-indigo-500/10 transition-all overflow-hidden group">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <CardTitle className="text-lg font-semibold text-slate-100">{task.goal}</CardTitle>
                    <div className="flex items-center text-sm text-slate-400 bg-slate-700/30 px-3 py-1 rounded-full">
                      <Clock className="mr-2 h-3 w-3 text-indigo-400" />
                      {formatDate(task.date)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-indigo-400 to-purple-500 rounded-full"></div>
                    <p className="line-clamp-3 pl-4 text-sm text-slate-300">
                      {task.result.substring(0, 200)}...
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 pb-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => router.push(`/history/${task.id}`)}
                    className="ml-auto border-slate-700 bg-slate-800/70 text-slate-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 transition-all"
                  >
                    查看完整结果
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
