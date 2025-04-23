"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { EvaluationResult } from "@/types"
import { Star, AlertCircle, CheckCircle, Info, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

interface EvaluationDisplayProps {
  evaluation: EvaluationResult
}

const progressVariants = {
  initial: { width: 0 },
  animate: (value: number) => ({
    width: `${value}%`,
    transition: { duration: 0.8, ease: "easeOut", delay: 0.2 }
  })
}

export default function EvaluationDisplay({ evaluation }: EvaluationDisplayProps) {
  const getProgressColor = (score: number) => {
    if (score >= 8) return "bg-gradient-to-r from-emerald-500 to-teal-500";
    if (score >= 6) return "bg-gradient-to-r from-amber-400 to-yellow-500";
    return "bg-gradient-to-r from-red-500 to-rose-500";
  };

  const getScoreDescription = (score: number) => {
    if (score >= 8) return { text: "优秀", icon: CheckCircle, color: "text-emerald-400" };
    if (score >= 6) return { text: "良好", icon: TrendingUp, color: "text-amber-400" };
    return { text: "需改进", icon: AlertCircle, color: "text-rose-400" };
  };

  const overallScoreInfo = getScoreDescription(evaluation.overallScore);
  const OverallScoreIcon = overallScoreInfo.icon;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
    >
      <Card className="border-0 bg-slate-800/50 backdrop-blur-sm shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-cyan-500/5 rounded-lg pointer-events-none"></div>
        
        <CardHeader className="border-b border-slate-700/30 pb-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-400" />
            <CardTitle className="text-lg text-slate-100">结果评估</CardTitle>
          </div>
          <CardDescription className="text-slate-400">AI对任务完成质量的分析</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-5 pt-5">
          <motion.div className="flex items-center gap-4 mb-6" variants={item}>
            <div className={`text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-sky-400`}>
              {evaluation.overallScore.toFixed(1)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <OverallScoreIcon className={`h-4 w-4 ${overallScoreInfo.color}`} />
                <span className={`text-sm font-medium ${overallScoreInfo.color}`}>{overallScoreInfo.text}</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">总体评分</p>
            </div>
          </motion.div>

          {[
            { label: "相关性", value: evaluation.relevance, icon: Info },
            { label: "完整性", value: evaluation.completeness, icon: CheckCircle },
            { label: "可操作性", value: evaluation.actionability, icon: TrendingUp },
            { label: "清晰度", value: evaluation.clarity, icon: Star }
          ].map((metric, index) => (
            <motion.div key={metric.label} className="space-y-1.5" variants={item}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <metric.icon className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-sm text-slate-300">{metric.label}</span>
                </div>
                <span className="text-sm text-slate-400">{metric.value}/10</span>
              </div>
              <div className="h-1.5 w-full bg-slate-700/40 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${getProgressColor(metric.value)}`}
                  initial="initial"
                  animate="animate"
                  custom={metric.value * 10}
                  variants={progressVariants}
                />
              </div>
            </motion.div>
          ))}

          {evaluation.suggestions && (
            <motion.div 
              variants={item}
              className="mt-6 rounded-lg bg-slate-700/20 p-4 border border-slate-700/30"
            >
              <h4 className="text-sm font-medium text-slate-200 flex items-center gap-1.5 mb-2">
                <AlertCircle className="h-4 w-4 text-amber-400" />
                改进建议
              </h4>
              <p className="text-sm text-slate-400">{evaluation.suggestions}</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
