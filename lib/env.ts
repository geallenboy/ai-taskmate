"use client"
// 环境变量配置
export const getEnv = () => {
  if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    throw new Error("缺少OPENAI_API_KEY环境变量")
  }

  // 明确启用LangChain跟踪
  const enableTracing = process.env.NEXT_PUBLIC_LANGSMITH_TRACING === "true"

  // 检查是否有LangSmith API密钥
  if (enableTracing && !process.env.NEXT_PUBLIC_LANGCHAIN_API_KEY) {
    console.warn("警告: 已启用LANGCHAIN_TRACING_V2但缺少LANGCHAIN_API_KEY，跟踪功能可能无法正常工作")
  }

  return {
    OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    LANGCHAIN_TRACING_V2: enableTracing ? "true" : "false", // 确保值为字符串
    LANGCHAIN_API_KEY: process.env.NEXT_PUBLIC_LANGCHAIN_API_KEY,
    LANGCHAIN_PROJECT: process.env.NEXT_PUBLIC_LANGCHAIN_PROJECT || "ai-taskmate",
    TRACING_ENABLED: enableTracing,
  }
}
