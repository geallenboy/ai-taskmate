"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAgentStore } from "@/stores/agent-store"
import { Send, Sparkles, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// 预设示例提示
const EXAMPLE_PROMPTS = [
  "帮我制定一个30天学习JavaScript的计划",
  "为我创建一个健康饮食的每周菜单",
  "设计一个提高英语口语的学习方法",
  "帮我整理一份旅行行李清单"
]

export default function ChatInput() {
  const [input, setInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [randomPrompt, setRandomPrompt] = useState("")
  const router = useRouter()
  const { setUserGoal } = useAgentStore()

  // 随机选择一个示例提示作为占位符
  useEffect(() => {
    setRandomPrompt(EXAMPLE_PROMPTS[Math.floor(Math.random() * EXAMPLE_PROMPTS.length)])
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isSubmitting) return

    setIsSubmitting(true)
    
    // 模拟短暂延迟，增强用户体验感知
    setTimeout(() => {
      // 保存用户目标到存储
      setUserGoal(input)

      // 导航到处理页面
      router.push("/process")
    }, 300)
  }

  const handleExampleClick = (example: string) => {
    setInput(example)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
          <Textarea
            placeholder={`例如：${randomPrompt}`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[140px] resize-none relative bg-slate-800/80 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-500 text-slate-200 rounded-lg"
            disabled={isSubmitting}
            aria-label="输入你的任务目标"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <motion.div 
            className="flex flex-wrap gap-2" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.3 }}
          >
            <p className="text-xs text-slate-400 self-center mr-1 hidden sm:block">试试：</p>
            {EXAMPLE_PROMPTS.slice(0, 2).map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleExampleClick(example)}
                className="text-xs text-slate-400 hover:text-indigo-400 bg-slate-800/50 hover:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700/50 transition-colors"
                disabled={isSubmitting}
              >
                {example.length > 20 ? `${example.substring(0, 20)}...` : example}
              </button>
            ))}
          </motion.div>
          
          <Button 
            type="submit" 
            disabled={!input.trim() || isSubmitting}
            className={`
              relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 
              hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg 
              hover:shadow-indigo-500/20 transition-all duration-300
              ${isSubmitting ? 'opacity-90' : ''}
            `}
          >
            <AnimatePresence mode="wait">
              {isSubmitting ? (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center"
                >
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  处理中...
                </motion.span>
              ) : (
                <motion.span
                  key="default"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  开始任务
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </form>
      
      <motion.div 
        className="text-center text-xs text-slate-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        AI 会根据您的目标分析需求、生成计划并提供详细建议
      </motion.div>
    </div>
  )
}
