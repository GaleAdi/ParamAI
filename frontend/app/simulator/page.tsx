'use client'

/**
 * ParamAI Frontend — Simulator Page
 * Product form + recommendation result
 *
 * Competition: AI Open Innovation Challenge 2026
 * Team: Group 1, President University
 */

import { useState, useEffect } from 'react'
import { ProductInput, RecommendationResult } from '@/lib/types'
import { recommend, getCategories } from '@/lib/api'
import ProductForm from '@/components/ProductForm'
import ResultCard from '@/components/ResultCard'
import { Category } from '@/lib/types'

// Top bar component
function SimulatorTopbar() {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Simulator</h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter product details to get BPOM parameter recommendations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
            API Ready
          </span>
        </div>
      </div>
    </div>
  )
}

export default function SimulatorPage() {
  const [result, setResult] = useState<RecommendationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [apiStatus, setApiStatus] = useState<'checking' | 'ready' | 'error'>('checking')

  // Check API connection on mount
  useEffect(() => {
    const checkApi = async () => {
      try {
        const cats = await getCategories()
        setCategories(cats)
        setApiStatus('ready')
      } catch (error) {
        console.error('API not available:', error)
        setApiStatus('error')
      }
    }
    checkApi()
  }, [])

  const handleSubmit = async (input: ProductInput) => {
    setIsLoading(true)
    setResult(null)

    try {
      const recommendation = await recommend(input)
      setResult(recommendation)
    } catch (error) {
      console.error('Recommendation error:', error)
      // Keep result as null and show error state
      alert(`Failed to get recommendation: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewQuery = () => {
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <SimulatorTopbar />

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Product Form */}
          <div>
            <ProductForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>

          {/* Right Panel - Result Card */}
          <div>
            <ResultCard
              result={result}
              isLoading={isLoading}
              onNewQuery={handleNewQuery}
            />
          </div>
        </div>
      </div>
    </div>
  )
}