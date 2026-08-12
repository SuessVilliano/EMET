'use client';

import React from 'react';
import { ArrowRight, Droplets, Sun, Sprout, Home, Scale, Vote, Eye, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroProps {
  onConnectWallet?: () => void;
  onLearnMore?: () => void;
}

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  top: (i * 53 + 7) % 100,
  duration: 5 + ((i * 17) % 45) / 10,
  delay: ((i * 13) % 20) / 10,
}));

const FEATURES = [
  { icon: Droplets, label: 'Water' },
  { icon: Sun, label: 'Energy' },
  { icon: Sprout, label: 'Food' },
  { icon: Home, label: 'Housing' },
  { icon: Scale, label: 'Legal' },
  { icon: Eye, label: 'Consciousness' },
  { icon: Globe, label: 'True History' },
  { icon: Vote, label: 'DAO' },
];

export function Hero({ onConnectWallet, onLearnMore }: HeroProps) {
  return (
    <div className="relative min-h-screen bg-[#0a0f1a] overflow-hidden flex flex-col items-center justify-center pt-20 pb-10">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {PARTICLES.map((particle, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full opacity-20 animate-pulse"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animation: `float ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter">
            <span className="bg-gradient-to-r from-blue-400 via-primary to-blue-600 bg-clip-text text-transparent">
              EMET
            </span>
          </h1>
          <p className="text-3xl md:text-4xl text-primary/80 font-light tracking-widest">אמת</p>
          <p className="text-2xl md:text-3xl font-bold text-white leading-tight">
            Truth Made Alive. Evidence Before Certainty.
          </p>
        </div>

        <div className="space-y-3 max-w-2xl mx-auto">
          <p className="text-lg text-gray-300 leading-relaxed">
            An intelligence platform built to separate sourced evidence, interpretation, and uncertainty.
          </p>
          <p className="text-xl font-semibold text-primary/80">
            Sovereignty. Awareness. Resilience. Verification.
          </p>
        </div>

        <div className="flex items-center justify-center gap-6 mt-8 flex-wrap">
          {FEATURES.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className={cn(
                'flex flex-col items-center gap-2 p-3 rounded-lg',
                'bg-primary/10 hover:bg-primary/20 transition-colors'
              )}
            >
              <Icon className="w-5 h-5 text-primary" />
              <span className="text-xs font-medium text-gray-400">{label}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <button
            onClick={onConnectWallet}
            className={cn(
              'group px-8 py-4 rounded-lg font-bold text-lg',
              'bg-gradient-to-r from-primary to-blue-600',
              'text-white shadow-lg shadow-primary/50',
              'hover:shadow-xl hover:shadow-primary/60 transition-all duration-300',
              'hover:scale-105 active:scale-95'
            )}
          >
            <span className="flex items-center gap-2">
              Connect Wallet to Join
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          <button
            onClick={onLearnMore}
            className={cn(
              'px-8 py-4 rounded-lg font-bold text-lg',
              'border-2 border-primary text-primary',
              'hover:bg-primary/10 transition-all duration-300',
              'hover:scale-105 active:scale-95'
            )}
          >
            Learn More
          </button>
        </div>

        <div className="pt-4 text-xs text-gray-500">
          <p>Source-aware • Auditable • Community-governed • Built for verification</p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); opacity: 0.2; }
          50% { transform: translateY(-20px); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
