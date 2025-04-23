export type AgentStatus = "pending" | "processing" | "completed" | "error"

export interface Agent {
  id: string
  name: string
  description: string
  status: AgentStatus
  result: string
}

export interface EvaluationResult {
  relevance: number
  completeness: number
  actionability: number
  clarity: number
  overallScore: number
  suggestions: string
}

export interface TaskHistory {
  id: string
  goal: string
  result: string
  date: string
  evaluation?: EvaluationResult
}
