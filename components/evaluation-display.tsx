"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { EvaluationResult } from "@/types"

interface EvaluationDisplayProps {
  evaluation: EvaluationResult
}

export default function EvaluationDisplay({ evaluation }: EvaluationDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>结果评估</CardTitle>
        <CardDescription>AI对生成结果的质量评估</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">相关性</span>
            <span className="text-sm font-medium">{evaluation.relevance}/10</span>
          </div>
          <Progress value={evaluation.relevance * 10} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">完整性</span>
            <span className="text-sm font-medium">{evaluation.completeness}/10</span>
          </div>
          <Progress value={evaluation.completeness * 10} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">可操作性</span>
            <span className="text-sm font-medium">{evaluation.actionability}/10</span>
          </div>
          <Progress value={evaluation.actionability * 10} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">清晰度</span>
            <span className="text-sm font-medium">{evaluation.clarity}/10</span>
          </div>
          <Progress value={evaluation.clarity * 10} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">总体评分</span>
            <span className="text-sm font-medium">{evaluation.overallScore}/10</span>
          </div>
          <Progress
            value={evaluation.overallScore * 10}
            className="h-2"
            // 根据评分调整颜色
            color={
              evaluation.overallScore >= 8
                ? "bg-green-500"
                : evaluation.overallScore >= 6
                  ? "bg-yellow-500"
                  : "bg-red-500"
            }
          />
        </div>

        <div className="mt-4 rounded-md bg-gray-50 p-3 dark:bg-gray-900">
          <h4 className="mb-2 text-sm font-medium">改进建议</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{evaluation.suggestions}</p>
        </div>
      </CardContent>
    </Card>
  )
}
