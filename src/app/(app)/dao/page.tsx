'use client'

import { useState } from 'react'
import { Plus, TrendingUp, CheckCircle, XCircle, Clock } from 'lucide-react'

interface Proposal {
  id: string
  title: string
  status: 'ACTIVE' | 'VOTING' | 'PASSED' | 'FAILED'
  yesVotes: number
  totalVotes: number
  endDate: string
  votesYes: number
}

const proposals: Proposal[] = [
  {
    id: '1',
    title: 'Fund Community AWG Installation',
    status: 'VOTING',
    yesVotes: 68,
    totalVotes: 100,
    endDate: 'Ends in 2 days',
    votesYes: 850,
  },
  {
    id: '2',
    title: 'Add New Solar Reseller Partner',
    status: 'PASSED',
    yesVotes: 82,
    totalVotes: 100,
    endDate: 'Passed 3 days ago',
    votesYes: 1050,
  },
  {
    id: '3',
    title: 'Update Content Engine Tone',
    status: 'ACTIVE',
    yesVotes: 55,
    totalVotes: 100,
    endDate: 'Voting opens in 5 days',
    votesYes: 0,
  },
  {
    id: '4',
    title: 'Emergency: Water Crisis Alert Protocol',
    status: 'VOTING',
    yesVotes: 91,
    totalVotes: 100,
    endDate: 'Ends in 6 hours',
    votesYes: 1200,
  },
]

const filters = ['All', 'Active', 'Voting', 'Passed', 'Failed']

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'PASSED':
      return <CheckCircle className="w-5 h-5 text-emerald-400" />
    case 'FAILED':
      return <XCircle className="w-5 h-5 text-red-400" />
    case 'VOTING':
      return <TrendingUp className="w-5 h-5 text-amber-400" />
    default:
      return <Clock className="w-5 h-5 text-blue-400" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PASSED':
      return 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
    case 'FAILED':
      return 'bg-red-500/20 border-red-500/50 text-red-400'
    case 'VOTING':
      return 'bg-amber-500/20 border-amber-500/50 text-amber-400'
    default:
      return 'bg-blue-500/20 border-blue-500/50 text-blue-400'
  }
}

export default function DAOPage() {
  const [selectedFilter, setSelectedFilter] = useState('All')

  const filtered =
    selectedFilter === 'All'
      ? proposals
      : proposals.filter(
          (p) => p.status === selectedFilter.toUpperCase() || 
                  (selectedFilter === 'Active' && p.status === 'ACTIVE')
        )

  return (
    <div className="space-y-8">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">DAO Proposals</h1>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500 text-emerald-400 hover:bg-emerald-500/30 transition font-semibold">
          <Plus className="w-5 h-5" />
          Create Proposal
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
              selectedFilter === filter
                ? 'bg-blue-500/30 border border-blue-500 text-blue-400'
                : 'border border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-600'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        {filtered.map((proposal) => (
          <div
            key={proposal.id}
            className="rounded-lg border border-slate-700 bg-slate-900/50 p-6 hover:border-slate-600 transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {getStatusIcon(proposal.status)}
                  <h3 className="text-lg font-semibold text-white">
                    {proposal.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
                      proposal.status
                    )}`}
                  >
                    {proposal.status}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-slate-400">Vote Progress</p>
                    <p className="text-sm font-semibold text-emerald-400">
                      {proposal.yesVotes}% Yes
                    </p>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full transition-all"
                      style={{ width: `${proposal.yesVotes}%` }}
                    ></div>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex items-center gap-6 text-sm text-slate-400">
                  <div>
                    <p className="font-semibold text-white">
                      {proposal.votesYes}
                    </p>
                    <p>Total Votes</p>
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {proposal.endDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {proposal.status === 'VOTING' && (
                <button className="px-6 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30 transition font-semibold whitespace-nowrap">
                  Vote
                </button>
              )}

              {proposal.status === 'ACTIVE' && (
                <button className="px-6 py-2 rounded-lg bg-blue-500/20 border border-blue-500/50 text-blue-400 hover:bg-blue-500/30 transition font-semibold whitespace-nowrap">
                  View Details
                </button>
              )}

              {proposal.status === 'PASSED' && (
                <button className="px-6 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 cursor-default whitespace-nowrap">
                  Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
