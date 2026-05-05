/**
 * ParamAI Frontend — API Route Handler
 * Proxies requests to the FastAPI backend
 *
 * This allows Vercel frontend to work with Railway backend
 */

import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Cache for categories (they don't change often)
let categoriesCache: { data: unknown; timestamp: number } | null = null
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const endpoint = searchParams.get('endpoint') || ''

  // Route: /api/recommend?endpoint=/categories
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('API proxy error:', error)
    return NextResponse.json(
      { detail: 'Failed to connect to backend server' },
      { status: 502 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const endpoint = body.endpoint || '/recommend'

    // Forward to backend
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body.data || body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('API proxy error:', error)
    return NextResponse.json(
      { detail: 'Failed to connect to backend server' },
      { status: 502 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const response = await fetch(`${API_BASE_URL}/recommend/history`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('API proxy error:', error)
    return NextResponse.json(
      { detail: 'Failed to connect to backend server' },
      { status: 502 }
    )
  }
}