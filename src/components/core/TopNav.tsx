'use client';

import React from 'react';
import { Bell, Search, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';

interface TopNavProps {
  title: string;
  subtitle?: string;
  notificationCount?: number;
}

export function TopNav({ title, subtitle, notificationCount = 0 }: TopNavProps) {
  return (
    <header
      className="fixed top-0 right-0 left-0 lg:left-60 h-16 bg-[#0a0f1a]/80 backdrop-blur-md border-b border-primary/10 z-40"
      role="banner"
    >
      <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">
        {/* Left: Breadcrumb/Title */}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-white truncate">{title}</h1>
          {subtitle && <p className="text-sm text-gray-400 truncate">{subtitle}</p>}
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
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button
            className="relative p-2 rounded-lg hover:bg-primary/10 transition-colors group"
            aria-label={`${notificationCount} notifications`}
          >
            <Bell className="w-5 h-5 text-primary/70 group-hover:text-primary transition-colors" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-destructive rounded-full flex items-center justify-center text-xs font-bold text-white">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Avatar */}
          <button
            className="w-8 h-8 rounded-full bg-primary/20 hover:bg-primary/30 flex items-center justify-center transition-colors"
            aria-label="User menu"
          >
            <span className="text-xs font-bold text-primary">U</span>
          </button>
        </div>
      </div>
    </header>
  );
}
