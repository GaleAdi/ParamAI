'use client'

/**
 * ParamAI Frontend — History Page
 * Shows all past queries
 * Design: Professional SaaS with silver-blue background
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#D8DAE7' }}>
        <div
          className="w-12 h-12 rounded-full border-4 animate-spin"
          style={{ borderColor: '#4F6EF7', borderTopColor: 'transparent' }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#D8DAE7' }}>
      {/* Top Bar */}
      <div
        className="px-6 py-5"
        style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#1a1a2e' }}>Query History</h1>
            <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
              {history.length > 0 ? `${history.length} queries recorded` : 'No queries yet'}
            </p>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-colors"
              style={{
                backgroundColor: '#fee2e2',
                color: '#991b1b',
              }}
            >
              <Trash2 size={16} />
              Clear History
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {error && (
          <div
            className="mb-4 p-4 rounded-xl"
            style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #fca5a5',
              color: '#991b1b',
            }}
          >
            {error}
          </div>
        )}

        {history.length === 0 ? (
          <div
            className="rounded-xl p-12 text-center"
            style={{
              backgroundColor: 'white',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: '#eff6ff' }}
            >
              <Clock size={32} style={{ color: '#4F6EF7' }} />
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: '#1a1a2e' }}>No queries yet</h3>
            <p className="text-sm mb-4" style={{ color: '#6b7280' }}>
              Go to Simulator to get started with BPOM parameter recommendations
            </p>
            <a
              href="/simulator"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl text-white transition-colors"
              style={{ background: 'linear-gradient(135deg, #4F6EF7 0%, #6B83F8 100%)' }}
            >
              Go to Simulator
              <ArrowRight size={16} />
            </a>
          </div>
        ) : (
          <div
            className="rounded-xl overflow-hidden"
            style={{
              backgroundColor: 'white',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          >
            <table className="w-full">
              <thead style={{ backgroundColor: '#384884' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Product Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Confidence</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => (
                  <tr
                    key={item.timestamp || index}
                    style={index % 2 === 0 ? { backgroundColor: 'white' } : { backgroundColor: '#f9fafb' }}
                  >
                    <td className="px-6 py-4 text-sm" style={{ color: '#6b7280' }}>{formatTimestamp(item.timestamp)}</td>
                    <td className="px-6 py-4 text-sm font-semibold" style={{ color: '#1a1a2e' }}>
                      {item.input_summary || item.product_name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono" style={{ color: '#4F6EF7' }}>{item.category_code || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm font-semibold" style={{ color: '#374151' }}>
                      {Math.round((item.confidence || 0) * 100)}%
                    </td>
                    <td className="px-6 py-4">
                      {item.review_flag ? (
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full"
                          style={{ backgroundColor: '#fef3c7', color: '#92400e' }}
                        >
                          Pending Review
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full"
                          style={{ backgroundColor: '#d1fae5', color: '#065f46' }}
                        >
                          Reviewed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer Spacer */}
      <div style={{ height: '48px' }}></div>
    </div>
  )
}