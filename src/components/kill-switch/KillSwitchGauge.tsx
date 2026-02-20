'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface KillSwitchGaugeProps {
  votePercentage: number;
  currentVotes: number;
  requiredVotes: number;
  status: 'inactive' | 'voting' | 'shutdown';
}

export function KillSwitchGauge({
  votePercentage,
  currentVotes,
  requiredVotes,
  status,
}: KillSwitchGaugeProps) {
  const sizeConfig = {
    width: 280,
    height: 280,
    radius: 120,
  };

  const config = sizeConfig;
  const threshold = 75;

  // Calculate SVG paths
  const circumference = Math.PI * config.radius;
  const offset = circumference - (votePercentage / 100) * circumference;

  // Color based on vote percentage
  const getColor = () => {
    if (votePercentage >= 50) return '#ef4444'; // red
    return '#10b981'; // green
  };

  const statusConfig = {
    inactive: {
      label: 'INACTIVE',
      color: 'text-success',
      pulseColor: '',
    },
    voting: {
      label: 'VOTING',
      color: 'text-warning',
      pulseColor: 'animate-pulse',
    },
    shutdown: {
      label: 'SHUTDOWN INITIATED',
      color: 'text-destructive',
      pulseColor: 'animate-pulse',
    },
  };

  const statusInfo = statusConfig[status];

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Circular Gauge */}
      <div className="relative">
        <svg
          width={config.width}
          height={config.height}
          viewBox={`0 0 ${config.width} ${config.height}`}
          className="drop-shadow-lg"
        >
          {/* Background circle */}
          <circle
            cx={config.width / 2}
            cy={config.height / 2}
            r={config.radius}
            fill="none"
            stroke="rgb(107, 114, 128)"
            strokeWidth="12"
            opacity="0.15"
          />

          {/* Progress circle */}
          <circle
            cx={config.width / 2}
            cy={config.height / 2}
            r={config.radius}
            fill="none"
            stroke={getColor()}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000"
            style={{ transform: 'rotate(-90deg)', transformOrigin: `${config.width / 2}px ${config.height / 2}px` }}
          />

          {/* Threshold line */}
          <circle
            cx={config.width / 2}
            cy={config.height / 2}
            r={config.radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="2"
            strokeDasharray={`${(threshold / 100) * circumference} ${circumference}`}
            style={{ transform: 'rotate(-90deg)', transformOrigin: `${config.width / 2}px ${config.height / 2}px` }}
          />

          {/* Center text */}
          <text
            x={config.width / 2}
            y={config.height / 2 - 20}
            textAnchor="middle"
            className="fill-white font-bold"
            style={{ fontSize: '48px', fontFamily: 'monospace' }}
          >
            {votePercentage}%
          </text>

          <text
            x={config.width / 2}
            y={config.height / 2 + 35}
            textAnchor="middle"
            className="fill-gray-400"
            style={{ fontSize: '12px' }}
          >
            Toward Activation
          </text>
        </svg>

        {/* Status badge - center */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" />
      </div>

      {/* Vote Count */}
      <div className="text-center">
        <p className="text-2xl font-mono font-bold text-white">
          {currentVotes} of {requiredVotes} votes needed
        </p>
        <p className="text-sm text-gray-400 mt-2">
          {requiredVotes - currentVotes} more votes to activate
        </p>
      </div>

      {/* Status */}
      <div className={cn(
        'px-6 py-3 rounded-lg border font-bold text-sm tracking-wider',
        status === 'inactive' && 'bg-success/20 border-success/50 text-success',
        status === 'voting' && 'bg-warning/20 border-warning/50 text-warning animate-pulse',
        status === 'shutdown' && 'bg-destructive/20 border-destructive/50 text-destructive animate-pulse'
      )}>
        {statusInfo.label}
      </div>

      {/* Threshold indicator */}
      <div className="text-center text-xs text-gray-400">
        <p>75% Threshold Required</p>
        <p className="mt-1">Current: {votePercentage}%</p>
      </div>
    </div>
  );
}
