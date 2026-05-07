'use client'

/**
 * ParamAI Frontend — Product Form Component
 * LEFT panel of the Simulator page
 * Design: Clean white card with professional SaaS aesthetic
 *
 * Competition: AI Open Innovation Challenge 2026
 * Team: Group 1, President University
 */

import { useState } from 'react'
import { Loader2, ArrowRight, Beaker } from 'lucide-react'
import { ProductInput } from '@/lib/types'

// Sample products for quick fill
const SAMPLE_PRODUCTS = [
  {
    name: 'Biscuit',
    data: {
      product_name: 'Chocolate Oat Biscuit',
      ingredients: 'oat flour, cocoa powder, vegetable fat, sugar, salt, baking powder',
      production_method: 'baked at 180 degrees celsius for 15 minutes',
      target_consumer: 'general public, children above 3 years',
      health_claims: 'high fiber, no artificial colors',
    },
  },
  {
    name: 'Juice',
    data: {
      product_name: 'Mango Juice Drink',
      ingredients: 'mango puree, water, sugar, citric acid, vitamin C',
      production_method: 'pasteurized and packed in bottles',
      target_consumer: 'all ages',
      health_claims: 'natural fruit, vitamin C source',
    },
  },
  {
    name: 'Protein',
    data: {
      product_name: 'Whey Protein Powder',
      ingredients: 'whey protein concentrate, emulsifier, artificial sweetener',
      production_method: 'spray dried and packaged in cans',
      target_consumer: 'fitness enthusiasts, adults',
      health_claims: 'high protein, muscle recovery, low fat',
    },
  },
  {
    name: 'Sausage',
    data: {
      product_name: 'Beef Sausage',
      ingredients: 'beef meat, salt, sugar, nitrite, spices, soy protein',
      production_method: 'chopped, mixed, stuffed in casing, smoked and cooked',
      target_consumer: 'general public',
      health_claims: 'no preservatives added',
    },
  },
  {
    name: 'Yogurt',
    data: {
      product_name: 'Strawberry Yogurt',
      ingredients: 'milk, strawberry puree, sugar, live cultures, stabilizer',
      production_method: 'fermented with lactobacillus cultures at 37 degrees celsius',
      target_consumer: 'children and adults',
      health_claims: 'probiotic, good for digestion, calcium source',
    },
  },
]

interface ProductFormProps {
  onSubmit: (input: ProductInput) => void
  isLoading: boolean
}

export default function ProductForm({ onSubmit, isLoading }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductInput>({
    product_name: '',
    ingredients: '',
    production_method: '',
    target_consumer: '',
    health_claims: '',
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSampleProduct = (sample: typeof SAMPLE_PRODUCTS[0]) => {
    setFormData(sample.data)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.product_name.trim()) {
      onSubmit(formData)
    }
  }

  const isFormValid = formData.product_name.trim().length > 0

  return (
    <div
      className="rounded-2xl p-6 h-full flex flex-col"
      style={{
        backgroundColor: 'white',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #4F6EF7 0%, #8B5CF6 100%)',
            }}
          >
            <Beaker size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: '#1a1a2e' }}>
              Product Analysis
            </h2>
            <p className="text-sm" style={{ color: '#6b7280' }}>
              Enter product details for BPOM parameter recommendations
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="space-y-4 flex-1">
          {/* Product Name */}
          <div>
            <label
              htmlFor="product_name"
              className="block text-sm font-semibold mb-2"
              style={{ color: '#1a1a2e' }}
            >
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="product_name"
              name="product_name"
              value={formData.product_name}
              onChange={handleInputChange}
              placeholder="e.g., Chocolate Oat Biscuit"
              className="w-full px-4 py-3 border rounded-xl text-sm transition-all duration-200"
              style={{
                borderColor: '#e5e7eb',
                backgroundColor: '#f9fafb',
              }}
              disabled={isLoading}
            />
          </div>

          {/* Ingredients */}
          <div>
            <label
              htmlFor="ingredients"
              className="block text-sm font-semibold mb-2"
              style={{ color: '#1a1a2e' }}
            >
              Ingredients <span className="font-normal text-gray-400">(comma-separated)</span>
            </label>
            <input
              type="text"
              id="ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleInputChange}
              placeholder="e.g., flour, sugar, cocoa powder, butter"
              className="w-full px-4 py-3 border rounded-xl text-sm transition-all duration-200"
              style={{
                borderColor: '#e5e7eb',
                backgroundColor: '#f9fafb',
              }}
              disabled={isLoading}
            />
          </div>

          {/* Production Method */}
          <div>
            <label
              htmlFor="production_method"
              className="block text-sm font-semibold mb-2"
              style={{ color: '#1a1a2e' }}
            >
              Production Method
            </label>
            <input
              type="text"
              id="production_method"
              name="production_method"
              value={formData.production_method}
              onChange={handleInputChange}
              placeholder="e.g., baked at 180°C, fermented, pasteurized"
              className="w-full px-4 py-3 border rounded-xl text-sm transition-all duration-200"
              style={{
                borderColor: '#e5e7eb',
                backgroundColor: '#f9fafb',
              }}
              disabled={isLoading}
            />
          </div>

          {/* Target Consumer */}
          <div>
            <label
              htmlFor="target_consumer"
              className="block text-sm font-semibold mb-2"
              style={{ color: '#1a1a2e' }}
            >
              Target Consumer
            </label>
            <input
              type="text"
              id="target_consumer"
              name="target_consumer"
              value={formData.target_consumer}
              onChange={handleInputChange}
              placeholder="e.g., children, adults, elderly"
              className="w-full px-4 py-3 border rounded-xl text-sm transition-all duration-200"
              style={{
                borderColor: '#e5e7eb',
                backgroundColor: '#f9fafb',
              }}
              disabled={isLoading}
            />
          </div>

          {/* Health Claims */}
          <div>
            <label
              htmlFor="health_claims"
              className="block text-sm font-semibold mb-2"
              style={{ color: '#1a1a2e' }}
            >
              Health Claims <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              id="health_claims"
              name="health_claims"
              value={formData.health_claims}
              onChange={handleInputChange}
              placeholder="e.g., high fiber, probiotic, natural"
              className="w-full px-4 py-3 border rounded-xl text-sm transition-all duration-200"
              style={{
                borderColor: '#e5e7eb',
                backgroundColor: '#f9fafb',
              }}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Sample Products */}
        <div className="mt-4 mb-4">
          <p className="text-xs font-medium mb-2" style={{ color: '#6b7280' }}>
            Try sample products:
          </p>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PRODUCTS.map((sample) => (
              <button
                key={sample.name}
                type="button"
                onClick={() => handleSampleProduct(sample)}
                disabled={isLoading}
                className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200"
                style={{
                  border: '1px solid #e5e7eb',
                  color: '#6b7280',
                  backgroundColor: 'white',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#4F6EF7'
                  e.currentTarget.style.color = '#4F6EF7'
                  e.currentTarget.style.backgroundColor = '#eff6ff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb'
                  e.currentTarget.style.color = '#6b7280'
                  e.currentTarget.style.backgroundColor = 'white'
                }}
              >
                {sample.name}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className="
            w-full py-4 px-6 rounded-xl font-semibold text-white
            flex items-center justify-center gap-2
            transition-all duration-200
          "
          style={
            isFormValid && !isLoading
              ? {
                  background: 'linear-gradient(135deg, #4F6EF7 0%, #6B83F8 100%)',
                  boxShadow: '0 4px 6px -1px rgba(79, 110, 247, 0.3)',
                }
              : { backgroundColor: '#d1d5db' }
          }
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Analyzing Product...</span>
            </>
          ) : (
            <>
              <span>Analyze Product</span>
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </form>
    </div>
  )
}