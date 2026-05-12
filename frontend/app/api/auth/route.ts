/**
 * ParamAI Frontend — Auth API Route
 * Handles login/logout for admin and guest access
 *
 * Competition: AI Open Innovation Challenge 2026
 * Team: Kebut Semalam, President University
 */

import { NextRequest, NextResponse } from 'next/server'

const ADMIN_CREDENTIALS = process.env.ADMIN_CREDENTIALS || 'admin:ParamAI2026'

function validateAdminCredentials(username: string, password: string): boolean {
  return ADMIN_CREDENTIALS.split(',').some(cred => {
    const [user, pass] = cred.trim().split(':')
    return user?.trim() === username && pass?.trim() === password
  })
}

// Simple auth token: base64(role:username:expiry) — no server-side state needed
function createToken(role: string, username?: string): string {
  const expiry = Date.now() + (role === 'admin' ? 12 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)
  const data = `${role}:${username || ''}:${expiry}`
  return Buffer.from(data).toString('base64')
}

function verifyToken(token: string): { role: string; username?: string } | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const [role, username, expiryStr] = decoded.split(':')
    const expiry = parseInt(expiryStr, 10)
    if (!role || !expiry || Date.now() > expiry) return null
    return { role, username: username || undefined }
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { role, username, password } = body

    if (role === 'guest') {
      const token = createToken('guest')
      return NextResponse.json({ success: true, role: 'guest', token })
    }

    if (role === 'admin') {
      if (!username || !password) {
        return NextResponse.json({ error: 'Username and password required' }, { status: 400 })
      }
      if (!validateAdminCredentials(username, password)) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }
      const token = createToken('admin', username)
      return NextResponse.json({ success: true, role: 'admin', username, token })
    }

    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE() {
  return NextResponse.json({ success: true })
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    return NextResponse.json({ authenticated: false, role: null })
  }

  const session = verifyToken(token)
  if (!session) {
    return NextResponse.json({ authenticated: false, role: null })
  }

  return NextResponse.json({
    authenticated: true,
    role: session.role,
    username: session.username,
  })
}
