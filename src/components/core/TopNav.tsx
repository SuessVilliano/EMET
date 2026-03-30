'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Bell, Search, Menu, Settings, LogOut, User, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from './ThemeToggle'

interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'New Proposal', message: 'DAO Proposal #42 is now open for voting', time: '5m ago', read: false },
  { id: '2', title: 'Marketplace', message: 'New AWG product listed: AquaPure 3000', time: '1h ago', read: false },
  { id: '3', title: 'Community', message: 'You were mentioned in #water-sovereignty', time: '3h ago', read: true },
  { id: '4', title: 'Kill Switch', message: 'Kill switch vote initiated — review required', time: '6h ago', read: false },
]

interface TopNavProps {
  title: string
  subtitle?: string
  notificationCount?: number
  walletAddress?: string
  onMenuToggle: () => void
  onDisconnect: () => void
}

export function TopNav({ title, subtitle, notificationCount = 0, walletAddress, onMenuToggle, onDisconnect }: TopNavProps) {
  const [notifOpen, setNotifOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const notifRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.read).length

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const truncateAddress = (address: string) => {
    if (!address || address.length <= 10) return address || ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <header
      className="fixed top-0 right-0 left-0 lg:left-60 h-16 bg-[#0a0f1a]/80 backdrop-blur-md border-b border-primary/10 z-40"
      role="banner"
    >
      <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">
        {/* Left: Hamburger + Title */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg hover:bg-primary/10 transition-colors lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-primary" />
          </button>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-white truncate">{title}</h1>
            {subtitle && <p className="text-sm text-gray-400 truncate">{subtitle}</p>}
          </div>
        </div>

        {/* Center: Search */}
        <div className="hidden md:flex flex-1 max-w-sm">
          <div className="w-full relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-primary/5 border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
              aria-label="Search"
            />
          </div>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => { setNotifOpen(!notifOpen); setUserMenuOpen(false) }}
              className="relative p-2 rounded-lg hover:bg-primary/10 transition-colors group"
              aria-label={`${unreadCount} notifications`}
            >
              <Bell className="w-5 h-5 text-primary/70 group-hover:text-primary transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-destructive rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {notifOpen && (
              <div className="absolute right-0 top-12 w-80 bg-[#0f1629] border border-primary/20 rounded-xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-primary/10">
                  <span className="text-sm font-semibold text-white">Notifications</span>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs text-primary hover:text-primary/80 transition-colors">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">No notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        className={cn(
                          'px-4 py-3 border-b border-primary/5 hover:bg-primary/5 transition-colors cursor-pointer',
                          !n.read && 'bg-primary/5'
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              {!n.read && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                              <span className="text-sm font-medium text-white">{n.title}</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">{n.message}</p>
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">{n.time}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="px-4 py-2 border-t border-primary/10">
                  <Link
                    href="/settings"
                    className="text-xs text-primary hover:text-primary/80 transition-colors"
                    onClick={() => setNotifOpen(false)}
                  >
                    Notification settings
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Menu */}
          <div ref={userRef} className="relative">
            <button
              onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifOpen(false) }}
              className="w-8 h-8 rounded-full bg-primary/20 hover:bg-primary/30 flex items-center justify-center transition-colors"
              aria-label="User menu"
            >
              <span className="text-xs font-bold text-primary">U</span>
            </button>

            {/* User Dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 top-12 w-56 bg-[#0f1629] border border-primary/20 rounded-xl shadow-2xl overflow-hidden">
                {walletAddress && (
                  <div className="px-4 py-3 border-b border-primary/10">
                    <p className="text-xs text-gray-500">Connected Wallet</p>
                    <p className="text-sm text-primary font-mono mt-0.5">{truncateAddress(walletAddress)}</p>
                  </div>
                )}
                <div className="py-1">
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary/5 transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4 text-primary/60" />
                    <span className="text-sm text-gray-300">Settings</span>
                  </Link>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary/5 transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <User className="w-4 h-4 text-primary/60" />
                    <span className="text-sm text-gray-300">Profile</span>
                  </Link>
                  <button
                    onClick={() => { setUserMenuOpen(false); onDisconnect() }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-destructive/60" />
                    <span className="text-sm text-destructive">Disconnect</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
