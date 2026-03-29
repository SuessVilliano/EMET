'use client';

import React from 'react';
import { Droplets, Sun, Sprout, Home, Scale, Vote, Eye, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Feature {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: 'blue' | 'orange' | 'green' | 'purple' | 'emerald' | 'cyan' | 'amber' | 'violet';
}

const FEATURES: Feature[] = [
  {
    id: 'water',
    icon: Droplets,
    title: 'Water Independence',
    description: 'Access atmospheric water generation technology and reclaim your water freedom.',
    color: 'blue',
  },
  {
    id: 'solar',
    icon: Sun,
    title: 'Solar Energy',
    description: 'Harness the sun with decentralized energy solutions for true independence.',
    color: 'orange',
  },
  {
    id: 'food',
    icon: Sprout,
    title: 'Food Security',
    description: 'Grow your own food with community-driven agriculture knowledge and resources.',
    color: 'green',
  },
  {
    id: 'housing',
    icon: Home,
    title: 'Affordable Housing',
    description: 'Access to sustainable housing solutions built for modern communities.',
    color: 'purple',
  },
  {
    id: 'legal',
    icon: Scale,
    title: 'Legal Empowerment',
    description: 'Navigate legal systems with AI-powered guidance and community support.',
    color: 'emerald',
  },
  {
    id: 'consciousness',
    icon: Eye,
    title: 'Consciousness Expansion',
    description: 'Ancient mystery school wisdom, pineal activation, Hermetic principles, and the unified field — the knowledge they suppressed.',
    color: 'violet',
  },
  {
    id: 'history',
    icon: Globe,
    title: 'True History',
    description: 'Advanced ancient civilizations, suppressed archaeology, and the real timeline of human consciousness — not the textbook version.',
    color: 'amber',
  },
  {
    id: 'dao',
    icon: Vote,
    title: 'Community DAO',
    description: 'Participate in decentralized governance and shape the future together. The people are sovereign.',
    color: 'cyan',
  },
];

const colorConfig = {
  blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 hover:border-blue-500/50',
  orange: 'from-orange-500/20 to-orange-600/10 border-orange-500/30 hover:border-orange-500/50',
  green: 'from-green-500/20 to-green-600/10 border-green-500/30 hover:border-green-500/50',
  purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 hover:border-purple-500/50',
  emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 hover:border-emerald-500/50',
  cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 hover:border-cyan-500/50',
  violet: 'from-violet-500/20 to-violet-600/10 border-violet-500/30 hover:border-violet-500/50',
  amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 hover:border-amber-500/50',
};

const iconColorConfig = {
  blue: 'text-blue-400',
  orange: 'text-orange-400',
  green: 'text-green-400',
  purple: 'text-purple-400',
  emerald: 'text-emerald-400',
  cyan: 'text-cyan-400',
  violet: 'text-violet-400',
  amber: 'text-amber-400',
};

interface FeatureCardsProps {
  features?: Feature[];
}

export function FeatureCards({ features = FEATURES }: FeatureCardsProps) {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Domains of Liberation
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Every system of control has an exit. EMET illuminates the paths to sovereignty across all dimensions of human experience.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            const bgClass = colorConfig[feature.color];
            const iconClass = iconColorConfig[feature.color];

            return (
              <div
                key={feature.id}
                className={cn(
                  'group relative p-6 rounded-xl border transition-all duration-300',
                  'bg-gradient-to-br cursor-pointer',
                  bgClass,
                  'hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1'
                )}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10"
                  style={{
                    background: `radial-gradient(circle, ${feature.color === 'blue' ? '#3b82f6' : feature.color === 'orange' ? '#f59e0b' : feature.color === 'green' ? '#10b981' : feature.color === 'purple' ? '#a855f7' : feature.color === 'emerald' ? '#10b981' : feature.color === 'violet' ? '#8b5cf6' : feature.color === 'amber' ? '#f59e0b' : '#06b6d4'}40 0%, transparent 70%)`,
                  }}
                />

                {/* Icon */}
                <div className={cn(
                  'w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4',
                  'group-hover:scale-110 transition-transform duration-300'
                )}>
                  <Icon className={cn('w-6 h-6', iconClass)} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Accent line */}
                <div className={cn(
                  'absolute bottom-0 left-0 h-1 bg-gradient-to-r transition-all duration-300',
                  'group-hover:w-full w-0',
                  feature.color === 'blue' && 'from-blue-500 to-transparent',
                  feature.color === 'orange' && 'from-orange-500 to-transparent',
                  feature.color === 'green' && 'from-green-500 to-transparent',
                  feature.color === 'purple' && 'from-purple-500 to-transparent',
                  feature.color === 'emerald' && 'from-emerald-500 to-transparent',
                  feature.color === 'cyan' && 'from-cyan-500 to-transparent',
                  feature.color === 'violet' && 'from-violet-500 to-transparent',
                  feature.color === 'amber' && 'from-amber-500 to-transparent',
                )} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
