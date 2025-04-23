"use client"

import { useState, useCallback } from "react"
import { useAgentStore } from "@/stores/agent-store"
import { runPlannerAgent } from "@/lib/agents/planner"
import { runSearchAgent } from "@/lib/agents/searcher"
import { runReasoningAgent } from "@/lib/agents/reasoner"
import { runWritingAgent } from "@/lib/agents/writer"

export function useAgentFlow() {
  const [isProcessing, setIsProcessing] = useState(false)
  const { userGoal, updateAgentStatus, setFinalResult, setComplete, setError } = useAgentStore()

  const startAgentFlow = useCallback(async () => {
    if (!userGoal || isProcessing) return

    setIsProcessing(true)

    try {
      // Step 1: Planning Agent
      updateAgentStatus("planner", "processing")
      const planResult = await runPlannerAgent(userGoal)
      updateAgentStatus("planner", "completed", planResult)

      // Step 2: Search Agent
      updateAgentStatus("searcher", "processing")
      const searchResult = await runSearchAgent(userGoal, planResult)
      updateAgentStatus("searcher", "completed", searchResult)

      // Step 3: Reasoning Agent
      updateAgentStatus("reasoner", "processing")
      const reasoningResult = await runReasoningAgent(userGoal, planResult, searchResult)
      updateAgentStatus("reasoner", "completed", reasoningResult)

      // Step 4: Writing Agent
      updateAgentStatus("writer", "processing")
      const finalResult = await runWritingAgent(userGoal, planResult, searchResult, reasoningResult)
      updateAgentStatus("writer", "completed", finalResult)

      // Set the final result
      setFinalResult(finalResult)
      setComplete(true)
    } catch (error) {
      console.error("Error in agent flow:", error)
      setError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setIsProcessing(false)
    }
  }, [userGoal, isProcessing, updateAgentStatus, setFinalResult, setComplete, setError])

  return { startAgentFlow, isProcessing }
}
