'use client'

import { useState } from 'react'
import { Search, Upload, FileText } from 'lucide-react'

interface LegalDocument {
  id: string
  title: string
  category: string
  citation: string
  excerpt: string
}

const legalDocuments: LegalDocument[] = [
  {
    id: '1',
    title: 'UCC Article 3 — Negotiable Instruments',
    category: 'UCC',
    citation: 'UCC § 3-102',
    excerpt:
      'This article applies to negotiable instruments. It governs rights, obligations, and defenses relating to instruments.',
  },
  {
    id: '2',
    title: 'UCC Article 9 — Secured Transactions',
    category: 'UCC',
    citation: 'UCC § 9-101',
    excerpt:
      'This article provides a comprehensive scheme for the regulation of security interests in personal property.',
  },
  {
    id: '3',
    title: 'First Amendment — Freedom of Speech',
    category: 'Constitution',
    citation: 'U.S. Const. amend. I',
    excerpt:
      'Congress shall make no law respecting an establishment of religion, or prohibiting the free exercise thereof; or abridging the freedom of speech.',
  },
  {
    id: '4',
    title: 'Fourth Amendment — Protection Against Unreasonable Searches',
    category: 'Constitution',
    citation: 'U.S. Const. amend. IV',
    excerpt:
      'The right of the people to be secure in their persons, houses, papers, and effects, against unreasonable searches and seizures, shall not be violated.',
  },
  {
    id: '5',
    title: 'Black\'s Law Dictionary — Lien',
    category: "Black's Law",
    citation: 'Black\'s Law Dict. (11th ed. 2019)',
    excerpt:
      'A legal right or interest that a lender has in the borrower\'s property, granted as security for the debt.',
  },
  {
    id: '6',
    title: 'Consumer Protection Act',
    category: 'Consumer Protection',
    citation: '15 U.S.C. § 2601',
    excerpt:
      'Establishes standards for the privacy of consumer information and protection against unfair or deceptive practices.',
  },
]

const categories = ['All', 'UCC', 'Constitution', "Black's Law", 'Consumer Protection', 'Straw-Man', 'Land Law']

export default function LegalPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  let filtered = legalDocuments
  if (selectedCategory !== 'All') {
    filtered = filtered.filter((d) => d.category === selectedCategory)
  }
  if (searchQuery) {
    filtered = filtered.filter(
      (d) =>
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.citation.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Search UCC codes, Constitutional amendments, Black's Law..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
        />
      </div>

      {/* Category Sidebar and Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Categories */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
          <div className="space-y-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                  selectedCategory === cat
                    ? 'bg-emerald-500/30 border border-emerald-500 text-emerald-400'
                    : 'border border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          {filtered.length > 0 ? (
            filtered.map((doc) => (
              <div
                key={doc.id}
                className="rounded-lg border border-slate-700 bg-slate-900/50 p-6 hover:border-slate-600 transition"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-blue-500/20 flex-shrink-0">
                    <FileText className="w-6 h-6 text-blue-400" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {doc.title}
                    </h3>
                    <p className="text-sm text-emerald-400 font-mono mb-2">
                      {doc.citation}
                    </p>
                    <p className="text-slate-300 text-sm mb-3">{doc.excerpt}</p>

                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 rounded text-xs bg-slate-800 text-slate-400">
                        {doc.category}
                      </span>
                      <button className="text-sm text-emerald-400 hover:text-emerald-300 transition font-semibold">
                        Read Full →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400">
                No documents found matching your search.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Section */}
      <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-8 text-center">
        <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">
          Upload Legal Documents
        </h3>
        <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
          Upload legal documents, case filings, or evidence for EMET to analyze.
          Your documents are securely stored and processed.
        </p>
        <button className="px-6 py-3 rounded-lg bg-emerald-500/20 border border-emerald-500 text-emerald-400 hover:bg-emerald-500/30 transition font-semibold">
          Choose Files to Upload
        </button>
      </div>
    </div>
  )
}
