'use client'

/**
 * ParamAI Frontend — Regulation Update Card
 * Shows BPOM regulation update status with modal
 *
 * Competition: AI Open Innovation Challenge 2026
 * Team: Group 1, President University
 */

import { useState, useEffect } from 'react'
import { RefreshCw, X, ExternalLink, Calendar, FileText, CheckCircle } from 'lucide-react'
import { getRegulations, RegulationsResponse } from '@/lib/api'

interface RegulationCardProps {
  className?: string
}

export default function RegulationCard({ className = '' }: RegulationCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [regulations, setRegulations] = useState<RegulationsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRegulations = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getRegulations()
      setRegulations(data)
    } catch (err) {
      setError('Failed to load regulations')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
    if (!regulations) {
      fetchRegulations()
    }
  }

  // Format date for display
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A'
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <>
      {/* Update Card */}
      <div className={className}>
        <div
          className="p-4 rounded-xl text-white"
          style={{
            background: 'linear-gradient(135deg, #4F6EF7 0%, #8B5CF6 100%)',
          }}
        >
          <p className="text-xs font-medium mb-1">BPOM Regulations</p>
          <p className="text-[11px] text-white/80 mb-3">
            {regulations ? `Updated: ${formatDate(regulations.last_updated)}` : 'Loading...'}
          </p>
          <button
            onClick={handleOpenModal}
            className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={14} />
            Check Updates
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false)
          }}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
            style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
          >
            {/* Modal Header */}
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ backgroundColor: '#384884' }}
            >
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-white" />
                <h2 className="text-lg font-bold text-white">BPOM Regulation Updates</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw size={24} className="animate-spin" style={{ color: '#4F6EF7' }} />
                  <span className="ml-3" style={{ color: '#6b7280' }}>Loading regulations...</span>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p style={{ color: '#ef4444' }}>{error}</p>
                  <button
                    onClick={fetchRegulations}
                    className="mt-4 px-4 py-2 rounded-lg text-sm font-medium text-white"
                    style={{ backgroundColor: '#4F6EF7' }}
                  >
                    Retry
                  </button>
                </div>
              ) : regulations ? (
                <div className="space-y-6">
                  {/* Status Banner */}
                  <div
                    className="p-4 rounded-xl flex items-center gap-4"
                    style={{ backgroundColor: '#d1fae5', border: '1px solid #a7f3d0' }}
                  >
                    <CheckCircle size={24} style={{ color: '#059669' }} />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#065f46' }}>
                        Knowledge Base Up to Date
                      </p>
                      <p className="text-xs" style={{ color: '#047857' }}>
                        All BPOM regulations are current and verified
                      </p>
                    </div>
                  </div>

                  {/* Version Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className="p-4 rounded-xl"
                      style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
                    >
                      <p className="text-xs font-medium mb-1" style={{ color: '#6b7280' }}>Version</p>
                      <p className="text-lg font-bold" style={{ color: '#1a1a2e' }}>{regulations.version}</p>
                    </div>
                    <div
                      className="p-4 rounded-xl"
                      style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
                    >
                      <p className="text-xs font-medium mb-1" style={{ color: '#6b7280' }}>Categories</p>
                      <p className="text-lg font-bold" style={{ color: '#1a1a2e' }}>{regulations.categories_count}</p>
                    </div>
                  </div>

                  {/* Last Updated */}
                  <div
                    className="p-4 rounded-xl flex items-center gap-3"
                    style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}
                  >
                    <Calendar size={20} style={{ color: '#2563eb' }} />
                    <div>
                      <p className="text-xs font-medium" style={{ color: '#6b7280' }}>Last Updated</p>
                      <p className="text-sm font-semibold" style={{ color: '#1e40af' }}>
                        {formatDate(regulations.last_updated)}
                      </p>
                    </div>
                  </div>

                  {/* Source Regulations */}
                  <div>
                    <h3 className="text-sm font-bold mb-3" style={{ color: '#1a1a2e' }}>
                      Source Regulations ({regulations.source_regulations.length})
                    </h3>
                    <div className="space-y-2">
                      {regulations.source_regulations.map((reg, index) => (
                        <div
                          key={index}
                          className="p-3 rounded-lg flex items-start gap-3"
                          style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
                        >
                          <FileText size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#4F6EF7' }} />
                          <p className="text-sm" style={{ color: '#374151' }}>{reg}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Next Update Info */}
                  {regulations.metadata?.next_update && (
                    <div
                      className="p-4 rounded-xl flex items-center gap-3"
                      style={{ backgroundColor: '#fef3c7', border: '1px solid #fcd34d' }}
                    >
                      <RefreshCw size={20} style={{ color: '#d97706' }} />
                      <div>
                        <p className="text-xs font-medium" style={{ color: '#6b7280' }}>Next Scheduled Update</p>
                        <p className="text-sm font-semibold" style={{ color: '#92400e' }}>
                          {regulations.metadata.next_update}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Modal Footer */}
            <div
              className="px-6 py-4 flex items-center justify-end gap-3"
              style={{ borderTop: '1px solid #e5e7eb' }}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor: '#f9fafb', color: '#374151' }}
              >
                Close
              </button>
              <button
                onClick={fetchRegulations}
                disabled={loading}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-2"
                style={{ backgroundColor: '#4F6EF7' }}
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}