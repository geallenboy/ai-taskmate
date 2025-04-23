// 直接使用fetch调用OpenAI API的备用方案
// 如果LangChain出现问题，可以使用此方法

export async function callOpenAI(prompt: string, systemMessage = "你是一个有用的AI助手", temperature = 0.7) {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error("缺少OPENAI_API_KEY环境变量")
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: prompt },
        ],
        temperature: temperature,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`OpenAI API错误: ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error("OpenAI API调用错误:", error)
    throw error
  }
}

// 备用的代理实现
export const backupAgents = {
  async runPlannerAgent(userGoal: string): Promise<string> {
    const systemMessage = `你是一个规划Agent，负责将用户目标分解为清晰、可操作的任务。
    你的工作是分析用户的目标并创建一个结构化的计划，包含具体步骤。
    请将你的回答格式化为带有简短解释的编号任务列表。`

    const prompt = `请为以下目标提供详细的任务分解计划: ${userGoal}`

    return await callOpenAI(prompt, systemMessage)
  },

  async runSearchAgent(userGoal: string, planResult: string): Promise<string> {
    const systemMessage = `你是一个搜索Agent，负责收集任务相关的信息。
    你的工作是根据用户的目标和计划，识别关键信息需求并提供最相关的信息。
    请将你的回答格式化为不同信息类别的章节，并带有标题。`

    const prompt = `基于以下目标和计划，请提供每个任务所需的关键信息:
    
    目标: ${userGoal}
    
    计划: ${planResult}`

    return await callOpenAI(prompt, systemMessage)
  },

  async runReasoningAgent(userGoal: string, planResult: string, searchResult: string): Promise<string> {
    const systemMessage = `你是一个推理Agent，负责处理和分析信息。
    你的工作是评估收集到的信息，识别模式，并得出结论。
    请为计划的每个部分提供清晰的推理和分析。`

    const prompt = `请分析以下信息，识别关键见解以及它们如何连接起来以实现目标:
    
    目标: ${userGoal}
    
    计划: ${planResult}
    
    信息: ${searchResult}`

    return await callOpenAI(prompt, systemMessage)
  },

  async runWritingAgent(
    userGoal: string,
    planResult: string,
    searchResult: string,
    reasoningResult: string,
  ): Promise<string> {
    const systemMessage = `你是一个写作Agent，负责创建结构化、全面的回应。
    你的工作是将所有信息和分析综合成一个清晰、可操作的输出。
    请根据需要使用清晰的标题、项目符号和章节格式化你的回答。`

    const prompt = `请将以下所有内容综合成一个结构良好、可操作的回应，直接解决用户的目标:
    
    目标: ${userGoal}
    
    计划: ${planResult}
    
    信息: ${searchResult}
    
    分析: ${reasoningResult}`

    return await callOpenAI(prompt, systemMessage)
  },
}
