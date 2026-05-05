'use client'

/**
 * ParamAI Frontend — Result Card Component
 * RIGHT panel of the Simulator page
 * Shows full recommendation output
 *
 * Competition: AI Open Innovation Challenge 2026
 * Team: Group 1, President University
 */

import { Loader2, FileText, Save, RotateCcw, AlertTriangle } from 'lucide-react'
import { RecommendationResult } from '@/lib/types'
import CategoryBadge from './CategoryBadge'
import ParamTable from './ParamTable'

interface ResultCardProps {
  result: RecommendationResult | null
  isLoading: boolean
  onNewQuery: () => void
}

export default function ResultCard({
  result,
  isLoading,
  onNewQuery,
}: ResultCardProps) {
  // =============================================================================
  // EMPTY STATE — No result yet
  // =============================================================================
  if (!result && !isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 h-full flex flex-col items-center justify-center text-center">
        {/* Illustration Icon */}
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9CA3AF"
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

        {/* Text */}
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          No Recommendation Yet
        </h3>
        <p className="text-sm text-gray-500 max-w-xs">
          Enter a product description and click Analyze to get BPOM parameter
          recommendations
        </p>
      </div>
    )
  }

  // =============================================================================
  // LOADING STATE — Skeleton animation
  // =============================================================================
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 h-full flex flex-col">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">Analysis Result</h2>
        </div>

        {/* Animated skeleton for category badge */}
        <div className="animate-pulse mb-4">
          <div className="h-24 bg-gray-200 rounded-xl" />
        </div>

        {/* Animated skeleton for table */}
        <div className="animate-pulse flex-1">
          <div className="h-8 bg-gray-200 rounded-t-lg mb-px" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-none mb-px last:rounded-b-lg" />
          ))}
        </div>

        {/* Loading text */}
        <div className="mt-4 text-center">
          <Loader2 size={24} className="animate-spin mx-auto text-blue-500 mb-2" />
          <p className="text-sm text-gray-500">Analyzing your product...</p>
          <p className="text-xs text-gray-400 mt-1">
            Extracting entities and matching BPOM categories
          </p>
        </div>
      </div>
    )
  }

  // =============================================================================
  // RESULT STATE — Full recommendation display
  // =============================================================================

  const handleExportPDF = () => {
    console.log('Exporting to PDF...', result)
    alert('PDF export functionality coming soon!')
  }

  const handleSaveToHistory = () => {
    console.log('Saving to history...', result)
    alert('Saved to history!')
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-full flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">Analysis Result</h2>
        <p className="text-sm text-gray-500">
          BPOM testing parameters for your product
        </p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {/* Category Badge */}
        <CategoryBadge
          category_code={result.category_code}
          category_name={result.category_name}
          confidence={result.confidence}
          review_flag={result.review_flag}
        />

        {/* Candidates (if any) */}
        {result.candidates && result.candidates.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Alternative Categories
            </h4>
            <div className="space-y-2">
              {result.candidates.slice(1).map((candidate: any, index: number) => (
                <div
                  key={candidate.code || index}
                  className="flex items-center justify-between py-1.5 px-3 bg-white rounded-lg border border-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-xs font-mono bg-gray-200 text-gray-700 rounded">
                      {candidate.code}
                    </span>
                    <span className="text-sm text-gray-700">
                      {candidate.name}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-gray-500">
                    {Math.round(candidate.confidence * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Parameter Table */}
        <ParamTable parameters={result.parameters} />

        {/* Disclaimer Warning */}
        {result.disclaimer && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle
                size={18}
                className="text-amber-500 flex-shrink-0 mt-0.5"
              />
              <p className="text-sm text-amber-800">{result.disclaimer}</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex gap-2">
          {/* Export PDF */}
          <button
            onClick={handleExportPDF}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4
                       bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium
                       rounded-xl transition-colors"
          >
            <FileText size={16} />
            <span>Export PDF</span>
          </button>

          {/* Save to History */}
          <button
            onClick={handleSaveToHistory}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4
                       bg-white border-2 border-green-500 text-green-600
                       hover:bg-green-50 text-sm font-medium rounded-xl
                       transition-colors"
          >
            <Save size={16} />
            <span>Save to History</span>
          </button>

          {/* New Query */}
          <button
            onClick={onNewQuery}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4
                       bg-white border-2 border-blue-500 text-blue-600
                       hover:bg-blue-50 text-sm font-medium rounded-xl
                       transition-colors"
          >
            <RotateCcw size={16} />
            <span>New Query</span>
          </button>
        </div>
      </div>
    </div>
  )
}