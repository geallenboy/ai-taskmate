"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, CheckCircle, ChevronDown, ChevronUp } from "lucide-react"
import type { Agent } from "@/types"

interface AgentStepProps {
  agent: Agent
}

export default function AgentStep({ agent }: AgentStepProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {agent.status === "completed" ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : agent.status === "processing" ? (
            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          ) : (
            <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
          )}
          <h3 className="font-medium">{agent.name}</h3>
        </div>
        {agent.result && (
          <Button variant="ghost" size="sm" onClick={toggleExpand}>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {isExpanded && agent.result && (
        <Card className="mt-2">
          <CardContent className="p-4">
            <div className="whitespace-pre-wrap text-sm">{agent.result}</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
