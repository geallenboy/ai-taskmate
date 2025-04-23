"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import { useAgentStore } from "@/stores/agent-store"
import { useAgentFlow } from "@/hooks/use-agent-flow"
import AgentStep from "@/components/agent-step"
import { motion } from "framer-motion"
import Link from "next/link"

// 动画变体
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

export default function ProcessPage() {
  const router = useRouter()
  const { userGoal, agents, isComplete, error } = useAgentStore()
  const { startAgentFlow, isProcessing } = useAgentFlow()
  
  useEffect(() => {
    console.log("页面状态:", { isProcessing, isComplete, error });
  }, [isProcessing, isComplete, error]);

  useEffect(() => {
    if (!userGoal) {
      router.push("/")
      return
    }

    if (!isComplete && !error && !isProcessing) {
      console.log("启动代理流程 - 状态检查通过");
      startAgentFlow();
    } else {
      console.log("跳过启动代理流程", { isComplete, error, isProcessing });
    }
  }, [userGoal, router, startAgentFlow, isComplete, error, isProcessing]);

  const handleViewResults = () => {
    router.push("/result")
  }

  if (!userGoal) {
    return null // 将重定向到首页
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 px-4 text-white"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="container max-w-5xl m-auto py-8 md:py-12">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
            任务处理
          </h1>
          <Link href="/">
            <Button 
              variant="outline" 
              className="border-slate-700 bg-slate-800/50 text-white hover:bg-slate-700 hover:text-white transition-all"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回首页
            </Button>
          </Link>
        </div>
        
        <Card className="border-0 bg-slate-800/50 backdrop-blur-sm shadow-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-lg pointer-events-none"></div>
          <CardHeader className="border-b border-slate-700/30">
            <CardTitle className="text-lg text-white">正在处理你的任务</CardTitle>
            <CardDescription className="text-slate-200">
              <span className="font-medium text-white">{userGoal}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 py-6">
            {error ? (
              <motion.div 
                className="rounded-lg bg-red-900/20 border border-red-700/30 p-4 text-white"
                variants={slideUp}
              >
                <div className="flex items-center">
                  <AlertCircle className="mr-3 h-5 w-5 text-red-300" />
                  <p>发生错误：{error}</p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                className="space-y-6"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {agents.map((agent, index) => (
                  <motion.div key={agent.id} variants={slideUp}>
                    <div className="relative">
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-400 to-purple-500 rounded-full"></div>
                      <div className={`pl-6 ${!agent.isComplete && !agent.isProcessing ? 'opacity-40' : ''}`}>
                        <AgentStep agent={agent} />
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                <motion.div 
                  className="flex justify-center pt-8"
                  variants={slideUp}
                >
                  {isProcessing ? (
                    <Button 
                      disabled 
                      className="bg-slate-700/50 border border-slate-600/30 text-white px-8"
                    >
                      <Loader2 className="mr-2 h-5 w-5 animate-spin text-white" />
                      处理中...
                    </Button>
                  ) : isComplete ? (
                    <Button 
                      onClick={handleViewResults}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/20 transition-all duration-200 px-8 text-white"
                    >
                      <CheckCircle className="mr-2 h-5 w-5" />
                      查看结果
                    </Button>
                  ) : (
                    <Button 
                      disabled
                      className="bg-slate-700/50 border border-slate-600/30 text-white px-8"
                    >
                      <Loader2 className="mr-2 h-5 w-5 animate-spin text-white" />
                      启动中...
                    </Button>
                  )}
                </motion.div>
                
                <motion.div 
                  className="mt-8 text-center text-xs text-white"
                  variants={slideUp}
                >
                  <p>AI任务处理可能需要10-30秒，取决于任务复杂度</p>
                </motion.div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
