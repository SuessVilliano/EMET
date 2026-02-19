'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  type: 'vote' | 'content' | 'alert' | 'kill_switch';
  title: string;
  description: string;
  timestamp: Date;
  actor: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

const typeConfig = {
  vote: { bg: 'bg-primary/20', text: 'text-primary', label: 'Vote' },
  content: { bg: 'bg-success/20', text: 'text-success', label: 'Content' },
  alert: { bg: 'bg-warning/20', text: 'text-warning', label: 'Alert' },
  kill_switch: { bg: 'bg-destructive/20', text: 'text-destructive', label: 'Kill Switch' },
};

const formatDistanceToNow = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="space-y-4">
      {activities.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">No recent activity</p>
        </div>
      ) : (
        activities.map((activity, index) => {
          const config = typeConfig[activity.type];
          return (
            <div key={activity.id} className="flex gap-4">
              {/* Timeline */}
              <div className="flex flex-col items-center">
                <div className={cn(
                  'w-4 h-4 rounded-full border-2 border-primary/50',
                  config.bg
                )} />
                {index < activities.length - 1 && (
                  <div className="w-0.5 h-12 bg-gradient-to-b from-primary/50 to-transparent my-1" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-white text-sm">
                        {activity.title}
                      </p>
                      <span className={cn(
                        'px-2 py-0.5 rounded text-xs font-medium',
                        config.bg,
                        config.text
                      )}>
                        {config.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {activity.actor} • {formatDistanceToNow(activity.timestamp)}
                    </p>
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
