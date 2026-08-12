import { MessagesSquare, ShieldCheck } from 'lucide-react'

export default function CommunityPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-8">
        <div className="flex items-start gap-4">
          <MessagesSquare className="w-8 h-8 text-purple-400 flex-shrink-0" />
          <div>
            <h1 className="text-3xl font-bold text-white mb-3">Community</h1>
            <p className="text-slate-300 leading-relaxed">
              Community messaging is being held out of the public beta until persistent identity, moderation, abuse reporting, rate limits, and real message storage are production-ready.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-10 text-center">
        <ShieldCheck className="w-12 h-12 text-slate-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">No simulated members or conversations</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          When this opens, member counts and messages will come from authenticated platform data rather than demo identities or hard-coded activity.
        </p>
      </div>
    </div>
  )
}
