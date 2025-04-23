"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Agent, AgentStatus, TaskHistory, EvaluationResult } from "@/types"

interface AgentStore {
  userGoal: string
  agents: Agent[]
  finalResult: string
  isComplete: boolean
  error: string | null
  taskHistory: TaskHistory[]
  evaluation: EvaluationResult | null

  // 操作
  initializeFromStorage: () => void
  setUserGoal: (goal: string) => void
  updateAgentStatus: (id: string, status: AgentStatus, result?: string) => void
  setFinalResult: (result: string) => void
  setComplete: (complete: boolean) => void
  setError: (error: string | null) => void
  setEvaluation: (evaluation: EvaluationResult) => void
  saveTaskToHistory: () => void
  resetStore: () => void
}

const initialAgents: Agent[] = [
  {
    id: "planner",
    name: "规划代理",
    description: "将你的目标分解为可管理的任务",
    status: "pending",
    result: "",
    isProcessing: false,
    isComplete: false,
  },
  {
    id: "searcher",
    name: "搜索代理",
    description: "为你的任务收集相关信息",
    status: "pending",
    result: "",
    isProcessing: false,
    isComplete: false,
  },
  {
    id: "reasoner",
    name: "推理代理",
    description: "处理和分析收集到的信息",
    status: "pending",
    result: "",
    isProcessing: false,
    isComplete: false,
  },
  {
    id: "writer",
    name: "写作代理",
    description: "基于分析创建结构化回应",
    status: "pending",
    result: "",
    isProcessing: false,
    isComplete: false,
  },
]

export const useAgentStore = create<AgentStore>()(
  persist(
    (set, get) => ({
      userGoal: "",
      agents: [...initialAgents],
      finalResult: "",
      isComplete: false,
      error: null,
      taskHistory: [],
      evaluation: null,
      // 添加初始化方法
      initializeFromStorage: () => {
        // 从 localStorage 手动获取数据
        const storedData = localStorage.getItem('task-history-storage')
        if (storedData) {
          const parsedData = JSON.parse(storedData)
          if (parsedData.state && parsedData.state.taskHistory) {
            set({ taskHistory: parsedData.state.taskHistory })
          }
        }
      },
      setUserGoal: (goal) =>
        set({
          userGoal: goal,
          agents: [...initialAgents],
          finalResult: "",
          isComplete: false,
          error: null,
          evaluation: null,
        }),

      updateAgentStatus: (id, status, result) =>
        set((state) => ({
          agents: state.agents.map((agent) =>
            agent.id === id ? { ...agent, status, result: result || agent.result } : agent,
          ),
        })),

      setFinalResult: (result) => set({ finalResult: result }),

      setComplete: (complete) => set({ isComplete: complete }),

      setError: (error) => set({ error }),

      setEvaluation: (evaluation) => set({ evaluation }),

      saveTaskToHistory: () => {
        const { userGoal, finalResult, evaluation } = get()
        if (userGoal && finalResult) {
          set((state) => ({
            taskHistory: [
              {
                id: Date.now().toString(),
                goal: userGoal,
                result: finalResult,
                date: new Date().toISOString(),
                evaluation: evaluation || undefined,
              },
              ...state.taskHistory,
            ].slice(0, 10), // 只保留最近的10个任务
          }))
        }
      },

      resetStore: () =>
        set({
          userGoal: "",
          agents: [...initialAgents],
          finalResult: "",
          isComplete: false,
          error: null,
          evaluation: null,
        }),
    }),
    {
      name: "ai-taskmate-storage", // 本地存储的名称
      partialize: (state) => ({ taskHistory: state.taskHistory }), // 只持久化任务历史
    },
  ),
)
