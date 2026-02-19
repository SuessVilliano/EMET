'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthProvider'
import { Sidebar } from '@/components/core/Sidebar'
import { TopNav } from '@/components/core/TopNav'

const PAGE_TITLES: Record<string, { title: string; subtitle?: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Overview of your resilience network' },
  '/chat': { title: 'Chat with EMET', subtitle: 'Ask anything about water, energy, food, housing, or legal' },
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
  const { user, walletAddress, isConnected, disconnect } = useAuth()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const pageInfo = PAGE_TITLES[pathname] || { title: 'EMET' }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        currentPath={pathname}
        onNavigate={() => {}}
        walletAddress={walletAddress || 'Not Connected'}
        onDisconnect={disconnect}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav title={pageInfo.title} subtitle={pageInfo.subtitle} notificationCount={3} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
