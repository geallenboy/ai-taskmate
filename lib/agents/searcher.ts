import { createChatOpenAI, createChain, runChain } from "../langchain-config"

export async function runSearchAgent(userGoal: string, planResult: string): Promise<string> {
  const model = createChatOpenAI(0.7)

  const template = `你是一个搜索Agent，负责收集任务相关的信息。
  你的工作是根据用户的目标和计划，识别关键信息需求并提供最相关的信息。
  请将你的回答格式化为不同信息类别的章节，并带有标题。
  
  用户目标: {userGoal}
  
  计划: {planResult}
  
  请提供每个任务所需的关键信息:`

  try {
    const chain = await createChain(template, model, "search-agent")
    const result = await runChain(chain, { userGoal, planResult })
    return result
  } catch (error) {
    console.error("搜索代理错误:", error)
    throw new Error("搜索代理执行失败: " + (error instanceof Error ? error.message : String(error)))
  }
}
