'use client'

/**
 * ParamAI Frontend — Simulator Page
 * Product form + recommendation result
 * Design: Professional SaaS with silver-blue background
 *
 * Competition: AI Open Innovation Challenge 2026
 * Team: Group 1, President University
 */

import { useState } from 'react'
import ProductForm from '@/components/ProductForm'
import ResultCard from '@/components/ResultCard'
import ApiStatus from '@/components/ApiStatus'
import { ToastContainer, useToast } from '@/components/Toast'
import { ProductInput, RecommendationResult } from '@/lib/types'
import { recommend } from '@/lib/api'

// Top bar component
function SimulatorTopbar() {
  return (
    <div
      className="px-6 py-5 flex items-center justify-between"
      style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
      }}
    >
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold" style={{ color: '#1a1a2e' }}>
            Product Simulator
          </h1>
          <span
            className="px-3 py-1 text-xs font-semibold rounded-full"
            style={{
              backgroundColor: '#d1fae5',
              color: '#065f46',
            }}
          >
            AI-Powered
          </span>
        </div>
        <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
          Enter product details to get BPOM parameter recommendations
        </p>
      </div>
      <div className="flex items-center gap-3">
        <ApiStatus size="sm" autoRefresh={true} refreshInterval={30000} />
      </div>
    </div>
  )
}

export default function SimulatorPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<RecommendationResult | null>(null)
  const { toasts, toast, removeToast } = useToast()

  const handleSubmit = async (input: ProductInput) => {
    setIsLoading(true)
    setResult(null)

    try {
      const data = await recommend(input)
      setResult(data)
      toast.success(
        'Recommendation Ready!',
        `Category ${data.category_code} matched with ${Math.round(data.confidence * 100)}% confidence`,
        5000
      )
    } catch (error) {
      console.error('Error:', error)
      const message = error instanceof Error ? error.message : 'Unable to process your request'
      toast.error('Request Failed', message, 6000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewQuery = () => {
    setResult(null)
    toast.info('Form Reset', 'You can enter a new product now', 3000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Top Bar */}
      <SimulatorTopbar />

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 p-6" style={{ backgroundColor: '#D8DAE7' }}>
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
              showLoadingSteps={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Spacer for footer */}
      <div style={{ height: '48px' }}></div>
    </div>
  )
}