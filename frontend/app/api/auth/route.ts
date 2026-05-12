/**
 * ParamAI Frontend — Auth API Route
 * Handles login/logout for admin and guest access
 * Uses HMAC-signed cookies (no server-side session store needed)
 *
 * Competition: AI Open Innovation Challenge 2026
 * Team: Kebut Semalam, President University
 */

import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'

// Environment variables
const ADMIN_CREDENTIALS = process.env.ADMIN_CREDENTIALS || 'admin:ParamAI2026'
const SESSION_SECRET = process.env.SESSION_SECRET || 'paramai-secret-key-2026'
const COOKIE_NAME = 'paramai_auth'

// Cookie payload structure: base64(role:expiry:username?:)
function createSignedCookie(payload: string): string {
  const signature = createHmac('sha256', SESSION_SECRET).update(payload).digest('hex')
  const data = Buffer.from(`${payload}:${signature}`).toString('base64')
  return data
}

function verifySignedCookie(cookie: string): { role: string; expiry: number; username?: string } | null {
  try {
    const decoded = Buffer.from(cookie, 'base64').toString('utf-8')
    const lastColonIdx = decoded.lastIndexOf(':')
    const dataWithSig = decoded.substring(0, lastColonIdx)
    const providedSig = decoded.substring(lastColonIdx + 1)

    const expectedSig = createHmac('sha256', SESSION_SECRET).update(dataWithSig).digest('hex')

    if (providedSig !== expectedSig) {
      return null // Tampered
    }

    const [role, expiryStr, ...rest] = dataWithSig.split(':')
    const expiry = parseInt(expiryStr, 10)

    if (Date.now() > expiry) {
      return null // Expired
    }

    return {
      role,
      expiry,
      username: rest.length > 0 ? rest.join(':') : undefined,
    }
  } catch {
    return null
  }
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

    if (role === 'guest') {
      const expiry = Date.now() + 24 * 60 * 60 * 1000
      const payload = `guest:${expiry}`
      const signed = createSignedCookie(payload)

      const response = NextResponse.json({
        success: true,
        role: 'guest',
        message: 'Welcome, Guest!',
      })
      response.cookies.set(COOKIE_NAME, signed, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24,
      })
      return response
    }

    if (role === 'admin') {
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

      const expiry = Date.now() + 12 * 60 * 60 * 1000
      const payload = `admin:${expiry}:${username}`
      const signed = createSignedCookie(payload)

      const response = NextResponse.json({
        success: true,
        role: 'admin',
        username,
        message: 'Welcome, Admin!',
      })
      response.cookies.set(COOKIE_NAME, signed, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 12,
      })
      return response
    }

    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out' })
  response.cookies.delete(COOKIE_NAME)
  return response
}

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get(COOKIE_NAME)?.value

  if (!cookie) {
    return NextResponse.json({ authenticated: false, role: null }, { status: 401 })
  }

  const session = verifySignedCookie(cookie)

  if (!session) {
    return NextResponse.json({ authenticated: false, role: null }, { status: 401 })
  }

  return NextResponse.json({
    authenticated: true,
    role: session.role,
    username: session.username,
  })
}
