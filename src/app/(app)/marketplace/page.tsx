import { ShoppingBag, BadgeCheck } from 'lucide-react'

export default function MarketplacePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-8">
        <div className="flex items-start gap-4">
          <ShoppingBag className="w-8 h-8 text-amber-400 flex-shrink-0" />
          <div>
            <h1 className="text-3xl font-bold text-white mb-3">Verified Marketplace</h1>
            <p className="text-slate-300 leading-relaxed">
              Product listings are unavailable in the public beta until price, specifications, seller identity, availability, outbound links, and commercial disclosures are sourced and refreshable.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-10 text-center">
        <BadgeCheck className="w-12 h-12 text-slate-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Unverified demo products have been removed</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          EMET will only display purchasable products after the listing can be traced to a real seller or manufacturer and its commercial data can be validated.
        </p>
      </div>
    </div>
  )
}
