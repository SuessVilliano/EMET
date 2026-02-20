'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    // In a real app, you'd dispatch this to a context or localStorage
    if (typeof document !== 'undefined') {
      if (!isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative w-9 h-9 rounded-lg transition-all duration-300',
        'hover:bg-primary/10 bg-primary/5 border border-primary/20',
        'flex items-center justify-center'
      )}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Moon className="w-5 h-5 text-primary transition-all duration-300" />
      ) : (
        <Sun className="w-5 h-5 text-primary transition-all duration-300" />
      )}
    </button>
  );
}
