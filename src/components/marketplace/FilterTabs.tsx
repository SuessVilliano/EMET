'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  label: string;
}

interface FilterTabsProps {
  categories: Category[];
  active: string;
  onChange: (categoryId: string) => void;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'all', label: 'All' },
  { id: 'awg', label: 'AWGs' },
  { id: 'solar', label: 'Solar' },
  { id: 'food', label: 'Food Growing' },
  { id: 'housing', label: 'Housing' },
];

export function FilterTabs({
  categories = DEFAULT_CATEGORIES,
  active,
  onChange,
}: FilterTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative flex items-center gap-2 bg-gray-900/20 rounded-lg p-2">
      {/* Left Scroll Button */}
      <button
        onClick={() => scroll('left')}
        className="p-1.5 rounded hover:bg-primary/10 transition-colors flex-shrink-0"
        aria-label="Scroll categories left"
      >
        <ChevronLeft className="w-4 h-4 text-primary" />
      </button>

      {/* Tabs Container */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide flex-1"
        role="tablist"
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onChange(category.id)}
            role="tab"
            aria-selected={active === category.id}
            className={cn(
              'px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 flex-shrink-0',
              active === category.id
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'bg-primary/10 text-gray-300 hover:bg-primary/20'
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Right Scroll Button */}
      <button
        onClick={() => scroll('right')}
        className="p-1.5 rounded hover:bg-primary/10 transition-colors flex-shrink-0"
        aria-label="Scroll categories right"
      >
        <ChevronRight className="w-4 h-4 text-primary" />
      </button>
    </div>
  );
}
