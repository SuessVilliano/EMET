'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Copy, LogOut, Moon, Sun, Check } from 'lucide-react'
import { useAuth } from '@/context/AuthProvider'
import { useTheme } from '@/context/ThemeProvider'

export default function SettingsPage() {
  const { walletAddress, disconnect } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [notifications, setNotifications] = useState({
    proposals: true,
    news: true,
    community: false,
    alerts: true,
  })

  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDisconnect = () => {
    disconnect()
    router.push('/')
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-3xl space-y-8">
      {/* Wallet Info */}
      <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Wallet</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Wallet Address
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={walletAddress || 'Not Connected'}
                readOnly
                className="flex-1 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-mono text-sm"
              />
              <button
                onClick={handleCopyAddress}
                className="px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-300 transition"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Connection Status
            </label>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-white font-semibold">Connected</span>
              <span className="text-slate-500">Solana Devnet</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleDisconnect}
          className="mt-6 px-6 py-3 rounded-lg border border-slate-700 bg-slate-900/50 text-slate-300 hover:border-red-500/50 hover:text-red-400 transition font-semibold flex items-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Disconnect Wallet
        </button>
      </div>

      {/* Profile Settings */}
      <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Profile</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter a display name"
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Email (Optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="For notifications only"
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
            <p className="text-xs text-slate-500 mt-2">
              Your email is never shared or stored on-chain
            </p>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Notifications</h2>

        <div className="space-y-4">
          {[
            { key: 'proposals', label: 'Proposal Updates', description: 'Get notified when new DAO proposals are created' },
            { key: 'news', label: 'News Alerts', description: 'Receive critical news and threat level updates' },
            { key: 'community', label: 'Community Messages', description: 'Notifications from channels you follow' },
            { key: 'alerts', label: 'Security Alerts', description: 'Important system and security notifications' },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 rounded-lg border border-slate-700 bg-slate-800/30"
            >
              <div>
                <p className="font-semibold text-white">{item.label}</p>
                <p className="text-sm text-slate-400">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[item.key as keyof typeof notifications]}
                  onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500/30"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Theme */}
      <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Appearance</h2>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => { if (theme !== 'dark') toggleTheme() }}
            className={`p-6 rounded-lg border-2 transition ${
              theme === 'dark'
                ? 'border-emerald-500 bg-emerald-500/10'
                : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
            }`}
          >
            <Moon className="w-6 h-6 mx-auto mb-3 text-slate-400" />
            <p className="font-semibold text-white">Dark Mode</p>
          </button>

          <button
            onClick={() => { if (theme !== 'light') toggleTheme() }}
            className={`p-6 rounded-lg border-2 transition ${
              theme === 'light'
                ? 'border-emerald-500 bg-emerald-500/10'
                : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
            }`}
          >
            <Sun className="w-6 h-6 mx-auto mb-3 text-amber-400" />
            <p className="font-semibold text-white">Light Mode</p>
          </button>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-8 py-3 rounded-lg bg-emerald-500/20 border border-emerald-500 text-emerald-400 hover:bg-emerald-500/30 transition font-bold"
        >
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
