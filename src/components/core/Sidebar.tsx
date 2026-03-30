'use client'

import React from 'react'
import Link from 'next/link'
import {
  LayoutDashboard,
  MessageCircle,
  ShoppingBag,
  Users,
  Vote,
  Newspaper,
  Scale,
  FileText,
  Pen,
  Power,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  path: string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'chat', label: 'Chat with EMET', icon: MessageCircle, path: '/chat' },
  { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, path: '/marketplace' },
  { id: 'community', label: 'Community', icon: Users, path: '/community' },
  { id: 'dao', label: 'DAO Voting', icon: Vote, path: '/dao' },
  { id: 'news', label: 'News & Alerts', icon: Newspaper, path: '/news' },
  { id: 'legal', label: 'Legal Library', icon: Scale, path: '/legal' },
  { id: 'documents', label: 'Documents', icon: FileText, path: '/documents' },
  { id: 'content', label: 'Content Engine', icon: Pen, path: '/content' },
  { id: 'kill-switch', label: 'Kill Switch', icon: Power, path: '/kill-switch' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
]

interface SidebarProps {
  currentPath: string
  walletAddress: string
  onDisconnect: () => void
  collapsed: boolean
  onToggleCollapse: () => void
  mobileOpen: boolean
  onMobileClose: () => void
}

export function Sidebar({
  currentPath,
  walletAddress,
  onDisconnect,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const truncateAddress = (address: string) => {
    if (address.length <= 10) return address
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-[#0a0f1a] border-r border-primary/20 transition-all duration-300 ease-in-out flex flex-col z-50',
        // Mobile: hidden by default, slide in when mobileOpen
        'max-lg:-translate-x-full max-lg:w-60',
        mobileOpen && 'max-lg:translate-x-0',
        // Desktop: always visible, respects collapsed state
        'lg:relative lg:z-0 lg:translate-x-0',
        collapsed ? 'lg:w-16' : 'lg:w-60'
      )}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center justify-between p-4 border-b border-primary/20',
        collapsed ? 'lg:flex-col lg:gap-2' : ''
      )}>
        <Link href="/dashboard" className="flex items-center gap-2" onClick={onMobileClose}>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
            E
          </div>
          {(!collapsed || mobileOpen) && (
            <div className="flex flex-col lg:hidden xl:flex">
              <span className="font-bold text-white text-sm">EMET</span>
              <span className="text-xs text-primary">Truth Made Alive</span>
            </div>
          )}
          {!collapsed && (
            <div className="hidden lg:flex flex-col">
              <span className="font-bold text-white text-sm">EMET</span>
              <span className="text-xs text-primary">Truth Made Alive</span>
            </div>
          )}
        </Link>
        {/* Mobile close button */}
        <button
          onClick={onMobileClose}
          className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="w-4 h-4 text-primary" />
        </button>
        {/* Desktop collapse button */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:block p-1.5 rounded-lg hover:bg-primary/10 transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-primary" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-primary" />
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = currentPath === item.path
            const showLabel = !collapsed || mobileOpen

            return (
              <li key={item.id}>
                <Link
                  href={item.path}
                  onClick={onMobileClose}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                    'hover:bg-primary/10 relative group',
                    isActive
                      ? 'bg-primary/10 border-l-2 border-primary'
                      : 'border-l-2 border-transparent'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={cn(
                    'w-5 h-5 flex-shrink-0',
                    isActive ? 'text-primary' : 'text-primary/60 group-hover:text-primary'
                  )} />
                  {showLabel && (
                    <span className={cn(
                      'text-sm font-medium transition-colors',
                      isActive ? 'text-primary' : 'text-gray-400 group-hover:text-white'
                    )}>
                      {item.label}
                    </span>
                  )}
                  {collapsed && !mobileOpen && (
                    <div className="absolute left-16 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {item.label}
                    </div>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Wallet */}
      <div className={cn(
        'border-t border-primary/20 p-4 space-y-3',
        collapsed && !mobileOpen ? 'flex flex-col items-center' : ''
      )}>
        <div className={cn(
          'flex items-center gap-2',
          collapsed && !mobileOpen ? 'w-full justify-center' : ''
        )}>
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-primary">W</span>
          </div>
          {(!collapsed || mobileOpen) && (
            <span className="text-xs text-gray-400 font-mono">
              {truncateAddress(walletAddress)}
            </span>
          )}
        </div>
        <button
          onClick={onDisconnect}
          className={cn(
            'w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg',
            'bg-destructive/10 hover:bg-destructive/20 text-destructive text-sm font-medium transition-colors',
            collapsed && !mobileOpen ? 'p-2' : ''
          )}
          aria-label="Disconnect wallet"
        >
          <LogOut className="w-4 h-4" />
          {(!collapsed || mobileOpen) && <span>Disconnect</span>}
        </button>
      </div>
    </aside>
  )
}
