"use client"

import { useState, useCallback } from "react"
import { useAgentStore } from "@/stores/agent-store"
import { runPlannerAgent } from "@/lib/agents/planner"
import { runSearchAgent } from "@/lib/agents/searcher"
import { runReasoningAgent } from "@/lib/agents/reasoner"
import { runWritingAgent } from "@/lib/agents/writer"
import { evaluateAgentResponse } from "@/lib/evaluation"
import { getEnv } from "@/lib/env"
import { backupAgents } from "@/lib/direct-openai"
import { useAnalytics } from "@/hooks/use-analytics"

// 获取环境配置
const env = getEnv()

export function useAgentFlow() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [useFallback, setUseFallback] = useState(false)
  const { track } = useAnalytics()
  const { userGoal, updateAgentStatus, setFinalResult, setComplete, setError, saveTaskToHistory, setEvaluation } =
    useAgentStore()

  const startAgentFlow = useCallback(async () => {
    if (!userGoal || isProcessing) return

    setIsProcessing(true)
    const startTime = Date.now()
    track("agent_flow_start", { goal: userGoal, tracingEnabled: env.TRACING_ENABLED })
    console.log("启动代理流程，跟踪功能状态:", env.TRACING_ENABLED ? "已启用" : "已禁用")

    try {
      // 步骤1：规划代理
      updateAgentStatus("planner", "processing")
      track("agent_step_start", { agent: "planner", goal: userGoal })
      const plannerStartTime = Date.now()

      let planResult
      try {
        planResult = await runPlannerAgent(userGoal)
      } catch (error) {
        console.warn("使用LangChain规划代理失败，切换到备用方案", error)
        setUseFallback(true)
        planResult = await backupAgents.runPlannerAgent(userGoal)
      }

      updateAgentStatus("planner", "completed", planResult)
      track("agent_step_complete", {
        agent: "planner",
        duration: Date.now() - plannerStartTime,
        resultLength: planResult.length,
        usedFallback: useFallback,
      })

      // 步骤2：搜索代理
      updateAgentStatus("searcher", "processing")
      track("agent_step_start", { agent: "searcher", goal: userGoal })
      const searcherStartTime = Date.now()

      let searchResult
      try {
        searchResult = useFallback
          ? await backupAgents.runSearchAgent(userGoal, planResult)
          : await runSearchAgent(userGoal, planResult)
      } catch (error) {
        console.warn("使用LangChain搜索代理失败，切换到备用方案", error)
        setUseFallback(true)
        searchResult = await backupAgents.runSearchAgent(userGoal, planResult)
      }

      updateAgentStatus("searcher", "completed", searchResult)
      track("agent_step_complete", {
        agent: "searcher",
        duration: Date.now() - searcherStartTime,
        resultLength: searchResult.length,
        usedFallback: useFallback,
      })

      // 步骤3：推理代理
      updateAgentStatus("reasoner", "processing")
      track("agent_step_start", { agent: "reasoner", goal: userGoal })
      const reasonerStartTime = Date.now()

      let reasoningResult
      try {
        reasoningResult = useFallback
          ? await backupAgents.runReasoningAgent(userGoal, planResult, searchResult)
          : await runReasoningAgent(userGoal, planResult, searchResult)
      } catch (error) {
        console.warn("使用LangChain推理代理失败，切换到备用方案", error)
        setUseFallback(true)
        reasoningResult = await backupAgents.runReasoningAgent(userGoal, planResult, searchResult)
      }

      updateAgentStatus("reasoner", "completed", reasoningResult)
      track("agent_step_complete", {
        agent: "reasoner",
        duration: Date.now() - reasonerStartTime,
        resultLength: reasoningResult.length,
        usedFallback: useFallback,
      })

      // 步骤4：写作代理
      updateAgentStatus("writer", "processing")
      track("agent_step_start", { agent: "writer", goal: userGoal })
      const writerStartTime = Date.now()

      let finalResult
      try {
        finalResult = useFallback
          ? await backupAgents.runWritingAgent(userGoal, planResult, searchResult, reasoningResult)
          : await runWritingAgent(userGoal, planResult, searchResult, reasoningResult)
      } catch (error) {
        console.warn("使用LangChain写作代理失败，切换到备用方案", error)
        setUseFallback(true)
        finalResult = await backupAgents.runWritingAgent(userGoal, planResult, searchResult, reasoningResult)
      }

      updateAgentStatus("writer", "completed", finalResult)
      track("agent_step_complete", {
        agent: "writer",
        duration: Date.now() - writerStartTime,
        resultLength: finalResult.length,
        usedFallback: useFallback,
      })

      // 设置最终结果
      setFinalResult(finalResult)

      // 评估结果质量
      try {
        if (!useFallback) {
          track("evaluation_start", { goal: userGoal })
          const evaluationStartTime = Date.now()

          const evaluation = await evaluateAgentResponse(userGoal, finalResult)
          setEvaluation(evaluation)

          track("evaluation_complete", {
            duration: Date.now() - evaluationStartTime,
            overallScore: evaluation.overallScore,
            goal: userGoal,
          })

          console.log("结果评估:", evaluation)
        }
      } catch (error) {
        console.warn("结果评估失败:", error)
        track("evaluation_error", { error: String(error) })
      }

      setComplete(true)

      // 保存任务到历史记录
      saveTaskToHistory()

      // 记录整个流程完成
      track("agent_flow_complete", {
        goal: userGoal,
        duration: Date.now() - startTime,
        usedFallback: useFallback,
      })
    } catch (error) {
      console.error("代理流程错误:", error)
      setError(error instanceof Error ? error.message : "发生未知错误")
      track("agent_flow_error", {
        error: error instanceof Error ? error.message : String(error),
        goal: userGoal,
        duration: Date.now() - startTime,
      })
    } finally {
      setIsProcessing(false)
      setUseFallback(false) // 重置备用标志
    }
  }, [
    userGoal,
    isProcessing,
    useFallback,
    updateAgentStatus,
    setFinalResult,
    setComplete,
    setError,
    saveTaskToHistory,
    setEvaluation,
    track,
  ])

  return { startAgentFlow, isProcessing }
}
