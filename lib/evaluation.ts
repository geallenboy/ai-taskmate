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
    
    用户目标: {goal}
    
    AI回应: {response}
    
    请从以下几个方面评分（1-10分）：
    1. 相关性：回应与用户目标的相关程度
    2. 完整性：回应是否全面解决了用户目标
    3. 可操作性：用户能否根据回应采取行动
    4. 清晰度：回应的结构和表达是否清晰
    
    请以纯JSON格式返回评估结果，不要包含任何其他文本，不要使用Markdown格式，不要使用代码块，直接返回原始JSON：
    {{
      "relevance": 1-10之间的数字,
      "completeness": 1-10之间的数字,
      "actionability": 1-10之间的数字,
      "clarity": 1-10之间的数字,
      "overallScore": 1-10之间的数字,
      "suggestions": "改进建议"
    }}
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

  function extractAndParseJSON(text: string): EvaluationResult {
    try {
      return JSON.parse(text) as EvaluationResult;
    } catch (e) {
      const jsonRegex = /{[\s\S]*?}/;
      const match = text.match(jsonRegex);

      if (match) {
        try {
          return JSON.parse(match[0]) as EvaluationResult;
        } catch (e2) {
          return defaultEvaluation();
        }
      }

      return defaultEvaluation();
    }
  }

  function defaultEvaluation(): EvaluationResult {
    return {
      relevance: 5,
      completeness: 5,
      actionability: 5,
      clarity: 5,
      overallScore: 5,
      suggestions: "无法解析评估结果，使用默认值"
    };
  }

  try {
    const result = await chain.invoke({
      goal: userGoal,
      response: agentResponse,
    })

    return extractAndParseJSON(result);
  } catch (error) {
    console.error("评估过程失败:", error);
    return defaultEvaluation();
  }
}
