'use client'

import { AlertTriangle } from 'lucide-react'
import { KILL_SWITCH_CONFIG } from '@/lib/blockchain/kill-switch'

export default function KillSwitchPage() {
  return (
    <div className="space-y-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Kill Switch</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          The community&apos;s ultimate safeguard. The protocol is designed so a qualified community vote can disable EMET if governance determines the system has departed from its mission.
        </p>
      </div>

      <div className="flex justify-center mb-12">
        <div className="w-full max-w-md">
          <div className="relative w-full aspect-square">
            <svg viewBox="0 0 200 200" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }} aria-hidden="true">
              <circle cx="100" cy="100" r="90" fill="none" stroke="#334155" strokeWidth="8" />
              <path d="M 100 10 A 90 90 0 0 1 190 100" fill="none" stroke="#ef4444" strokeWidth="8" />
              <circle cx="100" cy="100" r="70" fill="#0f172a" stroke="#334155" strokeWidth="2" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="absolute w-2 h-24 bg-emerald-400 rounded-full origin-bottom"
                style={{ transform: 'rotate(-45deg)', top: '50%', left: '50%', marginLeft: '-4px' }}
              />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-sm text-slate-500 font-mono mb-1">STATUS</p>
              <p className="text-2xl font-bold text-emerald-400">INACTIVE</p>
            </div>
          </div>
          <div className="flex justify-between mt-6 px-4 text-xs font-mono text-slate-500">
            <span>INACTIVE</span>
            <span>TRIGGERED</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-8">
          <h2 className="text-2xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-slate-300 mb-4">
            The kill-switch protocol requires governance participation, a {KILL_SWITCH_CONFIG.thresholdPercent}% approval threshold, wallet signatures, and a {KILL_SWITCH_CONFIG.countdownHours}-hour countdown before shutdown.
          </p>
          <p className="text-slate-300 mb-4">
            The current public beta exposes the governance model and status, but vote initiation is disabled until the production on-chain execution and authorization path has completed security review.
          </p>
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 mt-4">
            <p className="text-white font-semibold mb-2 flex items-center gap-2">
              <span className="text-amber-400"><AlertTriangle className="w-5 h-5" /></span>
              Governance safeguard
            </p>
            <p className="text-slate-400 text-sm">
              A displayed vote or UI interaction is never treated as an executed shutdown without the required signed governance path.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-6">
            <p className="text-sm font-mono text-slate-500 mb-2">REQUIREMENT 1</p>
            <p className="text-white font-semibold">Participation</p>
            <p className="text-slate-400 text-sm mt-2">Minimum participation is enforced by the governance vote calculation.</p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-6">
            <p className="text-sm font-mono text-slate-500 mb-2">REQUIREMENT 2</p>
            <p className="text-white font-semibold">Supermajority</p>
            <p className="text-slate-400 text-sm mt-2">{KILL_SWITCH_CONFIG.thresholdPercent}% YES approval is required.</p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-6">
            <p className="text-sm font-mono text-slate-500 mb-2">REQUIREMENT 3</p>
            <p className="text-white font-semibold">Signed finality</p>
            <p className="text-slate-400 text-sm mt-2">Wallet signature and the execution path are required.</p>
          </div>
        </div>

        <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-8">
          <h3 className="text-xl font-bold text-white mb-6">Vote History</h3>
          <div className="text-center py-12">
            <p className="text-slate-400">No production kill-switch vote history is available in this beta.</p>
          </div>
        </div>

        <div className="text-center pt-8">
          <button disabled className="px-8 py-4 rounded-lg bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed font-bold text-lg">
            Governance activation pending security review
          </button>
          <p className="text-slate-500 text-sm mt-4">The control will remain disabled until signed execution is production-verified.</p>
        </div>
      </div>
    </div>
  )
}
