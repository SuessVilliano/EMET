'use client';

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface ScoreGaugeProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export function ScoreGauge({ value, size = 'md', label }: ScoreGaugeProps) {
  const sizeConfig = {
    sm: { width: 120, height: 60, radius: 55, textSize: 'text-sm' },
    md: { width: 180, height: 90, radius: 85, textSize: 'text-lg' },
    lg: { width: 240, height: 120, radius: 115, textSize: 'text-2xl' },
  };

  const config = sizeConfig[size];

  // Determine color based on value
  const getColor = () => {
    if (value >= 75) return '#10b981'; // green
    if (value >= 50) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  // Calculate path for semi-circle progress
  const radius = config.radius;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  const color = getColor();

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        width={config.width}
        height={config.height}
        viewBox={`0 0 ${config.width} ${config.height}`}
        className="drop-shadow-lg"
      >
        {/* Background semi-circle */}
        <path
          d={`M 10 ${config.height} A ${radius} ${radius} 0 0 1 ${config.width - 10} ${config.height}`}
          fill="none"
          stroke="rgb(107, 114, 128)"
          strokeWidth="8"
          opacity="0.2"
        />

        {/* Progress semi-circle */}
        <path
          d={`M 10 ${config.height} A ${radius} ${radius} 0 0 1 ${config.width - 10} ${config.height}`}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000"
          opacity="0.9"
        />

        {/* Value text */}
        <text
          x={config.width / 2}
          y={config.height - 8}
          textAnchor="middle"
          className={cn('font-mono font-bold fill-white', config.textSize)}
        >
          {value}%
        </text>
      </svg>

      {label && (
        <p className="text-sm text-gray-400 font-medium">{label}</p>
      )}
    </div>
  );
}
