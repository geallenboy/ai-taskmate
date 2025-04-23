import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function runReasoningAgent(userGoal: string, planResult: string, searchResult: string): Promise<string> {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    system: `You are a Reasoning Agent that processes and analyzes information.
    Your job is to evaluate the collected information, identify patterns, and draw conclusions.
    Format your response with clear reasoning and analysis for each part of the plan.`,
    prompt: `Analyze this information:
    
    Goal: "${userGoal}"
    
    Plan: "${planResult}"
    
    Information: "${searchResult}"
    
    Provide your analysis, identifying key insights and how they connect to accomplish the goal.`,
  })

  return text
}
