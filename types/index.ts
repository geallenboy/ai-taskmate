export type AgentStatus = "pending" | "processing" | "completed" | "error"

export interface Agent {
  id: string
  name: string
  description: string
  status: AgentStatus
  result: string
}
