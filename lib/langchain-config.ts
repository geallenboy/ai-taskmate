import { ChatOpenAI } from "@langchain/openai"
import { PromptTemplate } from "@langchain/core/prompts"
import { StringOutputParser } from "@langchain/core/output_parsers"
import { getEnv } from "./env"

// 获取环境配置
const env = getEnv()

// 创建ChatOpenAI模型实例
export const createChatOpenAI = (temperature = 0.7) => {
  return new ChatOpenAI({
    modelName: "gpt-4o",
    temperature,
    openAIApiKey: env.OPENAI_API_KEY,
  })
}

// 创建LLMChain
export const createChain = async (template: string, llm: ChatOpenAI, runName?: string) => {
  const prompt = PromptTemplate.fromTemplate(template)
  const outputParser = new StringOutputParser()

  // 使用pipe方法创建链
  let chain = prompt.pipe(llm).pipe(outputParser)

  // 如果启用了跟踪，添加标签和元数据
  if (env.TRACING_ENABLED && runName) {
    console.log(`为链 ${runName} 添加跟踪配置`)
    chain = chain.withConfig({
      tags: ["ai-taskmate", runName],
      metadata: {
        project: env.LANGCHAIN_PROJECT,
        timestamp: new Date().toISOString(),
        version: "1.0.0", // 添加版本号以便跟踪提示词的变化
      },
    })
  }

  return chain
}

// 执行链并返回结果
export const runChain = async (chain: any, input: Record<string, any>) => {
  // 添加运行时元数据
  const enhancedInput = env.TRACING_ENABLED
    ? {
        ...input,
        metadata: {
          ...(input.metadata || {}),
          runTimestamp: new Date().toISOString(),
          project: env.LANGCHAIN_PROJECT,
        },
      }
    : input

  try {
    return await chain.invoke(enhancedInput)
  } catch (error) {
    console.error("执行链时出错:", error)
    throw error
  }
}
