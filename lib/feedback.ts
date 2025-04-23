// 用户反馈系统
import { getEnv } from "./env"

// 获取环境配置
const env = getEnv()

export interface UserFeedback {
  taskId: string
  rating: number // 1-5 星评分
  feedback: string // 用户文字反馈
  timestamp: string
}

// 内存存储，实际应用中应替换为数据库
const feedbackStore: UserFeedback[] = []

export async function submitUserFeedback(taskId: string, rating: number, feedback: string): Promise<boolean> {
  try {
    // 保存到本地存储
    const userFeedback: UserFeedback = {
      taskId,
      rating,
      feedback,
      timestamp: new Date().toISOString(),
    }
    feedbackStore.push(userFeedback)

    // 如果启用了跟踪并配置了LangSmith API密钥，将反馈发送到LangSmith
    if (env.TRACING_ENABLED && env.LANGCHAIN_API_KEY) {
      await sendFeedbackToLangSmith(taskId, rating, feedback)
    }

    return true
  } catch (error) {
    console.error("提交反馈失败:", error)
    return false
  }
}

async function sendFeedbackToLangSmith(taskId: string, rating: number, feedback: string): Promise<void> {
  if (!env.LANGCHAIN_API_KEY) {
    console.warn("缺少LANGCHAIN_API_KEY，无法发送反馈到LangSmith")
    return
  }

  try {
    // 发送评分
    await fetch("https://api.smith.langchain.com/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.LANGCHAIN_API_KEY}`,
      },
      body: JSON.stringify({
        run_id: taskId,
        key: "user_rating",
        value: rating,
        comment: feedback,
        source_info: {
          project: env.LANGCHAIN_PROJECT,
        },
      }),
    })

    console.log("成功将反馈发送到LangSmith")
  } catch (error) {
    console.error("发送反馈到LangSmith失败:", error)
    throw error
  }
}

export function getFeedbackForTask(taskId: string): UserFeedback | undefined {
  return feedbackStore.find((f) => f.taskId === taskId)
}

export function getAllFeedback(): UserFeedback[] {
  return [...feedbackStore]
}
