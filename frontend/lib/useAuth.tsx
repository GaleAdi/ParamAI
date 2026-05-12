'use client'

/**
 * ParamAI Frontend — Auth Context & Hook
 * Provides authentication state throughout the app
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
  logout: () => Promise<void>
  refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: { role: null, authenticated: false },
  loading: true,
  logout: async () => {},
  refreshAuth: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>({ role: null, authenticated: false })
  const [loading, setLoading] = useState(true)

  const refreshAuth = async () => {
    try {
      const res = await fetch('/api/auth')
      if (res.ok) {
        const data = await res.json()
        setUser({
          role: data.role,
          username: data.username,
          authenticated: data.authenticated,
        })
      } else {
        setUser({ role: null, authenticated: false })
      }
    } catch {
      setUser({ role: null, authenticated: false })
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' })
    } catch (error) {
      console.error('Logout error:', error)
    }
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

// Hook to check if user is admin
export function useIsAdmin() {
  const { user } = useAuth()
  return user.role === 'admin'
}

// Hook to check if user is authenticated (either admin or guest)
export function useIsAuthenticated() {
  const { user } = useAuth()
  return user.authenticated
}