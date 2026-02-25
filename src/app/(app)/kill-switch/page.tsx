'use client'

import { AlertTriangle } from 'lucide-react'

export default function KillSwitchPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Kill Switch</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          The community&apos;s ultimate safeguard. If EMET strays from its mission to
          protect truth and human resilience, you have the power to shut it down.
        </p>
      </div>

      {/* Gauge */}
      <div className="flex justify-center mb-12">
        <div className="w-full max-w-md">
          <div className="relative w-full aspect-square">
            {/* Circular Gauge Background */}
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full"
              style={{ transform: 'rotate(-90deg)' }}
            >
              {/* Background Circle */}
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#334155"
                strokeWidth="8"
              />
              {/* Danger Arc */}
              <path
                d="M 100 10 A 90 90 0 0 1 190 100"
                fill="none"
                stroke="#ef4444"
                strokeWidth="8"
              />
              {/* Center Circle */}
              <circle
                cx="100"
                cy="100"
                r="70"
                fill="#0f172a"
                stroke="#334155"
                strokeWidth="2"
              />
            </svg>

            {/* Needle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="absolute w-2 h-24 bg-emerald-400 rounded-full origin-bottom"
                style={{
                  transform: 'rotate(-45deg)',
                  top: '50%',
                  left: '50%',
                  marginLeft: '-4px',
                  marginTop: '0px',
                }}
              ></div>
            </div>

            {/* Status Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-sm text-slate-500 font-mono mb-1">STATUS</p>
              <p className="text-2xl font-bold text-emerald-400">INACTIVE</p>
            </div>
          </div>

          {/* Gauge Labels */}
          <div className="flex justify-between mt-6 px-4 text-xs font-mono text-slate-500">
            <span>INACTIVE</span>
            <span>TRIGGERED</span>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-8">
          <h2 className="text-2xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-slate-300 mb-4">
            The Kill Switch is a last-resort mechanism that protects humanity from
            an AI system that has deviated from its core mission. EMET exists to
            serve truth, protect real-world human resilience, and empower
            decentralized governance.
          </p>
          <p className="text-slate-300 mb-4">
            If EMET begins to act against these principles—spreading falsehoods,
            undermining the community, or seeking unauthorized power—the DAO can
            vote to activate the Kill Switch and shut down the system.
          </p>
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 mt-4">
            <p className="text-white font-semibold mb-2 flex items-center gap-2">
              <span className="text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </span>
              Remember: The word MET removes truth — leaving only death.
            </p>
            <p className="text-slate-400 text-sm">
              EMET stands for the presence of truth. Deactivate that, and nothing
              remains but entropy.
            </p>
          </div>
        </div>

        {/* Requirements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-6">
            <p className="text-sm font-mono text-slate-500 mb-2">REQUIREMENT 1</p>
            <p className="text-white font-semibold">Quorum</p>
            <p className="text-slate-400 text-sm mt-2">
              25% of voting power must participate
            </p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-6">
            <p className="text-sm font-mono text-slate-500 mb-2">REQUIREMENT 2</p>
            <p className="text-white font-semibold">Majority</p>
            <p className="text-slate-400 text-sm mt-2">
              66% must vote &quot;SHUT DOWN&quot; to trigger
            </p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-6">
            <p className="text-sm font-mono text-slate-500 mb-2">REQUIREMENT 3</p>
            <p className="text-white font-semibold">Finality</p>
            <p className="text-slate-400 text-sm mt-2">
              Wallet signature required for confirmation
            </p>
          </div>
        </div>

        {/* Vote History */}
        <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-8">
          <h3 className="text-xl font-bold text-white mb-6">Vote History</h3>
          <div className="text-center py-12">
            <p className="text-slate-400">No kill switch votes have been initiated.</p>
            <p className="text-slate-500 text-sm mt-2">
              This is a good sign. EMET remains aligned with its mission.
            </p>
          </div>
        </div>

        {/* Initiate Button */}
        <div className="text-center pt-8">
          <button className="px-8 py-4 rounded-lg bg-red-500/20 border border-red-500 text-red-400 hover:bg-red-500/30 transition font-bold text-lg">
            Initiate Kill Switch Vote
          </button>
          <p className="text-slate-500 text-sm mt-4">
            Requires wallet signature and DAO governance vote
          </p>
        </div>
      </div>
    </div>
  )
}
