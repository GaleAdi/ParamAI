/**
 * ParamAI Frontend — Auth API Route
 * Handles login/logout for admin and guest access
 *
 * Competition: AI Open Innovation Challenge 2026
 * Team: Kebut Semalam, President University
 */

import { NextRequest, NextResponse } from 'next/server'

// Admin credentials from environment variable
// Format: "username:password,username2:password2" or just single "username:password"
const ADMIN_CREDENTIALS = process.env.ADMIN_CREDENTIALS || 'admin:ParamAI2026'
const SESSION_SECRET = process.env.SESSION_SECRET || 'paramai-secret-key-2026'

// Simple session store (in production, use Redis or database)
const sessions: Record<string, { role: string; username?: string; expires: number }> = {}

function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
}

function validateAdminCredentials(username: string, password: string): boolean {
  const validUsers = ADMIN_CREDENTIALS.split(',').map(cred => {
    const [user, pass] = cred.trim().split(':')
    return { username: user?.trim(), password: pass?.trim() }
  })

  return validUsers.some(cred => cred.username === username && cred.password === password)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { role, username, password } = body

    // Clean expired sessions
    const now = Date.now()
    Object.keys(sessions).forEach(sessionId => {
      if (sessions[sessionId].expires < now) {
        delete sessions[sessionId]
      }
    })

    if (role === 'guest') {
      // Guest login - no credentials needed
      const sessionId = generateSessionId()
      sessions[sessionId] = {
        role: 'guest',
        expires: now + 24 * 60 * 60 * 1000, // 24 hours
      }

      const response = NextResponse.json({
        success: true,
        role: 'guest',
        message: 'Welcome, Guest!'
      })

      response.cookies.set('paramai_session', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // 24 hours
      })

      return response
    }

    if (role === 'admin') {
      // Admin login - validate credentials
      if (!username || !password) {
        return NextResponse.json(
          { error: 'Username and password required' },
          { status: 400 }
        )
      }

      if (!validateAdminCredentials(username, password)) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        )
      }

      const sessionId = generateSessionId()
      sessions[sessionId] = {
        role: 'admin',
        username,
        expires: now + 12 * 60 * 60 * 1000, // 12 hours for admin
      }

      const response = NextResponse.json({
        success: true,
        role: 'admin',
        username,
        message: 'Welcome, Admin!'
      })

      response.cookies.set('paramai_session', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 12, // 12 hours
      })

      return response
    }

    return NextResponse.json(
      { error: 'Invalid role' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const sessionId = request.cookies.get('paramai_session')?.value

  if (sessionId && sessions[sessionId]) {
    delete sessions[sessionId]
  }

  const response = NextResponse.json({ success: true, message: 'Logged out' })
  response.cookies.delete('paramai_session')

  return response
}

export async function GET(request: NextRequest) {
  const sessionId = request.cookies.get('paramai_session')?.value
  const now = Date.now()

  if (!sessionId || !sessions[sessionId] || sessions[sessionId].expires < now) {
    return NextResponse.json(
      { authenticated: false, role: null },
      { status: 401 }
    )
  }

  return NextResponse.json({
    authenticated: true,
    role: sessions[sessionId].role,
    username: sessions[sessionId].username,
  })
}
