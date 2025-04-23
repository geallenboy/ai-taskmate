"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import { submitUserFeedback } from "@/lib/feedback"
import { useAnalytics } from "@/hooks/use-analytics"

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
      <Card>
        <CardHeader>
          <CardTitle>感谢您的反馈！</CardTitle>
          <CardDescription>您的反馈将帮助我们改进AI代理的性能。</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>您对结果的评价</CardTitle>
        <CardDescription>请告诉我们您对AI生成结果的看法</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} type="button" onClick={() => handleRatingChange(star)} className="focus:outline-none">
              {rating >= star ? (
                <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
              ) : (
                <Star className="h-8 w-8 text-gray-300" />
              )}
            </button>
          ))}
        </div>
        <Textarea
          placeholder="请分享您对结果的详细反馈（可选）"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="min-h-[100px]"
        />
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={rating === 0 || isSubmitting} className="w-full">
          {isSubmitting ? "提交中..." : "提交反馈"}
        </Button>
      </CardFooter>
    </Card>
  )
}
