"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useAgentStore } from "@/stores/agent-store"
import { useAgentFlow } from "@/hooks/use-agent-flow"
import AgentStep from "@/components/agent-step"

export default function ProcessPage() {
  const router = useRouter()
  const { userGoal, agents, isComplete, error } = useAgentStore()
  const { startAgentFlow, isProcessing } = useAgentFlow()
  
  // 添加调试输出
  useEffect(() => {
    console.log("页面状态:", { isProcessing, isComplete, error });
  }, [isProcessing, isComplete, error]);

  useEffect(() => {
    if (!userGoal) {
      router.push("/")
      return
    }

    // 只有当没有错误、没有完成且不在处理中时才启动流程
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
    <div className="container max-w-4xl py-12">
      <Card>
        <CardHeader>
          <CardTitle>正在处理你的任务</CardTitle>
          <CardDescription>我们的AI代理正在处理你的目标：{userGoal}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {error ? (
            <div className="rounded-lg bg-red-50 p-4 text-red-800">
              <div className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5" />
                <p>发生错误：{error}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {agents.map((agent) => (
                  <AgentStep key={agent.id} agent={agent} />
                ))}
              </div>

              <div className="flex justify-center pt-4">
                {isProcessing ? (
                  <Button disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    处理中...
                  </Button>
                ) : isComplete ? (
                  <Button onClick={handleViewResults}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    查看结果
                  </Button>
                ) : (
                  <Button disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    启动中...
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
