'use client';

import React from 'react';
import { ShoppingCart, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Spec {
  label: string;
  value: string;
}

interface ResellerLink {
  name: string;
  url: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  category: 'awg' | 'solar' | 'food' | 'housing';
  price: number;
  currency?: string;
  image?: string;
  specs: Spec[];
  resellerLinks: ResellerLink[];
  hasFinancing?: boolean;
  rating?: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

const categoryConfig = {
  awg: { label: 'Atmospheric Water', color: 'bg-blue-500/20 text-blue-400' },
  solar: { label: 'Solar Energy', color: 'bg-orange-500/20 text-orange-400' },
  food: { label: 'Food Growing', color: 'bg-success/20 text-success' },
  housing: { label: 'Housing', color: 'bg-purple-500/20 text-purple-400' },
};

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const config = categoryConfig[product.category];

  return (
    <div
      className={cn(
        'rounded-lg border bg-gray-900/40 border-primary/10',
        'overflow-hidden transition-all duration-300',
        'hover:scale-[1.02] hover:border-primary/30 hover:shadow-lg hover:shadow-primary/20'
      )}
    >
      {/* Image Section */}
      <div className="relative h-40 bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden group">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <ShoppingCart className="w-8 h-8 text-primary/40 mx-auto mb-2" />
              <p className="text-xs text-gray-400">No image</p>
            </div>
          </div>
        )}

        {/* Category Badge */}
        <div className={cn(
          'absolute top-3 left-3 px-2.5 py-1 rounded text-xs font-semibold',
          config.color
        )}>
          {config.label}
        </div>

        {/* Financing Badge */}
        {product.hasFinancing && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded text-xs font-semibold bg-success/20 text-success">
            Financing Available
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Name & Description */}
        <div>
          <h3 className="font-semibold text-white text-sm line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Specs */}
        {product.specs.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.specs.slice(0, 3).map((spec, idx) => (
              <span
                key={idx}
                className="px-2 py-1 rounded text-xs bg-primary/10 text-primary/80"
              >
                {spec.label}: {spec.value}
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between pt-2 border-t border-primary/10">
          <span className="text-lg font-mono font-bold text-white">
            ${product.price.toFixed(0)}
            {product.currency && <span className="text-xs ml-1">{product.currency}</span>}
          </span>
          {product.rating && (
            <span className="text-xs text-yellow-400 font-semibold">
              ★ {product.rating}
            </span>
          )}
        </div>

        {/* Reseller Links */}
        {product.resellerLinks.length > 0 && (
          <div className="space-y-2 pt-2">
            {product.resellerLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium',
                  'bg-primary/20 hover:bg-primary/30 text-primary transition-colors'
                )}
              >
                {link.name}
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
