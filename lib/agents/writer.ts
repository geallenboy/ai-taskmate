import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function runWritingAgent(
  userGoal: string,
  planResult: string,
  searchResult: string,
  reasoningResult: string,
): Promise<string> {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    system: `You are a Writing Agent that creates structured, comprehensive responses.
    Your job is to synthesize all the information and analysis into a clear, actionable output.
    Format your response with clear headings, bullet points, and sections as appropriate.`,
    prompt: `Create a comprehensive response for this goal:
    
    Goal: "${userGoal}"
    
    Plan: "${planResult}"
    
    Information: "${searchResult}"
    
    Analysis: "${reasoningResult}"
    
    Synthesize all of this into a well-structured, actionable response that directly addresses the user's goal.`,
  })

  return text
}
