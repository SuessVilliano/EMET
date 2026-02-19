import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'
import type { LanguageModel } from 'ai'

type TaskType = 'conversation' | 'coding' | 'analysis'

// Initialize providers based on available API keys
const getProviders = () => {
  const providers: Record<string, LanguageModel | null> = {
    groq: null,
    google: null,
    openai: null,
    anthropic: null,
  }

  // Groq (Llama 3.1 70B / Qwen - cheapest & fastest)
  if (process.env.GROQ_API_KEY) {
    const groqClient = createOpenAI({
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey: process.env.GROQ_API_KEY,
    })
    providers.groq = groqClient('llama-3.1-70b-versatile')
  }

  // Google Gemini 2.0 Flash
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    providers.google = google('gemini-2.0-flash')
  }

  // OpenAI GPT-4o-mini
  if (process.env.OPENAI_API_KEY) {
    const openaiClient = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
    providers.openai = openaiClient('gpt-4o-mini')
  }

  // Anthropic Claude 3.5 Sonnet
  if (process.env.ANTHROPIC_API_KEY) {
    providers.anthropic = anthropic('claude-3-5-sonnet-20241022')
  }

  return providers
}

/**
 * Get the appropriate model based on task type
 * Provides automatic fallback chain
 */
export function getModel(taskType: TaskType): LanguageModel {
  const providers = getProviders()

  switch (taskType) {
    case 'coding': {
      // Use Claude 3.5 Sonnet for coding tasks (best for code)
      if (providers.anthropic) {
        return providers.anthropic
      }
      // Fallback: Gemini Flash, then GPT-4o-mini, then Groq
      if (providers.google) return providers.google
      if (providers.openai) return providers.openai
      if (providers.groq) return providers.groq
      throw new Error(
        'No LLM providers available for coding tasks. Please configure ANTHROPIC_API_KEY, GOOGLE_API_KEY, OPENAI_API_KEY, or GROQ_API_KEY.'
      )
    }

    case 'analysis': {
      // Use Gemini Flash first for analysis, fallback to Claude
      if (providers.google) return providers.google
      if (providers.anthropic) return providers.anthropic
      if (providers.openai) return providers.openai
      if (providers.groq) return providers.groq
      throw new Error(
        'No LLM providers available for analysis tasks. Please configure GOOGLE_API_KEY, ANTHROPIC_API_KEY, OPENAI_API_KEY, or GROQ_API_KEY.'
      )
    }

    case 'conversation':
    default: {
      // Priority: Groq (cheapest/fastest) → Gemini → GPT-4o-mini → Claude
      if (providers.groq) return providers.groq
      if (providers.google) return providers.google
      if (providers.openai) return providers.openai
      if (providers.anthropic) return providers.anthropic
      throw new Error(
        'No LLM providers available. Please configure at least one of: GROQ_API_KEY, GOOGLE_API_KEY, OPENAI_API_KEY, or ANTHROPIC_API_KEY.'
      )
    }
  }
}

/**
 * Stream chat response with automatic fallback
 */
export async function streamChat(
  messages: Array<{ role: string; content: string }>,
  systemPrompt: string,
  taskType: TaskType = 'conversation'
) {
  const model = getModel(taskType)

  const result = await streamText({
    model,
    system: systemPrompt,
    messages: messages as Parameters<typeof streamText>[0]['messages'],
  })

  return result
}
