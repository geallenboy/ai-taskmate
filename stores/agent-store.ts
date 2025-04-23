"use client"

import { create } from "zustand"
import type { Agent, AgentStatus } from "@/types"

interface AgentStore {
  userGoal: string
  agents: Agent[]
  finalResult: string
  isComplete: boolean
  error: string | null

  // Actions
  setUserGoal: (goal: string) => void
  updateAgentStatus: (id: string, status: AgentStatus, result?: string) => void
  setFinalResult: (result: string) => void
  setComplete: (complete: boolean) => void
  setError: (error: string | null) => void
  resetStore: () => void
}

const initialAgents: Agent[] = [
  {
    id: "planner",
    name: "Planning Agent",
    description: "Breaks down your goal into manageable tasks",
    status: "pending",
    result: "",
  },
  {
    id: "searcher",
    name: "Search Agent",
    description: "Collects relevant information for your tasks",
    status: "pending",
    result: "",
  },
  {
    id: "reasoner",
    name: "Reasoning Agent",
    description: "Processes and analyzes the collected information",
    status: "pending",
    result: "",
  },
  {
    id: "writer",
    name: "Writing Agent",
    description: "Creates a structured response based on the analysis",
    status: "pending",
    result: "",
  },
]

export const useAgentStore = create<AgentStore>((set) => ({
  userGoal: "",
  agents: [...initialAgents],
  finalResult: "",
  isComplete: false,
  error: null,

  setUserGoal: (goal) =>
    set({
      userGoal: goal,
      agents: [...initialAgents],
      finalResult: "",
      isComplete: false,
      error: null,
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

  resetStore: () =>
    set({
      userGoal: "",
      agents: [...initialAgents],
      finalResult: "",
      isComplete: false,
      error: null,
    }),
}))
