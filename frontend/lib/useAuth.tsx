'use client'

/**
 * ParamAI Frontend — Auth Context & Hook
 * Uses localStorage tokens for auth state (Vercel-compatible)
 *
 * Competition: AI Open Innovation Challenge 2026
 * Team: Kebut Semalam, President University
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AuthUser {
  role: 'admin' | 'guest' | null
  username?: string
  authenticated: boolean
}

interface AuthContextType {
  user: AuthUser
  loading: boolean
  logout: () => void
  refreshAuth: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: { role: null, authenticated: false },
  loading: true,
  logout: () => {},
  refreshAuth: () => {},
})

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>({ role: null, authenticated: false })
  const [loading, setLoading] = useState(true)

  const refreshAuth = () => {
    // Read token from localStorage (set by login page)
    const token = localStorage.getItem('paramai_token')
    if (!token) {
      setUser({ role: null, authenticated: false })
      setLoading(false)
      return
    }

    const session = verifyToken(token)
    if (session) {
      setUser({
        role: session.role as 'admin' | 'guest',
        username: session.username,
        authenticated: true,
      })
    } else {
      // Expired token — clean up
      localStorage.removeItem('paramai_token')
      localStorage.removeItem('paramai_role')
      localStorage.removeItem('paramai_username')
      setUser({ role: null, authenticated: false })
    }
    setLoading(false)
  }

  const logout = () => {
    localStorage.removeItem('paramai_token')
    localStorage.removeItem('paramai_role')
    localStorage.removeItem('paramai_username')
    setUser({ role: null, authenticated: false })
    window.location.href = '/login'
  }

  useEffect(() => {
    refreshAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export function useIsAdmin() {
  const { user } = useAuth()
  return user.role === 'admin'
}

export function useIsAuthenticated() {
  const { user } = useAuth()
  return user.authenticated
}