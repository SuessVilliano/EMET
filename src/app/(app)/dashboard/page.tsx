'use client'

import { Users, Vote, AlertTriangle, ShoppingBag } from 'lucide-react'

export default function DashboardPage() {
  const kpis = [
    {
      title: 'Active Members',
      value: '1,247',
      icon: Users,
      color: 'bg-blue-500/20',
      textColor: 'text-blue-400',
    },
    {
      title: 'Open Proposals',
      value: '12',
      icon: Vote,
      color: 'bg-emerald-500/20',
      textColor: 'text-emerald-400',
    },
    {
      title: 'News Alerts',
      value: '8',
      icon: AlertTriangle,
      color: 'bg-amber-500/20',
      textColor: 'text-amber-400',
    },
    {
      title: 'Products Listed',
      value: '156',
      icon: ShoppingBag,
      color: 'bg-purple-500/20',
      textColor: 'text-purple-400',
    },
  ]

  const feedItems = [
    {
      id: 1,
      author: 'Jane Chen',
      avatar: 'JC',
      content: 'Just installed our new AWG system. Water quality is exceptional!',
      timestamp: '2 hours ago',
      likes: 24,
    },
    {
      id: 2,
      author: 'Marcus Johnson',
      avatar: 'MJ',
      content: 'Solar array now operating at 98% efficiency. Thanks EMET for the resources.',
      timestamp: '4 hours ago',
      likes: 56,
    },
    {
      id: 3,
      author: 'Elena Rodriguez',
      avatar: 'ER',
      content: 'Community hydroponic farm is producing 200lbs of vegetables weekly.',
      timestamp: '6 hours ago',
      likes: 89,
    },
    {
      id: 4,
      author: 'David Park',
      avatar: 'DP',
      content: 'Passed the constitutional law course! EMET\'s legal resources were invaluable.',
      timestamp: '8 hours ago',
      likes: 42,
    },
  ]

  const news = [
    {
      id: 1,
      title: 'Federal Solar Tax Credit Extended Through 2035',
      source: 'Energy News Daily',
      timestamp: '1 hour ago',
      category: 'Energy',
    },
    {
      id: 2,
      title: 'Water Scarcity Crisis Accelerates Investment in Atmospheric Solutions',
      source: 'Climate Watch',
      timestamp: '3 hours ago',
      category: 'Water',
    },
    {
      id: 3,
      title: 'New UCC Court Ruling Favors Privacy Rights',
      source: 'Legal Today',
      timestamp: '5 hours ago',
      category: 'Legal',
    },
    {
      id: 4,
      title: 'Urban Farming Movement Reaches 10,000 Community Gardens',
      source: 'Sustain Magazine',
      timestamp: '7 hours ago',
      category: 'Food',
    },
  ]

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div
              key={kpi.title}
              className="p-6 rounded-lg border border-slate-700 bg-slate-900/50 hover:border-slate-600 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-2">{kpi.title}</p>
                  <p className={`text-3xl font-bold ${kpi.textColor}`}>
                    {kpi.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${kpi.color}`}>
                  <Icon className={`w-6 h-6 ${kpi.textColor}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Activity Feed and News */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-6">
            <h2 className="text-xl font-bold text-white mb-6">Activity Feed</h2>
            <div className="space-y-6">
              {feedItems.map((item) => (
                <div
                  key={item.id}
                  className="pb-6 border-b border-slate-700 last:border-0 last:pb-0"
                >
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-blue-400 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-sm">
                        {item.avatar}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-white">{item.author}</p>
                        <p className="text-xs text-slate-500">{item.timestamp}</p>
                      </div>
                      <p className="text-slate-300 mt-2">{item.content}</p>
                      <div className="mt-3 flex gap-4 text-sm text-slate-500">
                        <button className="hover:text-emerald-400 transition">
                          Like ({item.likes})
                        </button>
                        <button className="hover:text-blue-400 transition">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* News Headlines */}
        <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-6">
          <h2 className="text-xl font-bold text-white mb-6">News Headlines</h2>
          <div className="space-y-4">
            {news.map((item) => (
              <div
                key={item.id}
                className="pb-4 border-b border-slate-700 last:border-0 last:pb-0"
              >
                <p className="text-sm font-semibold text-white hover:text-emerald-400 cursor-pointer transition">
                  {item.title}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-slate-500">{item.source}</p>
                  <span className="px-2 py-1 rounded text-xs bg-slate-800 text-slate-400">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">{item.timestamp}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* EMET Status Card */}
      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-emerald-400 mb-2">
              EMET Status
            </h3>
            <div className="space-y-1 text-sm text-slate-300">
              <p>
                <span className="text-emerald-400 font-semibold">Status:</span> Online
              </p>
              <p>
                <span className="text-emerald-400 font-semibold">Last post:</span> 2 hours ago
              </p>
              <p>
                <span className="text-emerald-400 font-semibold">Content queue:</span> 5 items
              </p>
            </div>
          </div>
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
