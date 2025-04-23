"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Calendar, Clock, Share2, FileText, FileJson } from "lucide-react"
import { useAgentStore } from "@/stores/agent-store"
import { formatDate } from "@/lib/utils"
import type { TaskHistory } from "@/types"
import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import MarkdownCodeBlock from "@/components/markdown-code-block"

export default function TaskDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { taskHistory } = useAgentStore()
  const [task, setTask] = useState<TaskHistory | null>(null)
  const [copied, setCopied] = useState(false)
  const [viewMode, setViewMode] = useState<"markdown" | "raw">("markdown")
  
  useEffect(() => {
    if (params.id && taskHistory.length > 0) {
      const foundTask = taskHistory.find((t) => t.id === params.id)
      if (foundTask) {
        setTask(foundTask)
      } else {
        router.push("/history")
      }
    }
  }, [params.id, taskHistory, router])

  const handleSave = () => {
    if (!task) return

    const blob = new Blob([task.result], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `taskmate-${task.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleShare = async () => {
    if (!task) return
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: task.goal,
          text: task.result.substring(0, 100) + "...",
        })
      } catch (err) {
        console.error("分享失败:", err)
      }
    } else {
      // 复制到剪贴板
      navigator.clipboard.writeText(task.result).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }

  const toggleViewMode = () => {
    setViewMode(prev => prev === "markdown" ? "raw" : "markdown")
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 px-4 text-white">
        <div className="w-full m-auto max-w-4xl py-12 flex items-center justify-center">
          <Card className="w-full border-0 bg-slate-800/50 backdrop-blur-sm shadow-xl">
            <CardContent className="flex items-center justify-center py-12">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-8 w-32 bg-slate-700 rounded mb-4"></div>
                <div className="h-4 w-48 bg-slate-700/70 rounded"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 px-4 text-white">
      <div className="container max-w-4xl m-auto py-8 md:py-12">
        <motion.div 
          className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link href="/history">
            <Button 
              variant="outline" 
              className="border-slate-700 bg-slate-800/50 text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回历史
            </Button>
          </Link>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              onClick={toggleViewMode}
              className={`
                border-slate-700 bg-slate-800/50 text-slate-200 
                hover:bg-slate-700 hover:text-white transition-all
                ${viewMode === "markdown" ? "border-indigo-500/30 bg-indigo-500/10" : ""}
              `}
            >
              {viewMode === "markdown" ? (
                <>
                  <FileText className="mr-2 h-4 w-4 text-indigo-400" />
                  MD视图
                </>
              ) : (
                <>
                  <FileJson className="mr-2 h-4 w-4" />
                  原始文本
                </>
              )}
            </Button>
            {/* <Button 
              variant="outline" 
              onClick={handleShare}
              className="border-slate-700 bg-slate-800/50 text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
            >
              <Share2 className="mr-2 h-4 w-4" />
              {copied ? "已复制" : "分享"}
            </Button> */}
            <Button 
              onClick={handleSave}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-indigo-500/20 transition-all"
            >
              <Download className="mr-2 h-4 w-4" />
              保存结果
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-0 bg-slate-800/50 backdrop-blur-sm shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-lg pointer-events-none"></div>
            <CardHeader className="border-b border-slate-700/30">
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold text-slate-100">{task.goal}</CardTitle>
                <div className="flex flex-wrap gap-3 text-sm text-slate-400">
                  <div className="flex items-center">
                    <Calendar className="mr-1.5 h-3.5 w-3.5 text-indigo-400" />
                    创建于 {formatDate(task.date)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 pb-8">
              {viewMode === "markdown" ? (
                <div className="markdown-content rounded-lg bg-slate-900/80 border border-slate-700/30 p-5 md:p-6 prose prose-invert prose-slate max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code: ({node, inline, className, children, ...props}:any) => {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                          <MarkdownCodeBlock
                            language={match[1]}
                            value={String(children).replace(/\n$/, '')}
                          />
                        ) : (
                          <code {...props} className={className}>
                            {children}
                          </code>
                        )
                      },
                      p: ({children}) => <p className="text-slate-100 mb-4 leading-relaxed">{children}</p>,
                      ul: ({children}) => <ul className="list-disc pl-6 mb-4 space-y-2 text-slate-100">{children}</ul>,
                      ol: ({children}) => <ol className="list-decimal pl-6 mb-4 space-y-2 text-slate-100">{children}</ol>,
                      li: ({children}) => <li className="text-slate-100">{children}</li>,
                      h1: ({children}) => <h1 className="text-2xl font-bold text-white border-b border-slate-700/50 pb-2 mt-6 mb-4">{children}</h1>,
                      h2: ({children}) => <h2 className="text-xl font-bold text-white border-b border-slate-700/30 pb-1 mt-5 mb-3">{children}</h2>,
                      h3: ({children}) => <h3 className="text-lg font-semibold text-white mt-4 mb-2">{children}</h3>,
                      h4: ({children}) => <h4 className="text-base font-semibold text-indigo-200 mt-3 mb-2">{children}</h4>,
                      a: ({href, children}) => <a href={href} className="text-indigo-300 hover:text-indigo-200 underline decoration-indigo-400/30 hover:decoration-indigo-300/50 transition-all">{children}</a>,
                      blockquote: ({children}) => <blockquote className="border-l-4 border-indigo-500/50 pl-4 py-1 my-4 text-slate-300 italic">{children}</blockquote>,
                      table: ({children}) => (
                        <div className="overflow-x-auto my-6 rounded-md border border-slate-700/50">
                          <table className="min-w-full divide-y divide-slate-700/50 text-sm">{children}</table>
                        </div>
                      ),
                      thead: ({children}) => <thead className="bg-slate-800/50">{children}</thead>,
                      tbody: ({children}) => <tbody className="divide-y divide-slate-700/30">{children}</tbody>,
                      tr: ({children}) => <tr className="hover:bg-slate-800/30 transition-colors">{children}</tr>,
                      th: ({children}) => <th className="px-4 py-2 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">{children}</th>,
                      td: ({children}) => <td className="px-4 py-2 text-slate-100 text-sm">{children}</td>,
                      hr: () => <hr className="my-6 border-slate-700/50" />
                    }}
                  >
                    {task.result}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="prose prose-sm md:prose-base max-w-none dark:prose-invert">
                  <div className="whitespace-pre-wrap rounded-lg bg-slate-900/80 border border-slate-700/30 p-5 md:p-6 text-slate-200 leading-relaxed font-mono">
                    {task.result}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-700/30 pt-4">
              <div className="text-xs text-slate-500 self-start sm:self-auto">
                任务 ID: {task.id.substring(0, 8)}...
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button 
                  onClick={toggleViewMode}
                  variant="outline"
                  size="sm"
                  className="border-slate-700 bg-slate-800/50 text-slate-200 hover:bg-slate-700 hover:text-white transition-all flex-1 sm:flex-initial"
                >
                  {viewMode === "markdown" ? "查看原始文本" : "查看格式化内容"}
                </Button>
                <Button 
                  onClick={handleSave}
                  variant="outline"
                  size="sm"
                  className="border-slate-700 bg-slate-800/50 text-slate-200 hover:bg-slate-700 hover:text-white transition-all flex-1 sm:flex-initial"
                >
                  <Download className="mr-2 h-3.5 w-3.5" />
                  导出 TXT
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
