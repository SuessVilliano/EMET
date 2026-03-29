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
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      <Sidebar
        currentPath={currentPath}
        walletAddress={walletAddress}
        onDisconnect={onDisconnect}
      />

      <TopNav
        title={pageTitle}
        subtitle={pageSubtitle}
        notificationCount={notificationCount}
      />

      <main className={cn('pt-16 min-h-screen transition-all duration-300', 'lg:ml-60')}>
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  )
}
