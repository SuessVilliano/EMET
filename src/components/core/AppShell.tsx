'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: React.ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
  walletAddress: string;
  onDisconnect: () => void;
  pageTitle: string;
  pageSubtitle?: string;
  notificationCount?: number;
}

export function AppShell({
  children,
  currentPath,
  onNavigate,
  walletAddress,
  onDisconnect,
  pageTitle,
  pageSubtitle,
  notificationCount = 0,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      {/* Sidebar */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={(path) => {
          onNavigate(path);
          setSidebarOpen(false);
        }}
        walletAddress={walletAddress}
        onDisconnect={onDisconnect}
      />

      {/* Top Navigation */}
      <TopNav
        title={pageTitle}
        subtitle={pageSubtitle}
        notificationCount={notificationCount}
      />

      {/* Main Content */}
      <main
        className={cn(
          'pt-16 min-h-screen transition-all duration-300',
          'lg:ml-60'
        )}
      >
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>

      {/* Mobile overlay when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
