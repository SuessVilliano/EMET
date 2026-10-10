import { Vote, ShieldCheck } from 'lucide-react'

export default function DAOPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-8">
        <div className="flex items-start gap-4">
          <Vote className="w-8 h-8 text-emerald-400 flex-shrink-0" />
          <div>
            <h1 className="text-3xl font-bold text-white mb-3">DAO Governance</h1>
            <p className="text-slate-300 leading-relaxed">
              Governance remains visible as part of EMET&apos;s design, but creating proposals and casting production votes are disabled until wallet authentication, signature verification, vote persistence, quorum calculation, and execution controls complete security review.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-10 text-center">
        <ShieldCheck className="w-12 h-12 text-slate-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">No demo votes are shown as real governance</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          The public beta will not display hard-coded proposals, vote counts, outcomes, or participation figures. Production governance data must be signed and auditable.
        </p>
      </div>
    </div>
  )
}
