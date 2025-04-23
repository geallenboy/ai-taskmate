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

    // 保存用户目标到存储
    setUserGoal(input)

    // 导航到处理页面
    router.push("/process")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="例如：帮我制定一个学习JavaScript的计划"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="min-h-[120px] resize-none"
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={!input.trim()}>
          开始任务
        </Button>
      </div>
    </form>
  )
}
