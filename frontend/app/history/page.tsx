'use client'

/**
 * ParamAI Frontend — History Page
 * Shows all past queries
 *
 * Competition: AI Open Innovation Challenge 2026
 * Team: Group 1, President University
 */

import { useState, useEffect } from 'react'
import { Clock, ArrowRight, Trash2 } from 'lucide-react'
import { HistoryItem } from '@/lib/types'
import { getHistory, clearHistory } from '@/lib/api'

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHistory = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getHistory()
      setHistory(data)
    } catch (err) {
      console.error('Error fetching history:', err)
      setError(err instanceof Error ? err.message : 'Failed to load history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const handleClearHistory = async () => {
    if (confirm('Are you sure you want to clear all history?')) {
      try {
        await clearHistory()
        setHistory([])
      } catch (err) {
        console.error('Error clearing history:', err)
        alert('Failed to clear history')
      }
    }
  }

  const handleViewDetails = (item: HistoryItem) => {
    console.log('View details for:', item)
    // Future: navigate to detail page
  }

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return timestamp
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Query History</h1>
          <p className="text-sm text-gray-500 mt-1">Loading...</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Query History</h1>
            <p className="text-sm text-gray-500 mt-1">
              {history.length > 0
                ? `${history.length} queries recorded`
                : 'No queries yet'}
            </p>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium
                         text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
              Clear History
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-7xl mx-auto">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        {history.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No queries yet
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Go to Simulator to get started with BPOM parameter recommendations
            </p>
            <a
              href="/simulator"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500
                         text-white text-sm font-medium rounded-lg hover:bg-blue-600
                         transition-colors"
            >
              Go to Simulator
              <ArrowRight size={16} />
            </a>
          </div>
        ) : (
          /* History Table */
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#1E3A5F]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Confidence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.map((item, index) => (
                  <tr
                    key={item.id || index}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    {/* Time */}
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatTimestamp(item.timestamp)}
                    </td>

                    {/* Product Name */}
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {item.product_name}
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                      {item.category_name}
                    </td>

                    {/* Confidence */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="font-medium">{item.confidence}%</span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {item.review_flag ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
                          Pending Review
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                          Reviewed
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewDetails(item)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}