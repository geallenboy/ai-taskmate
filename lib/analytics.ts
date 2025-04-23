// 添加分析功能，记录用户行为和系统性能
export interface AnalyticsEvent {
  eventType: string
  userId?: string
  sessionId: string
  timestamp: string
  properties: Record<string, any>
}

// 内存存储，实际应用中应替换为数据库
const analyticsEvents: AnalyticsEvent[] = []

// 记录事件
export function trackEvent(
  eventType: string,
  sessionId: string,
  properties: Record<string, any> = {},
  userId?: string,
): void {
  const event: AnalyticsEvent = {
    eventType,
    userId,
    sessionId,
    timestamp: new Date().toISOString(),
    properties: {
      ...properties,
      project: process.env.LANGCHAIN_PROJECT || "ai-taskmate",
      environment: process.env.NODE_ENV || "development",
    },
  }

  analyticsEvents.push(event)
  console.log(`[Analytics] Tracked event: ${eventType}`, event)

  // 在实际应用中，这里应该将事件发送到分析服务
  // 例如 Google Analytics、Mixpanel 或自定义后端
}

// 获取事件
export function getEvents(): AnalyticsEvent[] {
  return analyticsEvents
}

// 获取特定类型的事件
export function getEventsByType(eventType: string): AnalyticsEvent[] {
  return analyticsEvents.filter((event) => event.eventType === eventType)
}

// 清除事件（仅用于测试）
export function clearEvents(): void {
  analyticsEvents.length = 0
}

// 生成会话ID
export function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
