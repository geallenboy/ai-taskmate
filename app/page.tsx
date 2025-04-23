import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import ChatInput from "@/components/chat-input"
import { ArrowRight, BarChart } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export const metadata: Metadata = {
  title: "AI 任务助手",
  description: "你的AI驱动任务助手",
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-lg text-primary">AI 任务助手</span>
            </Link>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <Link href="/history" className="text-sm font-medium hover:text-primary transition-colors">
              任务历史
            </Link>
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
              <BarChart className="h-4 w-4 inline mr-1" />
              仪表板
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center">
        <section className="w-full py-12 md:py-20">
          <div className="container px-4 md:px-6 mx-auto max-w-5xl">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 animate-gradient">你的AI驱动任务助手</h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  输入你的目标，让我们的AI代理为你分解任务、研究资料并创建全面的计划。
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-8 mb-12">
          <div className="container px-4 md:px-6">
            <Card className="mx-auto max-w-3xl border border-primary/10 bg-background/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>你想要完成什么目标？</CardTitle>
                <CardDescription>输入你的目标，我们的AI代理将帮助你实现它</CardDescription>
              </CardHeader>
              <CardContent>
                <ChatInput />
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-4">
                <p className="text-sm text-muted-foreground">我们的AI将分解你的任务，研究资料，并创建计划</p>
                <Link href="/process">
                  <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 transition-colors">
                    开始 <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row max-w-5xl mx-auto">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            使用 Next.js、React 和 LangChain 构建
          </p>
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </footer>
    </div>
  )
}
