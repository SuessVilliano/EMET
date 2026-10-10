import { ShieldCheck, Radio } from 'lucide-react'

export default function NewsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-8">
        <div className="flex items-start gap-4">
          <ShieldCheck className="w-8 h-8 text-emerald-400 flex-shrink-0" />
          <div>
            <h1 className="text-3xl font-bold text-white mb-3">Source-Verified Alerts</h1>
            <p className="text-slate-300 leading-relaxed">
              EMET will not publish synthetic headlines as live news. This feed stays empty until the production ingestion pipeline can attach every alert to a retrievable source record, timestamp, and provenance trail.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-10 text-center">
        <Radio className="w-12 h-12 text-slate-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Live alert ingestion is not enabled yet</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Public beta policy: no alert appears here unless EMET can show where it came from and when it was retrieved. Official and properly licensed source connectors are being added through the intelligence backbone.
        </p>
      </div>
    </div>
  )
}
