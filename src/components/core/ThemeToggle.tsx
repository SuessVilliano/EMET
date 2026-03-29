'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/context/ThemeProvider'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

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
  )
}
