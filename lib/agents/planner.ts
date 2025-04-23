import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function runPlannerAgent(userGoal: string): Promise<string> {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    system: `You are a Planning Agent that breaks down user goals into clear, actionable tasks. 
    Your job is to analyze the user's goal and create a structured plan with specific steps.
    Format your response as a numbered list of tasks with brief explanations.`,
    prompt: `Break down this goal into a clear, actionable plan: ${userGoal}`,
  })

  return text
}
