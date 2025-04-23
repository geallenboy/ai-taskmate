"use client"

import { useEffect, useState } from "react"
import { generateSessionId, trackEvent } from "@/lib/analytics"

export function useAnalytics() {
  const [sessionId, setSessionId] = useState<string>("")

  useEffect(() => {
    // 在客户端初始化会话ID
    if (!sessionId) {
      const newSessionId = generateSessionId()
      setSessionId(newSessionId)
      trackEvent("session_start", newSessionId)
    }

    // 在组件卸载时记录会话结束
    return () => {
      if (sessionId) {
        trackEvent("session_end", sessionId)
      }
    }
  }, [sessionId])

  const track = (eventType: string, properties: Record<string, any> = {}) => {
    if (sessionId) {
      trackEvent(eventType, sessionId, properties)
    }
  }

  return { track, sessionId }
}
