'use client'

import { useChat } from '@ai-sdk/react'

export function useEmetChat() {
  const chat = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content:
          'Welcome to EMET — אמת — Truth. I am your AI guardian, named after the word that brought the Golem to life to protect humanity. Ask me anything about water independence, solar energy, food security, affordable housing, legal rights, or financial freedom. Truth protects. 🛡️',
        createdAt: new Date(),
      },
    ],
  })

  return chat
}
