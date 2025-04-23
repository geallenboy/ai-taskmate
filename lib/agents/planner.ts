import { createChatOpenAI, createChain, runChain } from "../langchain-config"

export async function runPlannerAgent(userGoal: string): Promise<string> {
  const model = createChatOpenAI(0.7)

  const template = `你是一个规划Agent，负责将用户目标分解为清晰、可操作的任务。
  你的工作是分析用户的目标并创建一个结构化的计划，包含具体步骤。
  请将你的回答格式化为带有简短解释的编号任务列表。
  
  用户目标: {userGoal}
  
  请提供详细的任务分解计划:`

  try {
    const chain = await createChain(template, model, "planner-agent")
    const result = await runChain(chain, { userGoal })
    return result
  } catch (error) {
    console.error("规划代理错误:", error)
    throw new Error("规划代理执行失败: " + (error instanceof Error ? error.message : String(error)))
  }
}
