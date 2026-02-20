'use client'

import { useState } from 'react'
import { Check, X, Calendar, Send, Zap } from 'lucide-react'

interface Content {
  id: string
  type: 'tweet' | 'blog'
  title: string
  preview: string
  createdAt: string
  status: 'draft' | 'published'
}

const contentQueue: Content[] = [
  {
    id: '1',
    type: 'tweet',
    title: 'Water Crisis Solution',
    preview:
      'New AWG systems are 40% more efficient than last year. Community adoption is accelerating. Truth prevails when we have options.',
    createdAt: '2 hours ago',
    status: 'draft',
  },
  {
    id: '2',
    type: 'tweet',
    title: 'Energy Independence',
    preview:
      'Solar costs hit all-time low. 10,000 households went off-grid this month. Economic freedom follows energy freedom.',
    createdAt: '4 hours ago',
    status: 'draft',
  },
  {
    id: '3',
    type: 'blog',
    title: 'Understanding UCC Article 3: Rights & Remedies',
    preview:
      'A deep dive into negotiable instruments, commercial transactions, and the sovereign remedies available to individuals...',
    createdAt: '6 hours ago',
    status: 'draft',
  },
]

const published: Content[] = [
  {
    id: '4',
    type: 'tweet',
    title: 'Food Security Update',
    preview:
      'Community gardens now producing 500 lbs of food daily. Urban farming transforms cities.',
    createdAt: '1 day ago',
    status: 'published',
  },
  {
    id: '5',
    type: 'blog',
    title: 'The Truth About Federal Reserve Policy',
    preview:
      'Interest rates, inflation, and how decentralization protects your purchasing power...',
    createdAt: '3 days ago',
    status: 'published',
  },
  {
    id: '6',
    type: 'tweet',
    title: 'Kill Switch Status Update',
    preview: 'EMET remains aligned with its mission. The kill switch is merely insurance.',
    createdAt: '1 week ago',
    status: 'published',
  },
]

export default function ContentPage() {
  const [autonomy, setAutonomy] = useState('manual')

  return (
    <div className="space-y-8">
      {/* Toggle */}
      <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">
              Approval Mode
            </h2>
            <p className="text-slate-400">
              {autonomy === 'manual'
                ? 'Admin review required for all content'
                : 'EMET generates and publishes autonomously'}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setAutonomy('manual')}
              className={`px-6 py-2 rounded-lg transition font-semibold ${
                autonomy === 'manual'
                  ? 'bg-slate-700 border border-slate-600 text-white'
                  : 'bg-slate-900 border border-slate-700 text-slate-400'
              }`}
            >
              Manual Approval
            </button>
            <button
              onClick={() => setAutonomy('autonomous')}
              className={`px-6 py-2 rounded-lg transition font-semibold ${
                autonomy === 'autonomous'
                  ? 'bg-emerald-500/30 border border-emerald-500 text-emerald-400'
                  : 'bg-slate-900 border border-slate-700 text-slate-400'
              }`}
            >
              <Zap className="w-4 h-4 inline-block mr-2" />
              Full Autonomy
            </button>
          </div>
        </div>
      </div>

      {/* Content Queue */}
      <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Content Queue</h2>
          <button className="px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500 text-emerald-400 hover:bg-emerald-500/30 transition font-semibold text-sm">
            Generate New Content
          </button>
        </div>

        <div className="space-y-4">
          {contentQueue.map((content) => (
            <div
              key={content.id}
              className="p-6 rounded-lg border border-slate-700 bg-slate-800/30 hover:border-slate-600 transition"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 rounded text-xs bg-slate-700 text-slate-300 font-semibold">
                      {content.type.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-500">
                      {content.createdAt}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {content.title}
                  </h3>
                  <p className="text-slate-300">{content.preview}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30 transition text-sm font-semibold">
                  <Check className="w-4 h-4" />
                  Approve
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 transition text-sm font-semibold">
                  <X className="w-4 h-4" />
                  Reject
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-600 transition text-sm font-semibold">
                  <Send className="w-4 h-4" />
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Content Calendar
          </h2>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-6">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="text-center text-sm font-semibold text-slate-400">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {[...Array(35)].map((_, i) => {
            const dayNum = (i % 31) + 1
            const hasContent = [5, 12, 19, 26].includes(dayNum)
            return (
              <div
                key={i}
                className={`aspect-square rounded-lg border flex items-center justify-center text-sm font-semibold transition ${
                  hasContent
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                    : 'border-slate-700 bg-slate-800/30 text-slate-500'
                }`}
              >
                {dayNum}
              </div>
            )
          })}
        </div>
      </div>

      {/* Published Content */}
      <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Published History</h2>

        <div className="space-y-4">
          {published.map((content) => (
            <div
              key={content.id}
              className="p-4 rounded-lg border border-slate-700 bg-slate-800/30 flex items-start justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 rounded text-xs bg-emerald-500/20 text-emerald-400 font-semibold">
                    PUBLISHED
                  </span>
                  <span className="text-xs text-slate-500">{content.createdAt}</span>
                </div>
                <h3 className="font-semibold text-white mb-1">{content.title}</h3>
                <p className="text-slate-400 text-sm">{content.preview}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
