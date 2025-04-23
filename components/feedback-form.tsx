"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Star, Loader2, CheckCircle } from "lucide-react"
import { submitUserFeedback } from "@/lib/feedback"
import { useAnalytics } from "@/hooks/use-analytics"
import { motion, AnimatePresence } from "framer-motion"

interface FeedbackFormProps {
  taskId: string
  onFeedbackSubmitted?: () => void
}

export default function FeedbackForm({ taskId, onFeedbackSubmitted }: FeedbackFormProps) {
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { track } = useAnalytics()

  const handleRatingChange = (newRating: number) => {
    setRating(newRating)
    track("feedback_rating_change", { taskId, rating: newRating })
  }

  const handleSubmit = async () => {
    if (rating === 0) return

    setIsSubmitting(true)
    track("feedback_submit_start", { taskId, rating, hasComment: feedback.length > 0 })

    try {
      const success = await submitUserFeedback(taskId, rating, feedback)
      if (success) {
        setIsSubmitted(true)
        track("feedback_submit_success", { taskId, rating })
        if (onFeedbackSubmitted) {
          onFeedbackSubmitted()
        }
      } else {
        track("feedback_submit_error", { taskId, rating })
        alert("提交反馈时出错，请稍后再试。")
      }
    } catch (error) {
      console.error("提交反馈失败:", error)
      track("feedback_submit_error", { taskId, rating, error: String(error) })
      alert("提交反馈时出错，请稍后再试。")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="border-0 bg-slate-800/50 backdrop-blur-sm shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-lg pointer-events-none"></div>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CardHeader className="border-b border-slate-700/30 pb-4">
            <div className="flex items-center gap-2">
              <div className="bg-green-500/20 p-1.5 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <CardTitle className="text-slate-100">感谢您的反馈！</CardTitle>
            </div>
            <CardDescription className="text-slate-400">您的反馈将帮助我们改进AI代理的性能。</CardDescription>
          </CardHeader>
        </motion.div>
      </Card>
    )
  }

  return (
    <Card className="border-0 bg-slate-800/50 backdrop-blur-sm shadow-xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-indigo-500/5 rounded-lg pointer-events-none"></div>
      <CardHeader className="border-b border-slate-700/30 pb-4">
        <CardTitle className="text-slate-100">您对结果的评价</CardTitle>
        <CardDescription className="text-slate-400">请告诉我们您对AI生成结果的看法</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 pt-5">
        <motion.div 
          className="flex justify-center space-x-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button 
              key={star} 
              type="button" 
              onClick={() => handleRatingChange(star)} 
              className="relative focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-full p-1 -m-1 transition-transform"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`评分 ${star} 星`}
            >
              {rating >= star ? (
                <div className="relative">
                  <div className={`absolute inset-0 blur-sm bg-yellow-400/30 rounded-full`}></div>
                  <Star className="h-8 w-8 fill-yellow-400 text-yellow-400 relative" />
                </div>
              ) : (
                <Star className="h-8 w-8 text-slate-600 hover:text-slate-400 transition-colors" />
              )}
            </motion.button>
          ))}
        </motion.div>
        
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-lg blur opacity-20 group-hover:opacity-25 transition duration-300"></div>
          <Textarea
            placeholder="请分享您对结果的详细反馈（可选）"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[100px] resize-none relative bg-slate-800/80 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-500 text-slate-200 rounded-lg"
            disabled={isSubmitting}
          />
        </div>
      </CardContent>
      <CardFooter className="border-t border-slate-700/30 pt-4">
        <Button 
          onClick={handleSubmit} 
          disabled={rating === 0 || isSubmitting} 
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-indigo-500/20 transition-all"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              提交中...
            </span>
          ) : (
            "提交反馈"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
