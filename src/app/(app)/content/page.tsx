import { FileCheck2, ShieldCheck } from 'lucide-react'

export default function ContentPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-8">
        <div className="flex items-start gap-4">
          <FileCheck2 className="w-8 h-8 text-purple-400 flex-shrink-0" />
          <div>
            <h1 className="text-3xl font-bold text-white mb-3">Content Engine</h1>
            <p className="text-slate-300 leading-relaxed">
              Autonomous publishing is disabled in the public beta. EMET will not display invented queues, fake publishing history, or an autonomy control that is not enforced by the backend.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-10 text-center">
        <ShieldCheck className="w-12 h-12 text-slate-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Human approval required before launch</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Publishing will open only after drafts are connected to real source evidence, approvals are persisted, external platform credentials are secured, and every publication action has an audit trail and rollback path.
        </p>
      </div>
    </div>
  )
}
