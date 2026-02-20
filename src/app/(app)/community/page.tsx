'use client'

import { useState } from 'react'
import { Hash, Send, Share2, Users } from 'lucide-react'

interface Channel {
  id: string
  name: string
  members: number
}

interface Message {
  id: string
  author: string
  avatar: string
  content: string
  timestamp: string
  reactions: number
}

const channels: Channel[] = [
  { id: '1', name: 'general', members: 847 },
  { id: '2', name: 'water-solutions', members: 342 },
  { id: '3', name: 'solar-energy', members: 521 },
  { id: '4', name: 'food-security', members: 289 },
  { id: '5', name: 'legal-help', members: 156 },
  { id: '6', name: 'financial-freedom', members: 412 },
  { id: '7', name: 'off-grid-living', members: 378 },
]

const generalMessages: Message[] = [
  {
    id: '1',
    author: 'Sarah Kim',
    avatar: 'SK',
    content:
      'Just got my water system running! The community resources were so helpful.',
    timestamp: '2 hours ago',
    reactions: 12,
  },
  {
    id: '2',
    author: 'James Rodriguez',
    avatar: 'JR',
    content:
      'Anyone else notice the new proposal about expanding energy resources? It looks promising.',
    timestamp: '1 hour ago',
    reactions: 8,
  },
  {
    id: '3',
    author: 'Elena Volkov',
    avatar: 'EV',
    content:
      'The legal library has been updated with new UCC resources. Check it out if youre interested in sovereignty.',
    timestamp: '45 minutes ago',
    reactions: 24,
  },
  {
    id: '4',
    author: 'Marcus Chen',
    avatar: 'MC',
    content: 'How many here are completely off-grid now?',
    timestamp: '30 minutes ago',
    reactions: 5,
  },
]

export default function CommunityPage() {
  const [selectedChannel, setSelectedChannel] = useState('general')
  const [messageInput, setMessageInput] = useState('')

  const currentChannel = channels.find((c) => c.id === selectedChannel) || channels[0]

  return (
    <div className="flex gap-6 h-[calc(100vh-180px)]">
      {/* Channels Sidebar */}
      <div className="w-64 rounded-lg border border-slate-700 bg-slate-900/50 p-4 flex flex-col">
        <h2 className="text-lg font-bold text-white mb-6">Channels</h2>
        <div className="flex-1 space-y-2 overflow-y-auto">
          {channels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => setSelectedChannel(channel.id)}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${
                selectedChannel === channel.id
                  ? 'bg-emerald-500/30 border border-emerald-500 text-emerald-400'
                  : 'border border-transparent text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4" />
                <span className="font-medium">{channel.name}</span>
              </div>
              <p className="text-xs text-slate-500 ml-6 mt-1">
                {channel.members} members
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 rounded-lg border border-slate-700 bg-slate-900/50 flex flex-col">
        {/* Channel Header */}
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Hash className="w-5 h-5 text-slate-400" />
              <h2 className="text-xl font-bold text-white">
                {currentChannel.name}
              </h2>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{currentChannel.members} members</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {generalMessages.map((msg) => (
            <div key={msg.id} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-blue-400 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-sm">
                  {msg.avatar}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-white">{msg.author}</p>
                  <p className="text-xs text-slate-500">{msg.timestamp}</p>
                </div>
                <p className="text-slate-300 mb-2">{msg.content}</p>
                <button className="text-sm text-slate-500 hover:text-emerald-400 transition">
                  React ({msg.reactions})
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-slate-700 space-y-3">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-700 bg-slate-900/50 hover:border-slate-600 transition text-slate-300 text-sm">
            <Share2 className="w-4 h-4" />
            Share a Finding
          </button>

          <div className="flex gap-3">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
            <button className="px-4 py-3 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30 transition">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
