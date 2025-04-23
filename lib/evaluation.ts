import { ChatOpenAI } from "@langchain/openai"
import { PromptTemplate } from "@langchain/core/prompts"
import { StringOutputParser } from "@langchain/core/output_parsers"
import { getEnv } from "./env"

// 获取环境配置
const env = getEnv()

export interface EvaluationResult {
  relevance: number
  completeness: number
  actionability: number
  clarity: number
  overallScore: number
  suggestions: string
}

export async function evaluateAgentResponse(userGoal: string, agentResponse: string): Promise<EvaluationResult> {
  const evaluator = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0.2, // 低温度以获得一致的评估
    openAIApiKey: env.OPENAI_API_KEY,
  })

  const evaluationPrompt = PromptTemplate.fromTemplate(`
    你是一个评估AI回应质量的专家。请评估以下AI回应是否满足用户目标。
    
    用户目标: {userGoal}
    
    AI回应: {agentResponse}
    
    请从以下几个方面评分（1-10分）：
    1. 相关性：回应与用户目标的相关程度
    2. 完整性：回应是否全面解决了用户目标
    3. 可操作性：用户能否根据回应采取行动
    4. 清晰度：回应的结构和表达是否清晰
    
    请以JSON格式返回评估结果，格式如下：
    {
      "relevance": 数字,
      "completeness": 数字,
      "actionability": 数字,
      "clarity": 数字,
      "overallScore": 数字,
      "suggestions": "改进建议"
    }
  `)

  const outputParser = new StringOutputParser()

  // 使用pipe方法创建链
  let chain = evaluationPrompt.pipe(evaluator).pipe(outputParser)

  // 只有在启用跟踪时才添加标签和元数据
  if (env.TRACING_ENABLED) {
    chain = chain.withConfig({
      tags: ["ai-taskmate", "evaluation-chain"],
      metadata: {
        project: env.LANGCHAIN_PROJECT,
        evaluationType: "response-quality",
        timestamp: new Date().toISOString(),
      },
    })
  }

  try {
    const result = await chain.invoke({
      userGoal,
      agentResponse,
    })

    return JSON.parse(result) as EvaluationResult
  } catch (error) {
    console.error("解析评估结果失败:", error)
    throw new Error("评估结果格式错误: " + (error instanceof Error ? error.message : String(error)))
  }
}
