/**
 * ParamAI Frontend — TypeScript Type Definitions
 * AI-Powered BPOM Food Testing Parameter Recommendation System
 *
 * Competition: AI Open Innovation Challenge 2026
 * Team: Kebut Semalam, President University
 */

// =============================================================================
// Input Types
// =============================================================================

export interface ProductInput {
  product_name: string
  ingredients: string
  production_method: string
  target_consumer: string
  health_claims: string
}

// =============================================================================
// Parameter Types
// =============================================================================

export type ParameterType =
  | 'chemical'
  | 'microbiological'
  | 'heavy_metal'
  | 'labeling'
  | 'physical'
  | 'contaminant'

export interface Parameter {
  name: string
  standard: string
  regulation: string
  type: ParameterType
}

// =============================================================================
// Recommendation Types
// =============================================================================

export interface CandidateCategory {
  code: string
  name: string
  confidence: number
}

export interface ProductEntities {
  product_name: string | null
  ingredients: string[]
  ingredient_categories: string[]
  production_method: string | null
  production_keywords: string[]
  target_consumer: string | null
  health_claims: string[]
  product_form: string | null
}

export interface RecommendationResult {
  category_code: string
  category_name: string
  confidence: number
  review_flag: boolean
  candidates: CandidateCategory[]
  parameters: Parameter[]
  entities: ProductEntities
  disclaimer: string
}

// =============================================================================
// History Types
// =============================================================================

export interface HistoryItem {
  id: string
  timestamp: string
  input_summary: string      // from backend (renamed to match actual backend field)
  product_name?: string     // filled by frontend from input_summary
  category_code: string     // from backend 'category_code'
  category_name: string     // filled by frontend from category_code mapping
  confidence: number
  review_flag: boolean
  parameters_count?: number  // optional, from backend
}

export interface HistoryResponse {
  total: number
  history: HistoryItem[]
}

// =============================================================================
// Category Types
// =============================================================================

export interface Category {
  code: string
  name: string
  description: string
  parameter_count?: number
}

export interface CategoriesResponse {
  categories: Category[]
  total: number
}

// =============================================================================
// API Response Types
// =============================================================================

export interface ApiError {
  detail: string
}

export interface HealthResponse {
  status: string
  service: string
  timestamp?: string
}
