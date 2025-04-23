"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import ChatInput from "@/components/chat-input"
import { ArrowRight, BarChart, History, Sparkles, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"



export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100">
      {/* 导航栏 */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-700/50 bg-slate-900/80 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
        <div className="w-fulls flex h-16 items-center pl-2 md:pl-4 pr-2 md:pr-6 mx-auto max-w-5xl">
          <Link href="/" className="flex items-center space-x-2 mr-4">
            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
              AI 任务助手
            </span>
          </Link>
          <div className="flex items-center gap-6 ml-auto">
            <Link 
              href="/history" 
              className="text-sm font-medium text-slate-300 hover:text-indigo-400 transition-colors flex items-center gap-1"
              aria-label="查看任务历史"
            >
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">任务历史</span>
            </Link>
            <Link 
              href="/dashboard" 
              className="text-sm font-medium text-slate-300 hover:text-indigo-400 transition-colors flex items-center gap-1"
              aria-label="查看仪表盘"
            >
              <BarChart className="h-4 w-4" />
              <span className="hidden sm:inline">仪表板</span>
            </Link>
            
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="flex-1 flex flex-col items-center justify-center">
        {/* 英雄区域 */}
        <section className="mx-auto max-w-5xl py-12 md:py-20">
          <div className="w-full px-4 md:px-6 mx-auto ">
            <motion.div 
              className="flex flex-col items-center justify-center space-y-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Sparkles className="h-12 w-12 text-indigo-400 mb-2" />
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500">
                  你的 AI 驱动任务助手
                </h1>
                <p className="mx-auto max-w-[700px] text-slate-300 md:text-xl leading-relaxed">
                  输入你的目标，我们的 AI 将为你分解任务、研究资料并创建全面的计划
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <Button 
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-indigo-500/20 transition-all" 
                  asChild
                >
                  <Link href="#get-started">立即开始</Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-slate-700 bg-slate-800/50 text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
                  asChild
                >
                  <Link href="/dashboard">查看仪表板</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 输入区域 */}
        <section id="get-started" className="w-full py-8 mb-12">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="mx-auto max-w-3xl border-0 bg-slate-800/50 backdrop-blur-sm shadow-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-lg pointer-events-none"></div>
                <CardHeader className="border-b border-slate-700/30">
                  <CardTitle className="text-xl text-slate-100">你想要完成什么目标？</CardTitle>
                  <CardDescription className="text-slate-400">输入你的目标，让我们的 AI 代理为你创建完整解决方案</CardDescription>
                </CardHeader>
                <CardContent className="py-6">
                  <ChatInput />
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-4 border-t border-slate-700/30 pt-4">
                  <p className="text-sm text-slate-400 flex items-center">
                    <Sparkles className="mr-2 h-4 w-4 text-indigo-400" />
                    我们的AI将分解你的任务，研究资料，并创建计划
                  </p>
                  <Link href="/process">
                    <Button 
                      className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/20 transition-all duration-200"
                    >
                      开始 <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* 特性展示 */}
        <section className="w-full pb-16 -mt-4">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {[
                {
                  title: "任务分解",
                  description: "我们的AI会将复杂目标分解为可管理的子任务",
                  color: "from-indigo-400 to-indigo-600"
                },
                {
                  title: "智能研究",
                  description: "自动查找和整合实现目标所需的关键信息",
                  color: "from-purple-400 to-purple-600"
                },
                {
                  title: "结果导向",
                  description: "生成实用、具体的结果而不是空洞的建议",
                  color: "from-blue-400 to-blue-600"
                }
              ].map((feature, index) => (
                <Card key={index} className="border-0 bg-slate-800/40 backdrop-blur-sm overflow-hidden hover:shadow-lg hover:shadow-indigo-500/10 transition-all">
                  <div className={`h-1 w-full rounded-t-sm pointer-events-none bg-gradient-to-r ${feature.color}`}></div>
                  <CardHeader>
                    <CardTitle className="text-slate-100">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-400">{feature.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Link href="/process" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center">
                      了解更多 <ChevronRight className="ml-1 h-3 w-3" />
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <footer className="border-t border-slate-700/50 py-6 bg-slate-900/30">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row max-w-5xl mx-auto">
          <p className="text-center text-sm leading-loose text-slate-400 md:text-left">
            使用 Next.js、React 和 LangChain 构建
          </p>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">
              Dashboard
            </Link>
            <Link href="/history" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">
              History
            </Link>
         
          </div>
        </div>
      </footer>
    </div>
  )
}
