'use client'

/**
 * ParamAI Frontend — Client Layout
 * Contains AuthProvider and conditional layout rendering
 *
 * Competition: AI Open Innovation Challenge 2026
 * Team: Kebut Semalam, President University
 */

import { AuthProvider, useAuth } from '@/lib/useAuth'
import Sidebar from '@/components/Sidebar'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

// Protected routes that require admin
const ADMIN_ROUTES = ['/dashboard', '/summary']

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading } = useAuth()

  const isLoginPage = pathname === '/login'
  const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route))

  useEffect(() => {
    // Skip auth check on login page
    if (isLoginPage) return

    // Wait for auth to load
    if (loading) return

    // If not authenticated, redirect to login
    if (!user.authenticated) {
      router.push('/login')
      return
    }

    // If accessing admin route without admin role, redirect to simulator
    if (isAdminRoute && user.role !== 'admin') {
      router.push('/simulator')
    }
  }, [user, loading, isLoginPage, isAdminRoute, pathname])

  // Show nothing while loading auth
  if (loading && !isLoginPage) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#D8DAE7' }}>
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 animate-pulse"
            style={{
              background: 'linear-gradient(135deg, #4F6EF7 0%, #8B5CF6 100%)',
            }}
          >
            P
          </div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't show sidebar on login page
  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <>
      {/* Sidebar Navigation - Fixed Left */}
      <Sidebar />

      {/* Main Content Area - With margin to account for sidebar */}
      <main
        className="min-h-screen"
        style={{ marginLeft: '240px', backgroundColor: '#D8DAE7' }}
      >
        {children}
      </main>

      {/* Footer Bar */}
      <footer
        className="fixed bottom-0 right-0 flex items-center justify-end px-6 py-3 text-white text-xs"
        style={{
          marginLeft: '240px',
          backgroundColor: '#2d3a5c',
          width: 'calc(100% - 240px)',
        }}
      >
        <div className="flex items-center gap-4">
          <span className="text-white/60">Team Kebut Semalam - President University</span>
          <span
            className="px-2 py-1 rounded text-[10px] font-semibold"
            style={{ backgroundColor: '#4F6EF7' }}
          >
            v1.0.0
          </span>
        </div>
      </footer>
    </>
  )
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LayoutContent>{children}</LayoutContent>
    </AuthProvider>
  )
}