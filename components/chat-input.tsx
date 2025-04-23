"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAgentStore } from "@/stores/agent-store"

export default function ChatInput() {
  const [input, setInput] = useState("")
  const router = useRouter()
  const { setUserGoal } = useAgentStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Save the user goal to the store
    setUserGoal(input)

    // Navigate to the process page
    router.push("/process")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="e.g., Help me create a study plan for learning JavaScript"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="min-h-[120px] resize-none"
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={!input.trim()}>
          Start Task
        </Button>
      </div>
    </form>
  )
}
