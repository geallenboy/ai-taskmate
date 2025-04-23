"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, CheckCircle, ChevronDown, ChevronUp, CircleDot } from "lucide-react"
import type { Agent } from "@/types"
import { motion, AnimatePresence } from "framer-motion"

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
      <div 
        className={`
          flex items-center justify-between rounded-lg p-3
          ${agent.status === "completed" ? "bg-indigo-900/10" : 
            agent.status === "processing" ? "bg-indigo-600/10 ring-1 ring-indigo-500/20" : 
            "bg-slate-800/30"}
          transition-all duration-200
        `}
      >
        <div className="flex items-center space-x-3">
          {agent.status === "completed" ? (
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-green-500/20 blur-sm"></div>
              <CheckCircle className="h-5 w-5 text-green-500 relative" />
            </div>
          ) : agent.status === "processing" ? (
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-sm animate-pulse"></div>
              <Loader2 className="h-5 w-5 animate-spin text-indigo-400 relative" />
            </div>
          ) : (
            <div className="h-5 w-5 rounded-full border border-slate-600 flex items-center justify-center">
              <CircleDot className="h-3 w-3 text-slate-500" />
            </div>
          )}
          <h3 className={`font-medium ${
            agent.status === "completed" ? "text-slate-100" : 
            agent.status === "processing" ? "text-indigo-300" : 
            "text-slate-400"
          }`}>
            {agent.name}
          </h3>
          {agent.status === "processing" && (
            <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">
              处理中
            </span>
          )}
        </div>
        
        {agent.result && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleExpand}
            className="text-slate-400 hover:text-indigo-300 hover:bg-slate-800/70"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "收起详情" : "展开详情"}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            <span className="sr-only">{isExpanded ? "收起" : "展开"}</span>
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && agent.result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <Card className="mt-2 border-0 bg-slate-800/50 backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-lg pointer-events-none"></div>
              <CardContent className="p-4">
                <div className="whitespace-pre-wrap text-sm text-slate-300 backdrop-blur-sm">
                  {agent.result}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
