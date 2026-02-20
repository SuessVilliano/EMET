'use client'

import { useState } from 'react'
import { ShoppingCart, Star } from 'lucide-react'

interface Product {
  id: string
  name: string
  category: string
  price: number | string
  specs: string
  image: string
  rating: number
}

const products: Product[] = [
  // AWG Products
  {
    id: '1',
    name: 'AquaBoy Pro 20',
    category: 'AWG',
    price: '$1,500',
    specs: '20 GPD, Compact Design',
    image: 'bg-gradient-to-br from-blue-600 to-blue-400',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Genesis WaterMaker',
    category: 'AWG',
    price: '$3,200',
    specs: '50 GPD, Industrial Grade',
    image: 'bg-gradient-to-br from-cyan-600 to-cyan-400',
    rating: 4.9,
  },
  {
    id: '3',
    name: 'SkyWater 300',
    category: 'AWG',
    price: '$8,500',
    specs: '300 GPD, Commercial',
    image: 'bg-gradient-to-br from-blue-700 to-blue-500',
    rating: 5.0,
  },

  // Solar Products
  {
    id: '4',
    name: 'LIV8 Home Kit 5kW',
    category: 'Solar',
    price: '$4,200',
    specs: '5kW, Residential',
    image: 'bg-gradient-to-br from-amber-600 to-amber-400',
    rating: 4.7,
  },
  {
    id: '5',
    name: 'Off-Grid Complete 10kW',
    category: 'Solar',
    price: '$9,800',
    specs: '10kW, Battery Included',
    image: 'bg-gradient-to-br from-orange-600 to-orange-400',
    rating: 4.9,
  },
  {
    id: '6',
    name: 'Portable Solar Generator 2kW',
    category: 'Solar',
    price: '$1,200',
    specs: '2kW, Mobile Friendly',
    image: 'bg-gradient-to-br from-yellow-600 to-yellow-400',
    rating: 4.6,
  },

  // Food Products
  {
    id: '7',
    name: 'Indoor Hydroponic Tower',
    category: 'Food',
    price: '$350',
    specs: 'Home System, 24 Plants',
    image: 'bg-gradient-to-br from-emerald-600 to-emerald-400',
    rating: 4.5,
  },
  {
    id: '8',
    name: 'Raised Bed Starter Kit',
    category: 'Food',
    price: '$150',
    specs: '4x8ft, Pre-assembled',
    image: 'bg-gradient-to-br from-green-600 to-green-400',
    rating: 4.4,
  },
  {
    id: '9',
    name: 'Heritage Seed Vault 100+',
    category: 'Food',
    price: '$85',
    specs: '100+ Heirloom Varieties',
    image: 'bg-gradient-to-br from-lime-600 to-lime-400',
    rating: 4.8,
  },

  // Housing Products
  {
    id: '10',
    name: 'Boxabl Casita',
    category: 'Housing',
    price: '$50,000',
    specs: '375 sq ft, Modular',
    image: 'bg-gradient-to-br from-slate-600 to-slate-400',
    rating: 4.7,
  },
  {
    id: '11',
    name: '3D Printed Home — ICON',
    category: 'Housing',
    price: '$200,000+',
    specs: 'Custom Design, Durable',
    image: 'bg-gradient-to-br from-gray-600 to-gray-400',
    rating: 4.9,
  },
  {
    id: '12',
    name: 'Tax Lien Strategy Guide',
    category: 'Housing',
    price: 'Free',
    specs: 'Digital Guide, Legal Strategies',
    image: 'bg-gradient-to-br from-purple-600 to-purple-400',
    rating: 4.6,
  },
]

const categories = ['All', 'AWG', 'Solar', 'Food', 'Housing']

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filtered =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory)

  return (
    <div className="space-y-8">
      {/* Filter Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-emerald-500/30 border border-emerald-500 text-emerald-400'
                : 'border border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((product) => (
          <div
            key={product.id}
            className="rounded-lg border border-slate-700 bg-slate-900/50 overflow-hidden hover:border-slate-600 transition group"
          >
            {/* Image Area */}
            <div
              className={`h-32 ${product.image} relative overflow-hidden group-hover:scale-105 transition duration-300`}
            >
              <div className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold bg-slate-900/80 text-slate-200">
                {product.category}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-white mb-1 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-sm text-slate-400 mb-3">{product.specs}</p>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-400">
                  {product.rating}
                </span>
              </div>

              {/* Price and Button */}
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-emerald-400">
                  {product.price}
                </p>
                <button className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30 transition">
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
