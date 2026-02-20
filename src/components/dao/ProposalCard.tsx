'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface Proposal {
  id: string;
  title: string;
  description: string;
  status: 'ACTIVE' | 'VOTING' | 'PASSED' | 'FAILED';
  creator: string;
  yesVotes: number;
  noVotes: number;
  totalVotes: number;
  votingEndsAt?: Date;
  createdAt: Date;
}

interface ProposalCardProps {
  proposal: Proposal;
  onVote?: (proposalId: string, vote: 'yes' | 'no') => void;
}

const statusConfig = {
  ACTIVE: { bg: 'bg-primary/20', text: 'text-primary', label: 'Active' },
  VOTING: { bg: 'bg-success/20', text: 'text-success', label: 'Voting' },
  PASSED: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Passed' },
  FAILED: { bg: 'bg-destructive/20', text: 'text-destructive', label: 'Failed' },
};

export function ProposalCard({ proposal, onVote }: ProposalCardProps) {
  const config = statusConfig[proposal.status];
  const yesPercentage = proposal.totalVotes > 0 ? (proposal.yesVotes / proposal.totalVotes) * 100 : 0;
  const noPercentage = proposal.totalVotes > 0 ? (proposal.noVotes / proposal.totalVotes) * 100 : 0;

  const truncateAddress = (address: string) => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimeRemaining = (date?: Date) => {
    if (!date) return null;
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    if (diff < 0) return 'Voting ended';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  return (
    <div className={cn(
      'rounded-lg border bg-gray-900/40 border-primary/10',
      'p-5 transition-all duration-300 hover:border-primary/30 hover:bg-gray-900/60',
      'cursor-pointer'
    )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-base line-clamp-1">
            {proposal.title}
          </h3>
          <p className="text-sm text-gray-400 mt-1 line-clamp-2">
            {proposal.description}
          </p>
        </div>
        <span className={cn(
          'px-3 py-1 rounded text-xs font-semibold whitespace-nowrap',
          config.bg,
          config.text
        )}>
          {config.label}
        </span>
      </div>

      {/* Vote Progress Bar */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 h-6 rounded-full bg-gray-800/50 border border-primary/10 overflow-hidden">
          {/* Yes votes (green) */}
          <div
            className="h-full bg-success transition-all duration-500 flex items-center justify-center"
            style={{ width: `${yesPercentage}%` }}
          >
            {yesPercentage > 20 && (
              <span className="text-xs font-bold text-white">
                {Math.round(yesPercentage)}%
              </span>
            )}
          </div>

          {/* No votes (red) */}
          <div
            className="h-full bg-destructive transition-all duration-500 flex items-center justify-center"
            style={{ width: `${noPercentage}%` }}
          >
            {noPercentage > 20 && (
              <span className="text-xs font-bold text-white">
                {Math.round(noPercentage)}%
              </span>
            )}
          </div>
        </div>

        {/* Vote Counts */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="text-success font-medium">
            Yes: {proposal.yesVotes}
          </span>
          <span className="font-mono text-gray-500">
            {proposal.totalVotes} votes
          </span>
          <span className="text-destructive font-medium">
            No: {proposal.noVotes}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-primary/10">
        <span>by {truncateAddress(proposal.creator)}</span>
        {proposal.votingEndsAt && (
          <span className={cn(
            'font-medium',
            proposal.status === 'VOTING' ? 'text-warning' : ''
          )}>
            {formatTimeRemaining(proposal.votingEndsAt)}
          </span>
        )}
      </div>
    </div>
  );
}
