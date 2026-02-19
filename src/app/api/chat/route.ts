import { streamText } from 'ai'
import { EMET_SYSTEM_PROMPT, detectDomain, getDomainContext } from '@/lib/ai/emet-persona'
import { getModel } from '@/lib/ai/multi-llm'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: messages array required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Get the last user message to detect domain
    const lastUserMessage = messages
      .slice()
      .reverse()
      .find((msg: { role: string }) => msg.role === 'user')

    let systemPrompt = EMET_SYSTEM_PROMPT
    let taskType: 'conversation' | 'coding' | 'analysis' = 'conversation'

    if (lastUserMessage) {
      const userContent = lastUserMessage.content
      const domain = detectDomain(userContent)

      // Add domain-specific context to system prompt
      if (domain !== 'general') {
        const domainContext = getDomainContext(domain)
        if (domainContext) {
          systemPrompt += '\n\n' + domainContext
        }

        // Determine task type based on domain
        if (domain === 'legal' || domain === 'finance') {
          taskType = 'analysis'
        }
      }

      // Check if user is asking about code/programming
      if (
        userContent.toLowerCase().includes('code') ||
        userContent.toLowerCase().includes('programming') ||
        userContent.toLowerCase().includes('javascript') ||
        userContent.toLowerCase().includes('typescript') ||
        userContent.toLowerCase().includes('python') ||
        userContent.toLowerCase().includes('function') ||
        userContent.toLowerCase().includes('api') ||
        userContent.toLowerCase().includes('debug')
      ) {
        taskType = 'coding'
      }
    }

    // Get the appropriate model for this task type
    const model = getModel(taskType)

    // Stream the response
    const result = await streamText({
      model,
      system: systemPrompt,
      messages: messages as Parameters<typeof streamText>[0]['messages'],
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
