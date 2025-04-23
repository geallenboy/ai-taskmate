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

  useEffect(() => {
    if (!userGoal) {
      router.push("/")
      return
    }

    // Start the agent flow when the component mounts
    startAgentFlow()
  }, [userGoal, router, startAgentFlow])

  const handleViewResults = () => {
    router.push("/result")
  }

  if (!userGoal) {
    return null // Will redirect to home
  }

  return (
    <div className="container max-w-4xl py-12">
      <Card>
        <CardHeader>
          <CardTitle>Processing Your Task</CardTitle>
          <CardDescription>Our AI agents are working on your goal: {userGoal}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {error ? (
            <div className="rounded-lg bg-red-50 p-4 text-red-800">
              <div className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5" />
                <p>An error occurred: {error}</p>
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
                    Processing...
                  </Button>
                ) : isComplete ? (
                  <Button onClick={handleViewResults}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    View Results
                  </Button>
                ) : (
                  <Button disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Starting...
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
