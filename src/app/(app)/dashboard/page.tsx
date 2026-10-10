import { Database, ShieldCheck, Brain, Users } from 'lucide-react'

const capabilities = [
  {
    title: 'Evidence Backbone',
    description: 'Provenance-first ingestion for official or properly licensed sources.',
    icon: Database,
    status: 'In QA',
  },
  {
    title: 'AI Chat',
    description: 'Multi-model conversation with explicit uncertainty and verification guidance.',
    icon: Brain,
    status: 'Beta',
  },
  {
    title: 'Governance',
    description: 'Architecture exists; production voting and execution remain security-gated.',
    icon: Users,
    status: 'Restricted',
  },
  {
    title: 'Security',
    description: 'Protected intelligence APIs, RLS migration, CI quality gates, and release review.',
    icon: ShieldCheck,
    status: 'In QA',
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-8">
        <h1 className="text-3xl font-bold text-white mb-3">EMET Public Beta</h1>
        <p className="text-slate-300 max-w-3xl leading-relaxed">
          This dashboard reports product readiness, not invented user counts, fake activity, or synthetic news. Features remain restricted until their real data path and security controls are verified.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {capabilities.map(({ title, description, icon: Icon, status }) => (
          <div key={title} className="rounded-xl border border-slate-700 bg-slate-900/50 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="p-3 rounded-lg bg-slate-800"><Icon className="w-6 h-6 text-emerald-400" /></div>
                <div>
                  <h2 className="text-lg font-semibold text-white mb-2">{title}</h2>
                  <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full border border-slate-600 text-xs text-slate-300 whitespace-nowrap">{status}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-6">
        <h2 className="text-xl font-bold text-white mb-3">Release principle</h2>
        <p className="text-slate-400">
          If EMET cannot prove a state from a real backend or source record, the public beta labels it unavailable instead of simulating success.
        </p>
      </div>
    </div>
  )
}
