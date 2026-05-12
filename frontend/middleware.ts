/**
 * ParamAI Frontend — Auth Middleware
 * Protects routes based on user role
 *
 * Competition: AI Open Innovation Challenge 2026
 * Team: Kebut Semalam, President University
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require admin authentication
const ADMIN_ROUTES = ['/dashboard', '/summary']

// Routes accessible to everyone (including guests)
const PUBLIC_ROUTES = ['/login', '/api/auth', '/simulator', '/history', '/help', '/']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get('paramai_session')

  // Allow public routes
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Allow static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Check authentication for admin routes
  if (ADMIN_ROUTES.some(route => pathname.startsWith(route))) {
    if (!sessionCookie) {
      // Not logged in - redirect to login
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Session exists - but we need server validation for sensitive routes
    // For now, we pass through and let the page handle validation
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}