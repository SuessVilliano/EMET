'use client';

import React from 'react';
import { AlertTriangle, AlertCircle, AlertOctagon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewsAlert {
  id: string;
  title: string;
  description: string;
  category: string;
  threatLevel: 'critical' | 'high' | 'medium' | 'low';
  timestamp: Date;
}

interface NewsHeadlinesProps {
  alerts: NewsAlert[];
}

const threatConfig = {
  critical: {
    bg: 'bg-destructive/20',
    text: 'text-destructive',
    icon: AlertTriangle,
    label: 'CRITICAL',
    pulse: 'animate-pulse',
  },
  high: {
    bg: 'bg-warning/20',
    text: 'text-warning',
    icon: AlertCircle,
    label: 'HIGH',
    pulse: '',
  },
  medium: {
    bg: 'bg-yellow-500/20',
    text: 'text-yellow-400',
    icon: AlertOctagon,
    label: 'MEDIUM',
    pulse: '',
  },
  low: {
    bg: 'bg-gray-500/20',
    text: 'text-gray-400',
    icon: AlertCircle,
    label: 'LOW',
    pulse: '',
  },
};

export function NewsHeadlines({ alerts }: NewsHeadlinesProps) {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / 3600000);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-3">
      {alerts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 text-sm">No alerts at this time</p>
        </div>
      ) : (
        alerts.slice(0, 5).map((alert) => {
          const config = threatConfig[alert.threatLevel];
          const Icon = config.icon;

          return (
            <div
              key={alert.id}
              className={cn(
                'p-3 rounded-lg border transition-all duration-300',
                'bg-gray-900/40 border-primary/10 hover:border-primary/20',
                'hover:bg-gray-900/60 cursor-pointer'
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  'flex-shrink-0 mt-1',
                  config.pulse
                )}>
                  <Icon className={cn('w-4 h-4', config.text)} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-white truncate">
                      {alert.title}
                    </h4>
                    <span className={cn(
                      'px-1.5 py-0.5 rounded text-xs font-bold whitespace-nowrap',
                      config.bg,
                      config.text
                    )}>
                      {config.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 truncate">
                    {alert.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
                    <span>{alert.category}</span>
                    <span>•</span>
                    <span>{formatDate(alert.timestamp)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
