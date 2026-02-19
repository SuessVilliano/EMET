'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface VoteBreakdownProps {
  yesCount: number;
  noCount: number;
  abstainCount: number;
  threshold?: number;
  minParticipants?: number;
  totalVotes: number;
}

export function VoteBreakdown({
  yesCount,
  noCount,
  abstainCount,
  threshold = 75,
  minParticipants = 1000,
  totalVotes,
}: VoteBreakdownProps) {
  const total = yesCount + noCount + abstainCount;
  const yesPercentage = total > 0 ? (yesCount / total) * 100 : 0;
  const noPercentage = total > 0 ? (noCount / total) * 100 : 0;
  const abstainPercentage = total > 0 ? (abstainCount / total) * 100 : 0;

  const thresholdPercentage = (threshold / 100) * 100;
  const yesMetThreshold = yesPercentage >= threshold;

  return (
    <div className="space-y-4">
      {/* Main Bar */}
      <div className="space-y-2">
        <div className="relative h-12 rounded-lg bg-gray-800/50 border border-primary/10 overflow-hidden flex">
          {/* Yes votes (green) */}
          <div
            className="h-full bg-success transition-all duration-500 flex items-center justify-center"
            style={{ width: `${yesPercentage}%` }}
          >
            {yesPercentage > 10 && (
              <span className="text-sm font-bold text-white px-2 line-clamp-1">
                {Math.round(yesPercentage)}%
              </span>
            )}
          </div>

          {/* No votes (red) */}
          <div
            className="h-full bg-destructive transition-all duration-500 flex items-center justify-center"
            style={{ width: `${noPercentage}%` }}
          >
            {noPercentage > 10 && (
              <span className="text-sm font-bold text-white px-2 line-clamp-1">
                {Math.round(noPercentage)}%
              </span>
            )}
          </div>

          {/* Abstain votes (gray) */}
          <div
            className="h-full bg-gray-500/40 transition-all duration-500 flex items-center justify-center"
            style={{ width: `${abstainPercentage}%` }}
          >
            {abstainPercentage > 10 && (
              <span className="text-sm font-bold text-white px-2 line-clamp-1">
                {Math.round(abstainPercentage)}%
              </span>
            )}
          </div>

          {/* Threshold line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white/50 transition-all duration-500"
            style={{ left: `${thresholdPercentage}%` }}
            aria-hidden="true"
          />
        </div>

        {/* Threshold label */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>0%</span>
          <span className="font-semibold text-white">
            {threshold}% Threshold {yesMetThreshold ? '✓' : ''}
          </span>
          <span>100%</span>
        </div>
      </div>

      {/* Vote Counts */}
      <div className="grid grid-cols-3 gap-3">
        <div className={cn(
          'p-3 rounded-lg border transition-colors',
          yesMetThreshold
            ? 'bg-success/20 border-success/50'
            : 'bg-gray-900/40 border-primary/10'
        )}>
          <p className="text-xs text-gray-400 mb-1">Yes</p>
          <p className={cn(
            'font-mono font-bold text-lg',
            yesMetThreshold ? 'text-success' : 'text-white'
          )}>
            {yesCount}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {total > 0 ? Math.round(yesPercentage) : 0}%
          </p>
        </div>

        <div className="p-3 rounded-lg border bg-gray-900/40 border-primary/10">
          <p className="text-xs text-gray-400 mb-1">No</p>
          <p className="font-mono font-bold text-lg text-destructive">
            {noCount}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {total > 0 ? Math.round(noPercentage) : 0}%
          </p>
        </div>

        <div className="p-3 rounded-lg border bg-gray-900/40 border-primary/10">
          <p className="text-xs text-gray-400 mb-1">Abstain</p>
          <p className="font-mono font-bold text-lg text-gray-400">
            {abstainCount}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {total > 0 ? Math.round(abstainPercentage) : 0}%
          </p>
        </div>
      </div>

      {/* Participation Info */}
      <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">
            Minimum Participants Required
          </span>
          <div className="text-right">
            <p className="font-mono font-bold text-white">
              {totalVotes} / {minParticipants}
            </p>
            <p className={cn(
              'text-xs font-medium mt-1',
              totalVotes >= minParticipants ? 'text-success' : 'text-warning'
            )}>
              {totalVotes >= minParticipants ? 'Met' : 'Not met'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
