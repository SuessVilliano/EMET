'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EmetAvatar } from './EmetAvatar';

interface Message {
  id: string;
  role: 'user' | 'emet';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage?: (content: string) => void;
  isThinking?: boolean;
  onFileUpload?: (file: File) => void;
}

export function ChatInterface({
  messages,
  onSendMessage,
  isThinking = false,
  onFileUpload,
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage?.(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload?.(file);
    }
    e.target.value = '';
  };

  return (
    <div className="flex flex-col h-full bg-gray-900/20 rounded-lg border border-primary/10 overflow-hidden">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <EmetAvatar size="lg" />
            <h3 className="text-lg font-semibold text-white mt-4">
              Welcome to EMET
            </h3>
            <p className="text-gray-400 text-sm mt-2 max-w-xs">
              Ask me anything about water, energy, food, housing, or legal matters. I'm here to help protect the truth.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3 animate-in fade-in slide-in-from-bottom-2',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'emet' && <EmetAvatar size="sm" />}

              <div
                className={cn(
                  'max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2.5 rounded-lg',
                  message.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-gray-800/60 text-gray-100 border border-primary/20'
                )}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {message.content}
                </p>
                <p className={cn(
                  'text-xs mt-1.5',
                  message.role === 'user'
                    ? 'text-blue-100'
                    : 'text-gray-500'
                )}>
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))
        )}

        {/* Thinking Indicator */}
        {isThinking && (
          <div className="flex gap-3 justify-start">
            <EmetAvatar size="sm" speaking />
            <div className="bg-gray-800/60 border border-primary/20 text-gray-100 px-4 py-3 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="inline-block w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="inline-block w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-primary/10 p-4 space-y-3">
        <div className="flex gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask EMET anything... (Shift+Enter for new line)"
            className={cn(
              'flex-1 px-4 py-2 rounded-lg bg-gray-800/60 border border-primary/20',
              'text-white placeholder-gray-500 focus:outline-none focus:border-primary/50',
              'resize-none transition-colors text-sm'
            )}
            rows={1}
            aria-label="Message input"
          />

          <div className="flex items-end gap-2">
            {/* File Upload */}
            <label className="p-2.5 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer group">
              <Paperclip className="w-5 h-5 text-primary/70 group-hover:text-primary transition-colors" />
              <input
                type="file"
                accept=".pdf,.docx,.txt,.csv,.png,.jpg,.jpeg,.gif"
                onChange={handleFileSelect}
                className="hidden"
                aria-label="Upload file"
              />
            </label>

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className={cn(
                'p-2.5 rounded-lg transition-all duration-200',
                input.trim()
                  ? 'bg-primary hover:bg-primary/90 text-white'
                  : 'bg-primary/20 text-primary/50 cursor-not-allowed'
              )}
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center">
          EMET respects your privacy. All conversations are encrypted.
        </p>
      </div>
    </div>
  );
}
