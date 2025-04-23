import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function runSearchAgent(userGoal: string, planResult: string): Promise<string> {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    system: `You are a Search Agent that collects relevant information for tasks.
    Your job is to identify key information needs based on the user's goal and plan,
    and provide the most relevant information.
    Format your response as sections with headings for different information categories.`,
    prompt: `Based on this goal: "${userGoal}" and this plan: "${planResult}", 
    what are the key pieces of information needed? Provide relevant information for each task.`,
  })

  return text
}
