'use client'

/**
 * ParamAI Frontend — Product Form Component
 * LEFT panel of the Simulator page
 *
 * Competition: AI Open Innovation Challenge 2026
 * Team: Group 1, President University
 */

import { useState } from 'react'
import { Loader2, ArrowRight } from 'lucide-react'
import { ProductInput } from '@/lib/types'

// Sample products for quick fill
const SAMPLE_PRODUCTS = [
  {
    name: 'Choc Biscuit',
    data: {
      product_name: 'Chocolate Oat Biscuit',
      ingredients: 'oat flour, cocoa powder, vegetable fat, sugar, salt, baking powder',
      production_method: 'baked at 180 degrees celsius for 15 minutes',
      target_consumer: 'general public, children above 3 years',
      health_claims: 'high fiber, no artificial colors',
    },
  },
  {
    name: 'Mango Juice',
    data: {
      product_name: 'Mango Juice Drink',
      ingredients: 'mango puree, water, sugar, citric acid, vitamin C',
      production_method: 'pasteurized and packed in bottles',
      target_consumer: 'all ages',
      health_claims: 'natural fruit, vitamin C source',
    },
  },
  {
    name: 'Whey Protein',
    data: {
      product_name: 'Whey Protein Powder',
      ingredients: 'whey protein concentrate, emulsifier, artificial sweetener',
      production_method: 'spray dried and packaged in cans',
      target_consumer: 'fitness enthusiasts, adults',
      health_claims: 'high protein, muscle recovery, low fat',
    },
  },
  {
    name: 'Beef Sausage',
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
    // Only submit if at least product_name is filled
    if (formData.product_name.trim()) {
      onSubmit(formData)
    }
  }

  const isFormValid = formData.product_name.trim().length > 0

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Product Description
        </h2>
        <p className="text-sm text-gray-500">
          Describe your product to get BPOM parameter recommendations
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="space-y-4 flex-1">
          {/* Product Name */}
          <div>
            <label
              htmlFor="product_name"
              className="block text-sm font-medium text-gray-700 mb-1"
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
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         placeholder-gray-400 transition-all"
              disabled={isLoading}
            />
          </div>

          {/* Ingredients */}
          <div>
            <label
              htmlFor="ingredients"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ingredients <span className="text-gray-400">(comma-separated)</span>
            </label>
            <input
              type="text"
              id="ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleInputChange}
              placeholder="e.g., flour, sugar, cocoa powder, butter"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         placeholder-gray-400 transition-all"
              disabled={isLoading}
            />
          </div>

          {/* Production Method */}
          <div>
            <label
              htmlFor="production_method"
              className="block text-sm font-medium text-gray-700 mb-1"
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
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         placeholder-gray-400 transition-all"
              disabled={isLoading}
            />
          </div>

          {/* Target Consumer */}
          <div>
            <label
              htmlFor="target_consumer"
              className="block text-sm font-medium text-gray-700 mb-1"
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
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         placeholder-gray-400 transition-all"
              disabled={isLoading}
            />
          </div>

          {/* Health Claims */}
          <div>
            <label
              htmlFor="health_claims"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Health Claims <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              id="health_claims"
              name="health_claims"
              value={formData.health_claims}
              onChange={handleInputChange}
              placeholder="e.g., high fiber, probiotic, natural"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         placeholder-gray-400 transition-all"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Sample Products */}
        <div className="mt-4 mb-4">
          <p className="text-xs text-gray-500 mb-2">Try sample products:</p>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PRODUCTS.map((sample) => (
              <button
                key={sample.name}
                type="button"
                onClick={() => handleSampleProduct(sample)}
                disabled={isLoading}
                className="px-3 py-1.5 text-xs font-medium rounded-full
                           border border-gray-200 text-gray-600
                           hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600
                           transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
          className={`
            w-full py-3.5 px-6 rounded-xl font-semibold text-white
            flex items-center justify-center gap-2
            transition-all duration-200
            ${
              isFormValid && !isLoading
                ? 'bg-gradient-to-r from-[#4F6EF7] to-[#6B83F8] hover:shadow-lg hover:scale-[1.02] cursor-pointer'
                : 'bg-gray-300 cursor-not-allowed'
            }
          `}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <span>Analyze Product</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  )
}