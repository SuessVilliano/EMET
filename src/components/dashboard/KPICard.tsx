'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'orange' | 'red';
}

const colorConfig = {
  blue: {
    bg: 'bg-blue-500/20',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
  },
  green: {
    bg: 'bg-success/20',
    text: 'text-success',
    border: 'border-success/20',
  },
  orange: {
    bg: 'bg-warning/20',
    text: 'text-warning',
    border: 'border-warning/20',
  },
  red: {
    bg: 'bg-destructive/20',
    text: 'text-destructive',
    border: 'border-destructive/20',
  },
};

export function KPICard({
  title,
  value,
  change,
  icon,
  color = 'blue',
}: KPICardProps) {
  const colors = colorConfig[color];
  const isPositive = change?.startsWith('+');

  return (
    <div
      className={cn(
        'rounded-lg border backdrop-blur-sm p-6',
        'bg-gray-900/40 border-primary/10',
        'hover:border-primary/20 transition-all duration-300'
      )}
    >
      <div className="flex items-start justify-between">
        {/* Icon */}
        <div
          className={cn(
            'w-12 h-12 rounded-lg flex items-center justify-center',
            colors.bg
          )}
        >
          <div className={colors.text}>{icon}</div>
        </div>

        {/* Change badge */}
        {change && (
          <div className={cn(
            'flex items-center gap-1 text-xs font-semibold',
            isPositive ? 'text-success' : 'text-destructive'
          )}>
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {change}
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mt-4">
        <p className="text-3xl font-mono font-bold text-white">
          {value}
        </p>
        <p className="text-sm text-gray-400 mt-1">{title}</p>
      </div>
    </div>
  );
}
