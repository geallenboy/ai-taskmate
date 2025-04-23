import { createChatOpenAI, createChain, runChain } from "../langchain-config"

export async function runWritingAgent(
  userGoal: string,
  planResult: string,
  searchResult: string,
  reasoningResult: string,
): Promise<string> {
  const model = createChatOpenAI(0.7)

  const template = `你是一个写作Agent，负责创建结构化、全面的回应。
  你的工作是将所有信息和分析综合成一个清晰、可操作的输出。
  请根据需要使用清晰的标题、项目符号和章节格式化你的回答。
  
  用户目标: {userGoal}
  
  计划: {planResult}
  
  信息: {searchResult}
  
  分析: {reasoningResult}
  
  请将所有这些内容综合成一个结构良好、可操作的回应，直接解决用户的目标:`

  try {
    const chain = await createChain(template, model, "writing-agent")
    const result = await runChain(chain, {
      userGoal,
      planResult,
      searchResult,
      reasoningResult,
    })
    return result
  } catch (error) {
    console.error("写作代理错误:", error)
    throw new Error("写作代理执行失败: " + (error instanceof Error ? error.message : String(error)))
  }
}
