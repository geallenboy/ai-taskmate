"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Share2, Download, RefreshCw, Clock, ArrowLeft, CheckCircle2 } from "lucide-react"
import { useAgentStore } from "@/stores/agent-store"
import EvaluationDisplay from "@/components/evaluation-display"
import FeedbackForm from "@/components/feedback-form"
import { useAnalytics } from "@/hooks/use-analytics"
import { motion } from "framer-motion"
import Link from "next/link"

// 动画变体
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } }
};

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, type: "spring", stiffness: 100 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.2
    }
  }
};

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
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 px-4 text-white"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="container max-w-4xl py-8 md:py-12">
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-500/20 p-2 rounded-full">
              <CheckCircle2 className="h-6 w-6 text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
              任务完成
            </h1>
          </div>
          
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

        <motion.div 
          className="grid gap-6 md:grid-cols-3"
          variants={staggerContainer}
        >
          <motion.div 
            className="md:col-span-2"
            variants={slideUp}
          >
            <Card className="border-0 bg-slate-800/50 backdrop-blur-sm shadow-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-lg pointer-events-none"></div>
              <CardHeader className="border-b border-slate-700/30">
                <CardTitle className="text-lg text-slate-100">你的任务结果</CardTitle>
                <CardDescription className="text-slate-400">
                  <span className="font-medium text-indigo-300">{userGoal}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="py-6">
                <div className="prose max-w-none dark:prose-invert">
                  <div className="whitespace-pre-wrap rounded-lg bg-slate-900/80 p-6 border border-slate-700/30 text-slate-200">
                    {finalResult}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between border-t border-slate-700/30 pt-4">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleRestart}
                    className="border-slate-700 bg-slate-800/50 text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    新任务
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => router.push("/history")}
                    className="border-slate-700 bg-slate-800/50 text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    查看历史
                  </Button>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    onClick={handleShare}
                    className="border-slate-700 bg-slate-800/50 text-slate-200 hover:bg-slate-700 hover:text-white transition-all flex-1 sm:flex-initial"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    分享
                  </Button>
                  <Button 
                    onClick={handleSave}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/20 transition-all duration-200 flex-1 sm:flex-initial"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    保存
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div 
            className="space-y-6"
            variants={slideUp}
          >
            {evaluation ? (
              <Card className="border-0 bg-slate-800/50 backdrop-blur-sm shadow-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 rounded-lg pointer-events-none"></div>
                <CardHeader className="border-b border-slate-700/30 pb-3">
                  <CardTitle className="text-md text-slate-100">结果评估</CardTitle>
                  <CardDescription className="text-slate-400">AI对结果的评分与分析</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <EvaluationDisplay evaluation={evaluation} />
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 bg-slate-800/50 backdrop-blur-sm shadow-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 to-slate-600/5 rounded-lg pointer-events-none"></div>
                <CardHeader className="border-b border-slate-700/30">
                  <CardTitle className="text-md text-slate-100">结果评估</CardTitle>
                  <CardDescription className="text-slate-400">评估数据不可用</CardDescription>
                </CardHeader>
                <CardContent className="py-4">
                  <p className="text-sm text-slate-400">无法获取此结果的评估数据。</p>
                </CardContent>
              </Card>
            )}

            <Card className="border-0 bg-slate-800/50 backdrop-blur-sm shadow-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-indigo-500/5 rounded-lg pointer-events-none"></div>
              <CardHeader className="border-b border-slate-700/30 pb-3">
                <CardTitle className="text-md text-slate-100">你的反馈</CardTitle>
                <CardDescription className="text-slate-400">帮助我们改进AI助手</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <FeedbackForm taskId={Date.now().toString()} onFeedbackSubmitted={() => track("feedback_submitted")} />
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
