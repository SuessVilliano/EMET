'use client';

import React from 'react';
import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmetAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  speaking?: boolean;
}

const sizeConfig = {
  sm: { container: 'w-8 h-8', icon: 'w-4 h-4' },
  md: { container: 'w-10 h-10', icon: 'w-5 h-5' },
  lg: { container: 'w-12 h-12', icon: 'w-6 h-6' },
};

export function EmetAvatar({ size = 'md', speaking = false }: EmetAvatarProps) {
  const config = sizeConfig[size];

  return (
    <div
      className={cn(
        config.container,
        'rounded-full bg-gradient-to-br from-blue-500 to-primary flex items-center justify-center',
        'flex-shrink-0 relative',
        speaking && 'animate-pulse'
      )}
    >
      <Shield className={cn('text-white', config.icon)} />

      {speaking && (
        <div className={cn(
          'absolute inset-0 rounded-full border-2 border-blue-400 animate-ping',
          'opacity-75'
        )} />
      )}
    </div>
  );
}
