import { Scale, ShieldCheck } from 'lucide-react'

export default function LegalPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-8">
        <div className="flex items-start gap-4">
          <Scale className="w-8 h-8 text-blue-400 flex-shrink-0" />
          <div>
            <h1 className="text-3xl font-bold text-white mb-3">Source-Verified Legal Library</h1>
            <p className="text-slate-300 leading-relaxed">
              The public beta does not ship hard-coded legal summaries as authoritative law. Legal materials will appear only after EMET can preserve the official source, jurisdiction, effective date, section reference, and citation trail.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-10 text-center">
        <ShieldCheck className="w-12 h-12 text-slate-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Legal search is security-gated</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          No legal result will be presented as current or authoritative until the ingestion and retrieval layer can trace it to an official or otherwise reliable source. EMET is not a substitute for a qualified attorney.
        </p>
      </div>
    </div>
  )
}
