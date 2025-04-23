"use client"

import { useState, useCallback, useEffect } from "react"
import { useAgentStore } from "@/stores/agent-store"
import { runPlannerAgent } from "@/lib/agents/planner"
import { runSearchAgent } from "@/lib/agents/searcher"
import { runReasoningAgent } from "@/lib/agents/reasoner"
import { runWritingAgent } from "@/lib/agents/writer"
import { evaluateAgentResponse } from "@/lib/evaluation"
import { getEnv } from "@/lib/env"
import { backupAgents } from "@/lib/direct-openai"
import { useAnalytics } from "@/hooks/use-analytics"

// 获取环境配置
const env = getEnv()

// 超时时间配置（毫秒）
const TIMEOUTS = {
  AGENT_STEP: 60000,   // 单个代理步骤超时（1分钟）
  TOTAL_PROCESS: 300000, // 整体流程超时（5分钟）
}

// 封装超时Promise
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number, operationName: string): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`${operationName}操作超时(${timeoutMs}ms)`));
    }, timeoutMs);

    promise.then(
      result => {
        clearTimeout(timeoutId);
        resolve(result);
      },
      error => {
        clearTimeout(timeoutId);
        reject(error);
      }
    );
  });
};

export function useAgentFlow() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [useFallback, setUseFallback] = useState(false)
  const [retryCount, setRetryCount] = useState<Record<string, number>>({})
  const { track } = useAnalytics()
  const { userGoal, updateAgentStatus, setFinalResult, setComplete, setError, saveTaskToHistory, setEvaluation } =
    useAgentStore()

  const startAgentFlow = useCallback(async () => {
    // 防重复检查
    if (!userGoal || isProcessing) {
      console.log("已在处理中或没有目标，忽略调用", { isProcessing, userGoal });
      return;
    }

    console.log("开始处理任务:", userGoal);
    // 设置处理状态为true
    setIsProcessing(true);

    // 添加防重复和参数验证
    if (!userGoal.trim()) {
      setError("请输入有效的任务目标");
      return;
    }

    // 重置重试计数和状态
    setRetryCount({})
    const startTime = Date.now()
    track("agent_flow_start", { goal: userGoal, tracingEnabled: env.TRACING_ENABLED })
    console.log("启动代理流程，跟踪功能状态:", env.TRACING_ENABLED ? "已启用" : "已禁用")

    // 总流程超时保护
    const flowTimeoutId = setTimeout(() => {
      if (isProcessing) {
        console.error("整体流程执行超时");
        setError(`流程执行时间过长，已自动终止。请缩短您的目标或稍后重试。`);
        setIsProcessing(false);
        track("agent_flow_timeout", {
          goal: userGoal,
          duration: Date.now() - startTime,
        });
      }
    }, TIMEOUTS.TOTAL_PROCESS);

    // 定义默认结果，防止流程中断
    let planResult = "未能生成有效计划。";
    let searchResult = "未能获取相关信息。";
    let reasoningResult = "未能完成分析推理。";
    let finalResult = "由于处理过程中出现问题，无法生成完整回应。请重试或修改您的目标。";

    try {
      // 步骤1：规划代理
      updateAgentStatus("planner", "processing")
      track("agent_step_start", { agent: "planner", goal: userGoal })
      const plannerStartTime = Date.now()

      try {
        // 使用超时包装规划代理调用
        planResult = await withTimeout(
          runPlannerAgent(userGoal),
          TIMEOUTS.AGENT_STEP,
          "规划代理"
        )
      } catch (error) {
        console.warn("使用LangChain规划代理失败，切换到备用方案", error)
        setUseFallback(true)

        try {
          planResult = await withTimeout(
            backupAgents.runPlannerAgent(userGoal),
            TIMEOUTS.AGENT_STEP,
            "备用规划代理"
          )
        } catch (fallbackError) {
          console.error("备用规划代理也失败:", fallbackError)
          // 使用默认值继续流程
        }
      }

      updateAgentStatus("planner", "completed", planResult)
      track("agent_step_complete", {
        agent: "planner",
        duration: Date.now() - plannerStartTime,
        resultLength: planResult.length,
        usedFallback: useFallback,
      })

      // 步骤2：搜索代理
      updateAgentStatus("searcher", "processing")
      track("agent_step_start", { agent: "searcher", goal: userGoal })
      const searcherStartTime = Date.now()

      try {
        searchResult = useFallback
          ? await withTimeout(
            backupAgents.runSearchAgent(userGoal, planResult),
            TIMEOUTS.AGENT_STEP,
            "备用搜索代理"
          )
          : await withTimeout(
            runSearchAgent(userGoal, planResult),
            TIMEOUTS.AGENT_STEP,
            "搜索代理"
          )
      } catch (error) {
        console.warn("搜索代理失败，尝试备用方案", error)
        setUseFallback(true)

        try {
          searchResult = await withTimeout(
            backupAgents.runSearchAgent(userGoal, planResult),
            TIMEOUTS.AGENT_STEP,
            "备用搜索代理"
          )
        } catch (fallbackError) {
          console.error("备用搜索代理也失败:", fallbackError)
          // 使用默认值继续流程
        }
      }

      updateAgentStatus("searcher", "completed", searchResult)
      track("agent_step_complete", {
        agent: "searcher",
        duration: Date.now() - searcherStartTime,
        resultLength: searchResult.length,
        usedFallback: useFallback,
      })

      // 步骤3：推理代理
      updateAgentStatus("reasoner", "processing")
      track("agent_step_start", { agent: "reasoner", goal: userGoal })
      const reasonerStartTime = Date.now()

      try {
        reasoningResult = useFallback
          ? await withTimeout(
            backupAgents.runReasoningAgent(userGoal, planResult, searchResult),
            TIMEOUTS.AGENT_STEP,
            "备用推理代理"
          )
          : await withTimeout(
            runReasoningAgent(userGoal, planResult, searchResult),
            TIMEOUTS.AGENT_STEP,
            "推理代理"
          )
      } catch (error) {
        console.warn("推理代理失败，尝试备用方案", error)
        setUseFallback(true)

        try {
          reasoningResult = await withTimeout(
            backupAgents.runReasoningAgent(userGoal, planResult, searchResult),
            TIMEOUTS.AGENT_STEP,
            "备用推理代理"
          )
        } catch (fallbackError) {
          console.error("备用推理代理也失败:", fallbackError)
          // 使用默认值继续流程
        }
      }

      updateAgentStatus("reasoner", "completed", reasoningResult)
      track("agent_step_complete", {
        agent: "reasoner",
        duration: Date.now() - reasonerStartTime,
        resultLength: reasoningResult.length,
        usedFallback: useFallback,
      })

      // 步骤4：写作代理
      updateAgentStatus("writer", "processing")
      track("agent_step_start", { agent: "writer", goal: userGoal })
      const writerStartTime = Date.now()

      try {
        finalResult = useFallback
          ? await withTimeout(
            backupAgents.runWritingAgent(userGoal, planResult, searchResult, reasoningResult),
            TIMEOUTS.AGENT_STEP,
            "备用写作代理"
          )
          : await withTimeout(
            runWritingAgent(userGoal, planResult, searchResult, reasoningResult),
            TIMEOUTS.AGENT_STEP,
            "写作代理"
          )
      } catch (error) {
        console.warn("写作代理失败，尝试备用方案", error)
        setUseFallback(true)

        try {
          finalResult = await withTimeout(
            backupAgents.runWritingAgent(userGoal, planResult, searchResult, reasoningResult),
            TIMEOUTS.AGENT_STEP,
            "备用写作代理"
          )
        } catch (fallbackError) {
          console.error("备用写作代理也失败:", fallbackError)
          // 使用默认值继续流程
        }
      }

      updateAgentStatus("writer", "completed", finalResult)
      track("agent_step_complete", {
        agent: "writer",
        duration: Date.now() - writerStartTime,
        resultLength: finalResult.length,
        usedFallback: useFallback,
      })

      // 设置最终结果
      setFinalResult(finalResult)

      // 评估结果质量
      if (!useFallback) {
        track("evaluation_start", { goal: userGoal })
        const evaluationStartTime = Date.now()

        try {
          // 使用超时包装评估调用
          const evaluation = await withTimeout(
            evaluateAgentResponse(userGoal, finalResult),
            TIMEOUTS.AGENT_STEP,
            "结果评估"
          )

          console.log("原始评估结果:", evaluation);

          // 验证评估结果并进行类型转换
          const requiredFields = ["relevance", "completeness", "actionability", "clarity", "overallScore", "suggestions"] as const;
          let validationPassed = true;

          // 验证结果完整性
          for (const field of requiredFields) {
            if (evaluation[field as keyof typeof evaluation] === undefined ||
              evaluation[field as keyof typeof evaluation] === null) {
              validationPassed = false;
              console.warn(`评估结果缺少字段: ${field}`);
            }
          }

          if (validationPassed) {
            // 确保数值字段是数字类型
            const numericFields = ["relevance", "completeness", "actionability", "clarity", "overallScore"] as const;
            numericFields.forEach(field => {
              const value = evaluation[field];
              if (value !== undefined) {
                (evaluation as any)[field] = typeof value === 'number' ?
                  value :
                  Number(value) || 5; // 如果无法转换则使用默认值5
              }
            });

            setEvaluation(evaluation)

            track("evaluation_complete", {
              duration: Date.now() - evaluationStartTime,
              overallScore: evaluation.overallScore,
              goal: userGoal,
            })
          } else {
            throw new Error("评估结果验证失败");
          }
        } catch (error) {
          console.warn("评估过程出错，使用默认评估:", error);

          // 使用默认评估结果
          const defaultEvaluation = {
            relevance: 3,
            completeness: 3,
            actionability: 3,
            clarity: 3,
            overallScore: 3,
            suggestions: "无法获取详细评估，使用默认评分。"
          };

          setEvaluation(defaultEvaluation)

          track("evaluation_fallback", {
            error: String(error),
            goal: userGoal
          })
        }
      }

      // 标记流程完成
      setComplete(true)

      // 保存任务到历史记录
      saveTaskToHistory()

      // 记录整个流程完成
      track("agent_flow_complete", {
        goal: userGoal,
        duration: Date.now() - startTime,
        usedFallback: useFallback,
      })
    } catch (error) {
      console.error("代理流程错误:", error)
      setError(error instanceof Error ? error.message : "发生未知错误")

      // 尝试设置结果，即使有错误也显示部分结果
      if (finalResult && finalResult !== "由于处理过程中出现问题，无法生成完整回应。请重试或修改您的目标。") {
        setFinalResult(finalResult);
      }

      track("agent_flow_error", {
        error: error instanceof Error ? error.message : String(error),
        goal: userGoal,
        duration: Date.now() - startTime,
      })
    } finally {
      // 清除总流程超时
      clearTimeout(flowTimeoutId);

      // 确保无论如何都会重置处理状态
      console.log("任务处理完成，重置状态");
      setIsProcessing(false);
      setUseFallback(false);
    }
  }, [
    userGoal,
    isProcessing,
    useFallback, // 添加这个依赖
    retryCount,  // 添加这个依赖
    updateAgentStatus,
    setFinalResult,
    setComplete,
    setError,
    saveTaskToHistory,
    setEvaluation,
    track,
  ])

  // 添加调试输出，检查isProcessing状态
  useEffect(() => {
    console.log("isProcessing状态变更:", isProcessing);
  }, [isProcessing]);

  // 添加一个useEffect来监测流程状态
  useEffect(() => {
    if (isProcessing) {
      // 添加额外的超时保护，确保流程最终结束
      const safetyTimeoutId = setTimeout(() => {
        console.warn("安全超时触发：强制重置处理状态");
        setIsProcessing(false);
      }, TIMEOUTS.TOTAL_PROCESS + 10000); // 比主超时多10秒

      return () => clearTimeout(safetyTimeoutId);
    }
  }, [isProcessing]);

  return { startAgentFlow, isProcessing }
}
