'use client'

import { useState } from 'react'
import { AlertTriangle, AlertCircle, Info } from 'lucide-react'

interface Alert {
  id: string
  title: string
  category: string
  level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  timestamp: string
  summary: string
}

const alerts: Alert[] = [
  {
    id: '1',
    title: 'California Drought Emergency Declared — AWG Demand Surges',
    category: 'Water',
    level: 'CRITICAL',
    timestamp: '2 hours ago',
    summary:
      'Governor declares emergency due to severe drought conditions. Atmospheric water generation demand increases 300% as communities seek alternatives.',
  },
  {
    id: '2',
    title: 'Federal Reserve Raises Rates Again — Student Loan Payments Jump',
    category: 'Finance',
    level: 'HIGH',
    timestamp: '4 hours ago',
    summary:
      'Fed raises rates by 0.25%. New students loans now at 6.75%. Impact on borrowers expected immediately.',
  },
  {
    id: '3',
    title: 'New Solar Incentive Bill Passes Senate Committee',
    category: 'Energy',
    level: 'MEDIUM',
    timestamp: '6 hours ago',
    summary:
      'Senate committee approves extension of 30% federal tax credit through 2035, expanding residential solar adoption.',
  },
  {
    id: '4',
    title: 'Urban Farming Movement Grows 40% in Major Cities',
    category: 'Food',
    level: 'LOW',
    timestamp: '8 hours ago',
    summary:
      'Community gardens and rooftop farms increase significantly. City policies now support urban agriculture initiatives.',
  },
  {
    id: '5',
    title: 'Supreme Court Rules on UCC Article 3 Interpretation',
    category: 'Legal',
    level: 'MEDIUM',
    timestamp: '10 hours ago',
    summary:
      'Important ruling affects commercial transactions and sovereign citizen strategies. Legal frameworks clarified.',
  },
  {
    id: '6',
    title: 'Housing Crisis Worsens — Alternative Housing Solutions Gain Traction',
    category: 'Housing',
    level: 'HIGH',
    timestamp: '12 hours ago',
    summary:
      'Modular and 3D-printed homes see increased adoption. Affordability crisis pushes innovation in construction.',
  },
]

const categories = ['All', 'Water', 'Energy', 'Food', 'Housing', 'Finance', 'Legal']

const getLevelColor = (level: string) => {
  switch (level) {
    case 'CRITICAL':
      return 'bg-red-500/20 border-red-500/50 text-red-400'
    case 'HIGH':
      return 'bg-orange-500/20 border-orange-500/50 text-orange-400'
    case 'MEDIUM':
      return 'bg-amber-500/20 border-amber-500/50 text-amber-400'
    case 'LOW':
      return 'bg-blue-500/20 border-blue-500/50 text-blue-400'
    default:
      return 'bg-slate-500/20 border-slate-500/50 text-slate-400'
  }
}

const getLevelIcon = (level: string) => {
  switch (level) {
    case 'CRITICAL':
      return <AlertTriangle className="w-5 h-5" />
    case 'HIGH':
      return <AlertCircle className="w-5 h-5" />
    default:
      return <Info className="w-5 h-5" />
  }
}

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filtered =
    selectedCategory === 'All'
      ? alerts
      : alerts.filter((a) => a.category === selectedCategory)

  return (
    <div className="space-y-8">
      {/* Filter Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-emerald-500/30 border border-emerald-500 text-emerald-400'
                : 'border border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filtered.map((alert) => (
          <div
            key={alert.id}
            className={`rounded-lg border p-6 transition hover:scale-102 ${
              alert.level === 'CRITICAL'
                ? 'bg-red-500/10 border-red-500/30 hover:border-red-500/50'
                : alert.level === 'HIGH'
                  ? 'bg-orange-500/10 border-orange-500/30 hover:border-orange-500/50'
                  : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div
                className={`p-2 rounded-lg flex-shrink-0 ${getLevelColor(
                  alert.level
                )}`}
              >
                {getLevelIcon(alert.level)}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-lg font-semibold text-white">
                    {alert.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${getLevelColor(
                      alert.level
                    )}`}
                  >
                    {alert.level}
                  </span>
                </div>

                <p className="text-slate-300 mb-3">{alert.summary}</p>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="px-2 py-1 rounded text-xs bg-slate-800 text-slate-400">
                      {alert.category}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">{alert.timestamp}</p>
                </div>
              </div>

              {/* Read More Button */}
              <button className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-600 transition text-sm font-semibold whitespace-nowrap">
                Read
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
