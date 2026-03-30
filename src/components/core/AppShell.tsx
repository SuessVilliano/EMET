'use client'

import React, { useState } from 'react'
import { Sidebar } from './Sidebar'
import { TopNav } from './TopNav'
import { cn } from '@/lib/utils'

interface AppShellProps {
  children: React.ReactNode
  currentPath: string
  walletAddress: string
  onDisconnect: () => void
  pageTitle: string
  pageSubtitle?: string
  notificationCount?: number
}

export function AppShell({
  children,
  currentPath,
  walletAddress,
  onDisconnect,
  pageTitle,
  pageSubtitle,
  notificationCount = 0,
}: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      <Sidebar
        currentPath={currentPath}
        walletAddress={walletAddress}
        onDisconnect={onDisconnect}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <TopNav
        title={pageTitle}
        subtitle={pageSubtitle}
        notificationCount={notificationCount}
        walletAddress={walletAddress}
        onMenuToggle={() => setMobileOpen(!mobileOpen)}
        onDisconnect={onDisconnect}
      />

      <main className={cn(
        'pt-16 min-h-screen transition-all duration-300',
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'
      )}>
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  )
}
