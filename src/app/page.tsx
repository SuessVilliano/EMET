import { Hero } from '@/components/landing/Hero'
import { FeatureCards } from '@/components/landing/FeatureCards'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <Hero />

      {/* Feature Cards Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">
          Why EMET Matters
        </h2>
        <FeatureCards />
      </section>

      {/* Stats Bar */}
      <section className="py-12 px-4 border-y border-slate-700/50">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-12 text-center">
          <div>
            <p className="text-3xl font-bold text-emerald-400">1,247</p>
            <p className="text-slate-400 mt-1">Members</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-400">89</p>
            <p className="text-slate-400 mt-1">Proposals</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-amber-400">2,456</p>
            <p className="text-slate-400 mt-1">Posts</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-purple-400">156</p>
            <p className="text-slate-400 mt-1">Products</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16 text-white">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-lg border border-slate-700 bg-slate-900/50 hover:border-emerald-500/50 transition">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
              <span className="text-2xl font-bold text-emerald-400">1</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Connect Wallet</h3>
            <p className="text-slate-400">
              Connect your Web3 wallet to join the EMET community. Your wallet is your identity and your voice.
            </p>
          </div>

          <div className="p-8 rounded-lg border border-slate-700 bg-slate-900/50 hover:border-blue-500/50 transition">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-6">
              <span className="text-2xl font-bold text-blue-400">2</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Explore Resources</h3>
            <p className="text-slate-400">
              Browse and discover real-world solutions: water systems, solar tech, food security, and legal tools.
            </p>
          </div>

          <div className="p-8 rounded-lg border border-slate-700 bg-slate-900/50 hover:border-purple-500/50 transition">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-6">
              <span className="text-2xl font-bold text-purple-400">3</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Join the DAO</h3>
            <p className="text-slate-400">
              Vote on proposals, govern the AI, and shape the future of decentralized resilience together.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-slate-700/50 bg-slate-950/50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-400">
            EMET — Built by the people, for the people. Truth protects.
          </p>
        </div>
      </footer>
    </div>
  )
}
