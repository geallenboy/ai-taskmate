import { createChatOpenAI, createChain, runChain } from "../langchain-config"

export async function runReasoningAgent(userGoal: string, planResult: string, searchResult: string): Promise<string> {
  const model = createChatOpenAI(0.7)

  const template = `你是一个推理Agent，负责处理和分析信息。
  你的工作是评估收集到的信息，识别模式，并得出结论。
  请为计划的每个部分提供清晰的推理和分析。
  
  用户目标: {userGoal}
  
  计划: {planResult}
  
  信息: {searchResult}
  
  请提供你的分析，识别关键见解以及它们如何连接起来以实现目标:`

  try {
    const chain = await createChain(template, model, "reasoning-agent")
    const result = await runChain(chain, { userGoal, planResult, searchResult })
    return result
  } catch (error) {
    console.error("推理代理错误:", error)
    throw new Error("推理代理执行失败: " + (error instanceof Error ? error.message : String(error)))
  }
}
