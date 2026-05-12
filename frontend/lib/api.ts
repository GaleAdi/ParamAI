/**
 * ParamAI Frontend — API Client
 * Handles all communication with the ParamAI backend API
 *
 * Competition: AI Open Innovation Challenge 2026
 * Team: Kebut Semalam, President University
 */

import {
  Category,
  CategoriesResponse,
  HistoryItem,
  HistoryResponse,
  ProductInput,
  RecommendationResult,
} from './types'

// Get API base URL from environment
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')

// =============================================================================
// Custom Error Class
// =============================================================================

export class ApiException extends Error {
  status: number
  message: string

  constructor(message: string, status: number = 500) {
    super(message)
    this.name = 'ApiException'
    this.status = status
    this.message = message
  }
}

// =============================================================================
// API Helper Functions
// =============================================================================

/**
 * Make a fetch request with error handling
 */
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    // Parse response
    const data = await response.json()

    // Check for API error response
    if (!response.ok) {
      let errorMessage = data.detail || `API Error: ${response.status}`

      // Provide helpful messages for common error codes
      if (response.status === 502 || response.status === 504) {
        errorMessage = 'Backend is starting up (Railway cold start). Please wait a moment and try again.'
      } else if (response.status === 404) {
        errorMessage = 'API endpoint not found. Please check if the backend is running.'
      } else if (response.status === 500) {
        errorMessage = 'Backend server error. Please try again in a moment.'
      }

      throw new ApiException(errorMessage, response.status)
    }

    return data as T
  } catch (error) {
    if (error instanceof ApiException) {
      throw error
    }
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiException(
        'Unable to connect to the server. Please check your internet connection.',
        0
      )
    }
    throw new ApiException(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      500
    )
  }
}

// =============================================================================
// Category API Functions
// =============================================================================

/**
 * Get all available BPOM categories
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetchApi<CategoriesResponse>('/categories')
    return response.categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

// =============================================================================
// Recommendation API Functions
// =============================================================================

/**
 * Submit a product for classification and get recommendation
 */
export async function recommend(
  input: ProductInput
): Promise<RecommendationResult> {
  try {
    const result = await fetchApi<RecommendationResult>('/recommend', {
      method: 'POST',
      body: JSON.stringify(input),
    })
    return result
  } catch (error) {
    console.error('Error submitting recommendation request:', error)
    throw error
  }
}

/**
 * Test entity extraction only (calls /classify endpoint)
 */
export async function classifyProduct(
  description: string
): Promise<Record<string, unknown>> {
  try {
    const result = await fetchApi<Record<string, unknown>>('/classify', {
      method: 'POST',
      body: JSON.stringify({ description }),
    })
    return result
  } catch (error) {
    console.error('Error classifying product:', error)
    throw error
  }
}

// =============================================================================
// History API Functions
// =============================================================================

/**
 * Get query history
 */
export async function getHistory(): Promise<HistoryItem[]> {
  try {
    const response = await fetchApi<HistoryResponse>('/recommend/history')
    return response.history
  } catch (error) {
    console.error('Error fetching history:', error)
    throw error
  }
}

/**
 * Clear query history
 */
export async function clearHistory(): Promise<{ status: string; message: string }> {
  try {
    const result = await fetchApi<{ status: string; message: string }>(
      '/recommend/history',
      { method: 'DELETE' }
    )
    return result
  } catch (error) {
    console.error('Error clearing history:', error)
    throw error
  }
}

// =============================================================================
// Health Check API Functions
// =============================================================================

/**
 * Check if the API is healthy
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
    })
    return response.ok
  } catch {
    return false
  }
}

// =============================================================================
// Regulations API Functions
// =============================================================================

export interface RegulationsResponse {
  version: string
  last_updated: string
  source_regulations: string[]
  categories_count: number
  metadata: {
    maintainer?: string
    contact?: string
    competition?: string
    next_update?: string
  }
}

/**
 * Get BPOM regulations information
 */
export async function getRegulations(): Promise<RegulationsResponse> {
  try {
    const result = await fetchApi<RegulationsResponse>('/regulations')
    return result
  } catch (error) {
    console.error('Error fetching regulations:', error)
    throw error
  }
}

// =============================================================================
// Stats API Functions (Admin Only)
// =============================================================================

export interface StatsResponse {
  total_requests: number
  total_input_tokens: number
  total_output_tokens: number
  total_cost_usd: number
  average_cost_per_request: number
  last_request_at: string | null
  server_started_at: string
  history_count: number
  pricing_model: {
    model: string
    per_1m_input_usd: number
    per_1m_output_usd: number
  }
}

/**
 * Get API usage statistics and cost metrics (admin dashboard)
 */
export async function getStats(): Promise<StatsResponse> {
  try {
    const result = await fetchApi<StatsResponse>('/stats')
    return result
  } catch (error) {
    console.error('Error fetching stats:', error)
    throw error
  }
}
