'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Copy, LogOut, Moon, Sun, Check, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/context/AuthProvider'
import { useTheme } from '@/context/ThemeProvider'

export default function SettingsPage() {
  const { walletAddress, disconnect } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()
  const [copied, setCopied] = useState(false)

  const handleCopyAddress = async () => {
    if (!walletAddress) return
    await navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  const handleDisconnect = () => {
    disconnect()
    router.push('/')
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Wallet</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Wallet Address</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={walletAddress || 'Not Connected'}
                readOnly
                className="flex-1 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-mono text-sm"
              />
              <button
                onClick={handleCopyAddress}
                disabled={!walletAddress}
                className="px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-300 transition disabled:opacity-50"
                aria-label="Copy wallet address"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Connection Status</label>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${walletAddress ? 'bg-emerald-400' : 'bg-slate-600'}`} />
              <span className="text-white font-semibold">{walletAddress ? 'Connected' : 'Not connected'}</span>
              <span className="text-slate-500">Solana Devnet</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleDisconnect}
          disabled={!walletAddress}
          className="mt-6 px-6 py-3 rounded-lg border border-slate-700 bg-slate-900/50 text-slate-300 hover:border-red-500/50 hover:text-red-400 transition font-semibold flex items-center gap-2 disabled:opacity-50"
        >
          <LogOut className="w-5 h-5" />
          Disconnect Wallet
        </button>
      </div>

      <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Appearance</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => { if (theme !== 'dark') toggleTheme() }}
            className={`p-6 rounded-lg border-2 transition ${theme === 'dark' ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'}`}
          >
            <Moon className="w-6 h-6 mx-auto mb-3 text-slate-400" />
            <p className="font-semibold text-white">Dark Mode</p>
          </button>
          <button
            onClick={() => { if (theme !== 'light') toggleTheme() }}
            className={`p-6 rounded-lg border-2 transition ${theme === 'light' ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'}`}
          >
            <Sun className="w-6 h-6 mx-auto mb-3 text-amber-400" />
            <p className="font-semibold text-white">Light Mode</p>
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-4">Appearance is stored only in this browser.</p>
      </div>

      <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-6 flex gap-4">
        <ShieldCheck className="w-6 h-6 text-blue-400 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-white mb-1">Profile and notification settings are disabled in beta</h3>
          <p className="text-sm text-slate-400">EMET will not show a successful save until profile persistence, consent, notification delivery, and deletion controls are backed by the production database.</p>
        </div>
      </div>
    </div>
  )
}
