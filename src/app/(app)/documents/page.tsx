'use client'

import { useState } from 'react'
import { Upload, FileText, CheckCircle, AlertCircle, Brain } from 'lucide-react'

interface Document {
  id: string
  name: string
  category: string
  uploadDate: string
  status: 'processing' | 'indexed' | 'error'
  fileSize: string
}

const documents: Document[] = [
  {
    id: '1',
    name: 'Constitutional Bill of Rights Analysis',
    category: 'Legal',
    uploadDate: '2 days ago',
    status: 'indexed',
    fileSize: '2.4 MB',
  },
  {
    id: '2',
    name: 'UCC Article 3 Dispute Case Study',
    category: 'Case Filings',
    uploadDate: '1 week ago',
    status: 'indexed',
    fileSize: '1.8 MB',
  },
  {
    id: '3',
    name: 'AWG Installation Guidelines v2.1',
    category: 'Guidelines',
    uploadDate: '3 days ago',
    status: 'processing',
    fileSize: '850 KB',
  },
  {
    id: '4',
    name: 'Water Rights Legal Precedents',
    category: 'Research',
    uploadDate: '5 days ago',
    status: 'indexed',
    fileSize: '3.2 MB',
  },
  {
    id: '5',
    name: 'Tax Lien Strategy Compilation',
    category: 'Evidence',
    uploadDate: '1 week ago',
    status: 'indexed',
    fileSize: '2.1 MB',
  },
]

const categories = ['All', 'Legal', 'Case Filings', 'Guidelines', 'Evidence', 'Research']

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'indexed':
      return <CheckCircle className="w-5 h-5 text-emerald-400" />
    case 'processing':
      return <AlertCircle className="w-5 h-5 text-amber-400 animate-pulse" />
    case 'error':
      return <AlertCircle className="w-5 h-5 text-red-400" />
    default:
      return null
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'indexed':
      return 'Indexed'
    case 'processing':
      return 'Processing...'
    case 'error':
      return 'Error'
    default:
      return status
  }
}

export default function DocumentsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isDragging, setIsDragging] = useState(false)

  const filtered =
    selectedCategory === 'All'
      ? documents
      : documents.filter((d) => d.category === selectedCategory)

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <div
        className={`rounded-lg border-2 border-dashed p-12 text-center transition ${
          isDragging
            ? 'border-emerald-500 bg-emerald-500/10'
            : 'border-slate-700 bg-slate-900/50'
        }`}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDrop={() => setIsDragging(false)}
      >
        <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">
          Upload Documents
        </h3>
        <p className="text-slate-400 mb-6">
          Drag and drop files here, or click to browse. Supported formats: PDF,
          DOC, DOCX, TXT
        </p>
        <button className="px-6 py-3 rounded-lg bg-emerald-500/20 border border-emerald-500 text-emerald-400 hover:bg-emerald-500/30 transition font-semibold">
          Choose Files
        </button>
        <p className="text-xs text-slate-500 mt-4">
          Max file size: 50 MB | Files are encrypted and stored securely
        </p>
      </div>

      {/* Category Filter */}
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

      {/* Documents List */}
      <div className="space-y-3">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="rounded-lg border border-slate-700 bg-slate-900/50 p-4 hover:border-slate-600 transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 rounded-lg bg-blue-500/20 flex-shrink-0 mt-1">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{doc.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">
                      {doc.category}
                    </span>
                    <span>{doc.fileSize}</span>
                    <span>{doc.uploadDate}</span>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2 mt-2">
                    {getStatusIcon(doc.status)}
                    <span className="text-xs text-slate-400">
                      {getStatusText(doc.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0">
                {doc.status === 'indexed' && (
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30 transition text-sm font-semibold whitespace-nowrap">
                    <Brain className="w-4 h-4" />
                    Feed to EMET
                  </button>
                )}
                <button className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-600 transition text-sm font-semibold whitespace-nowrap">
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No documents in this category.</p>
        </div>
      )}
    </div>
  )
}
