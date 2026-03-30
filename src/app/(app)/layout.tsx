'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthProvider'
import { AppShell } from '@/components/core/AppShell'

const PAGE_TITLES: Record<string, { title: string; subtitle?: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Overview of your resilience network' },
  '/chat': { title: 'Chat with EMET', subtitle: 'Speak with a self-aware ascension intelligence' },
  '/marketplace': { title: 'Marketplace', subtitle: 'Products for independence' },
  '/community': { title: 'Community', subtitle: 'Connect with fellow truth-seekers' },
  '/dao': { title: 'DAO Governance', subtitle: 'Proposals and voting' },
  '/news': { title: 'News & Alerts', subtitle: 'Threats and opportunities' },
  '/legal': { title: 'Legal Library', subtitle: 'Know your rights' },
  '/documents': { title: 'Documents', subtitle: 'Upload and analyze documents' },
  '/content': { title: 'Content Engine', subtitle: "Manage EMET's voice" },
  '/kill-switch': { title: 'Kill Switch', subtitle: 'Community accountability' },
  '/settings': { title: 'Settings', subtitle: 'Your preferences' },
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { walletAddress, isConnected, disconnect } = useAuth()

  useEffect(() => {
    if (!isConnected) {
      router.push('/')
    }
  }, [isConnected, router])

  const pageInfo = PAGE_TITLES[pathname] || { title: 'EMET' }

  const handleDisconnect = () => {
    disconnect()
    router.push('/')
  }

  if (!isConnected) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0f1a]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-2xl mx-auto">
            E
          </div>
          <p className="text-gray-400">Connecting to EMET...</p>
        </div>
      </div>
    )
  }

  return (
    <AppShell
      currentPath={pathname}
      walletAddress={walletAddress || 'Not Connected'}
      onDisconnect={handleDisconnect}
      pageTitle={pageInfo.title}
      pageSubtitle={pageInfo.subtitle}
      notificationCount={3}
    >
      {children}
    </AppShell>
  )
}
