import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import ChatInput from "@/components/chat-input"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "AI TaskMate",
  description: "Your AI-powered task assistant",
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold">AI TaskMate</span>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Your AI-Powered Task Assistant
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Enter your goal and let our AI agents break it down, research, and create a comprehensive plan for
                  you.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12">
          <div className="container px-4 md:px-6">
            <Card className="mx-auto max-w-3xl">
              <CardHeader>
                <CardTitle>What would you like to accomplish?</CardTitle>
                <CardDescription>Enter your goal and our AI agents will help you achieve it</CardDescription>
              </CardHeader>
              <CardContent>
                <ChatInput />
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  Our AI will break down your task, research, and create a plan
                </p>
                <Link href="/process">
                  <Button>
                    Start <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with Next.js, React, and AI SDK
          </p>
        </div>
      </footer>
    </div>
  )
}
