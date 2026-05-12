'use client'

/**
 * ParamAI Frontend — Result Card Component
 * RIGHT panel of the Simulator page
 * Shows full recommendation output with professional SaaS design
 *
 * Competition: AI Open Innovation Challenge 2026
 * Team: Kebut Semalam, President University
 */

import { useState } from 'react'
import { Loader2, Save, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { RecommendationResult } from '@/lib/types'
import CategoryBadge from './CategoryBadge'
import ParamTable from './ParamTable'
import CopyCitations from './CopyCitations'
import PdfExport from './PdfExport'

interface ResultCardProps {
  result: RecommendationResult | null
  isLoading: boolean
  onNewQuery: () => void
  showLoadingSteps?: boolean
}

// Loading step tracker
function LoadingSteps() {
  const [step, setStep] = useState(0)
  const steps = [
    'Extracting product entities...',
    'Matching BPOM categories...',
    'Calculating parameters...',
    'Finalizing recommendation...',
  ]

  // Simulate step progression
  useState(() => {
    if (typeof window !== 'undefined') {
      const interval = setInterval(() => {
        setStep((s) => (s < 3 ? s + 1 : s))
      }, 600)
      return () => clearInterval(interval)
    }
  })

  return (
    <div className="mt-4 p-4 rounded-xl space-y-3" style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}>
      {steps.map((label, i) => (
        <div key={i} className="flex items-center gap-3 text-sm">
          {i < step ? (
            <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#10b981' }}>
              <CheckCircle2 size={14} className="text-white" />
            </div>
          ) : i === step ? (
            <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#eff6ff' }}>
              <Loader2 size={14} className="animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full" style={{ backgroundColor: '#e5e7eb' }} />
          )}
          <span
            style={{
              color: i <= step ? '#1a1a2e' : '#9ca3af',
              fontWeight: i === step ? 500 : 400,
            }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function ResultCard({
  result,
  isLoading,
  onNewQuery,
  showLoadingSteps = false,
}: ResultCardProps) {
  // =============================================================================
  // EMPTY STATE — No result yet
  // =============================================================================
  if (!result && !isLoading) {
    return (
      <div
        className="rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center"
        style={{
          backgroundColor: 'white',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
          style={{ backgroundColor: '#eff6ff' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4F6EF7"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
            <path d="M11 8v6" />
            <path d="M8 11h6" />
          </svg>
        </div>

        <h3 className="text-lg font-bold mb-2" style={{ color: '#1a1a2e' }}>
          Ready for Analysis
        </h3>
        <p className="text-sm max-w-xs" style={{ color: '#6b7280' }}>
          Enter a product description in the form and click Analyze to get BPOM
          parameter recommendations
        </p>

        <div className="mt-6 flex items-center gap-2 text-xs" style={{ color: '#9ca3af' }}>
          <CheckCircle2 size={14} />
          <span>AI-powered classification & parameter extraction</span>
        </div>
      </div>
    )
  }

  // =============================================================================
  // LOADING STATE
  // =============================================================================
  if (isLoading) {
    return (
      <div
        className="rounded-2xl p-6 h-full flex flex-col"
        style={{
          backgroundColor: 'white',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="mb-4">
          <h2 className="text-xl font-bold" style={{ color: '#1a1a2e' }}>
            Analyzing Product...
          </h2>
          <p className="text-sm" style={{ color: '#6b7280' }}>
            Please wait while we process your request
          </p>
        </div>

        {/* Animated skeleton */}
        <div className="flex-1" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
          <div className="h-24 rounded-xl mb-4" style={{ backgroundColor: '#f3f4f6' }} />
          <div className="h-8 rounded-t-lg mb-px" style={{ backgroundColor: '#f3f4f6' }} />
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-12 rounded-none mb-px last:rounded-b-lg"
              style={{ backgroundColor: '#f9fafb' }}
            />
          ))}
        </div>

        {/* Loading steps */}
        {showLoadingSteps && <LoadingSteps />}

        <div className="mt-4 text-center">
          <Loader2 size={24} className="animate-spin mx-auto mb-2" style={{ color: '#4F6EF7' }} />
          <p className="text-sm font-medium" style={{ color: '#1a1a2e' }}>
            Processing...
          </p>
        </div>
      </div>
    )
  }

  // =============================================================================
  // RESULT STATE
  // =============================================================================
  const safeResult = result as RecommendationResult

  return (
    <div
      className="rounded-2xl p-6 h-full flex flex-col overflow-y-auto"
      style={{
        backgroundColor: 'white',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-bold" style={{ color: '#1a1a2e' }}>
          Analysis Result
        </h2>
        <p className="text-sm" style={{ color: '#6b7280' }}>
          BPOM testing parameters for your product
        </p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {/* Category Badge */}
        <CategoryBadge
          category_code={safeResult.category_code}
          category_name={safeResult.category_name}
          confidence={safeResult.confidence}
          review_flag={safeResult.review_flag}
        />

        {/* Candidates */}
        {safeResult.candidates && safeResult.candidates.length > 0 && (
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
          >
            <h4 className="text-sm font-semibold mb-2" style={{ color: '#1a1a2e' }}>
              Alternative Categories
            </h4>
            <div className="space-y-2">
              {safeResult.candidates.slice(1).map((candidate, index) => (
                <div
                  key={candidate.code || index}
                  className="flex items-center justify-between py-2 px-3 rounded-lg"
                  style={{ backgroundColor: 'white', border: '1px solid #e5e7eb' }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 text-xs font-mono rounded"
                      style={{ backgroundColor: '#eff6ff', color: '#1e40af' }}
                    >
                      {candidate.code}
                    </span>
                    <span className="text-sm" style={{ color: '#374151' }}>
                      {candidate.name}
                    </span>
                  </div>
                  <span className="text-xs font-semibold" style={{ color: '#6b7280' }}>
                    {Math.round(candidate.confidence * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Parameter Table */}
        <ParamTable parameters={safeResult.parameters} />

        {/* Disclaimer Warning */}
        {safeResult.disclaimer && (
          <div
            className="rounded-xl p-4 flex items-start gap-3"
            style={{ backgroundColor: '#fffbeb', border: '1px solid #fcd34d' }}
          >
            <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" style={{ color: '#f59e0b' }} />
            <p className="text-sm" style={{ color: '#92400e' }}>
              {safeResult.disclaimer}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div
        className="mt-4 pt-4 flex flex-wrap gap-2"
        style={{ borderTop: '1px solid #e5e7eb' }}
      >
        {/* Copy Citations */}
        <CopyCitations
          parameters={safeResult.parameters}
          productName={safeResult.entities.product_name || undefined}
          categoryCode={safeResult.category_code}
          categoryName={safeResult.category_name}
          confidence={safeResult.confidence}
        />

        {/* Export PDF */}
        <PdfExport
          result={safeResult}
          productName={safeResult.entities.product_name || undefined}
        />

        {/* Save to History */}
        <button
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all"
          style={{
            backgroundColor: 'white',
            border: '2px solid #10b981',
            color: '#10b981',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#d1fae5'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white'
          }}
        >
          <Save size={16} />
          <span>Save</span>
        </button>

        {/* New Query */}
        <button
          onClick={onNewQuery}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all"
          style={{
            backgroundColor: 'white',
            border: '2px solid #4F6EF7',
            color: '#4F6EF7',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#eff6ff'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white'
          }}
        >
          <RotateCcw size={16} />
          <span>New Query</span>
        </button>
      </div>
    </div>
  )
}