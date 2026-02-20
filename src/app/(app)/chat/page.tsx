'use client'

import { useChat } from '@ai-sdk/react'
import { useEffect, useRef } from 'react'
import { Send, Upload, AlertCircle } from 'lucide-react'

export default function ChatPage() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
  } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content:
          'Welcome to EMET — אמת — Truth. I am your AI guardian, named after the word that brought the Golem to life to protect humanity. Ask me anything about water independence, solar energy, food security, affordable housing, legal rights, or financial freedom. Truth protects.',
      },
    ],
  })

  const isStreaming = isLoading

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [input])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
    }
  }

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-2xl space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                  E
                </div>
              )}
              <div
                className={`max-w-xl rounded-lg px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 border border-slate-700 text-slate-100'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </p>
              </div>
              {message.role === 'user' && (
                <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-slate-300">
                  U
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isStreaming && messages[messages.length - 1]?.role !== 'assistant' && (
            <div className="flex gap-3">
              <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                E
              </div>
              <div className="rounded-lg bg-slate-800 border border-slate-700 px-4 py-3">
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-slate-500 animate-bounce"></div>
                  <div className="h-2 w-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="h-2 w-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex gap-3 justify-start">
              <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                !
              </div>
              <div className="max-w-xl rounded-lg bg-red-900/20 border border-red-800 px-4 py-3">
                <div className="flex gap-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-400">Connection Error</p>
                    <p className="text-sm text-red-300">{error.message || 'Failed to connect to EMET. Please check your API keys.'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-800 px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <button
              type="button"
              className="flex-shrink-0 rounded-lg border border-slate-700 bg-slate-800/50 p-3 text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition-colors"
              title="Upload document"
            >
              <Upload className="h-5 w-5" />
            </button>

            <div className="flex-1 flex flex-col">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask EMET anything..."
                className="min-h-12 max-h-32 resize-none rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
                disabled={isStreaming}
                rows={1}
              />
              <p className="mt-1 text-xs text-slate-500">
                Enter to send, Shift+Enter for new line
              </p>
            </div>

            <button
              type="submit"
              disabled={isStreaming || !input.trim()}
              className="flex-shrink-0 rounded-lg bg-emerald-600 p-3 text-white hover:bg-emerald-700 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
              title="Send message"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
