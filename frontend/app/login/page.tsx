'use client'

/**
 * ParamAI Frontend — Login Page
 * Dual authentication: Admin (full access) or Guest (limited access)
 *
 * Competition: AI Open Innovation Challenge 2026
 * Team: Kebut Semalam, President University
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, User, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role: 'admin' }),
      })

      const data = await res.json()

      if (res.ok) {
        window.location.href = '/dashboard'
      } else {
        setError(data.error || 'Login failed')
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGuestLogin = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'guest' }),
      })

      if (res.ok) {
        window.location.href = '/simulator'
      } else {
        setError('Guest login failed')
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
    >
      <div
        className="w-full max-w-md mx-4 rounded-2xl overflow-hidden"
        style={{ backgroundColor: 'white', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
      >
        {/* Header Banner */}
        <div
          className="px-8 py-10 text-center"
          style={{
            background: 'linear-gradient(135deg, #384884 0%, #4F6EF7 50%, #6B83F8 100%)',
          }}
        >
          {/* Logo */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4"
            style={{
              background: 'linear-gradient(135deg, #4F6EF7 0%, #8B5CF6 100%)',
            }}
          >
            P
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">ParamAI</h1>
          <p className="text-white/70 text-sm">BPOM Testing Parameter Recommendation</p>
          <p className="text-white/50 text-xs mt-2">AI Open Innovation Challenge 2026</p>
        </div>

        {/* Login Form */}
        <div className="px-8 py-8">
          {/* Tab Switcher */}
          <div
            className="flex rounded-xl p-1 mb-6"
            style={{ backgroundColor: '#f3f4f6' }}
          >
            <button
              onClick={() => { setIsAdmin(false); setError('') }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                !isAdmin ? 'text-white' : 'text-gray-500'
              }`}
              style={!isAdmin ? { backgroundColor: '#4F6EF7' } : {}}
            >
              <User size={16} />
              Guest Access
            </button>
            <button
              onClick={() => { setIsAdmin(true); setError('') }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isAdmin ? 'text-white' : 'text-gray-500'
              }`}
              style={isAdmin ? { backgroundColor: '#4F6EF7' } : {}}
            >
              <Shield size={16} />
              Admin
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="mb-4 p-3 rounded-lg text-sm text-center"
              style={{ backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' }}
            >
              {error}
            </div>
          )}

          {/* Guest Login */}
          {!isAdmin && (
            <div className="space-y-4">
              <div
                className="p-4 rounded-xl text-center"
                style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
              >
                <p className="text-sm font-medium mb-2" style={{ color: '#374151' }}>
                  Welcome, Guest
                </p>
                <p className="text-xs mb-4" style={{ color: '#6b7280' }}>
                  Access the product simulator and history. Dashboard analytics are reserved for admin only.
                </p>
                <ul className="text-left text-xs space-y-1 mb-4" style={{ color: '#6b7280' }}>
                  <li className="flex items-center gap-2">
                    <span style={{ color: '#10b981' }}>✓</span> Product Classification Simulator
                  </li>
                  <li className="flex items-center gap-2">
                    <span style={{ color: '#10b981' }}>✓</span> Query History
                  </li>
                  <li className="flex items-center gap-2">
                    <span style={{ color: '#9ca3af' }}>✗</span> Dashboard Analytics (Admin Only)
                  </li>
                  <li className="flex items-center gap-2">
                    <span style={{ color: '#9ca3af' }}>✗</span> API Cost Stats (Admin Only)
                  </li>
                </ul>
              </div>

              <button
                onClick={handleGuestLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold transition-all disabled:opacity-50"
                style={{ backgroundColor: '#384884' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2d3a5c')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#384884')}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Continue as Guest
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Admin Login */}
          {isAdmin && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>
                  Username
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm border transition-colors focus:outline-none focus:ring-2"
                    style={{
                      borderColor: '#e5e7eb',
                      backgroundColor: 'white',
                    }}
                    placeholder="Enter username"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-xl text-sm border transition-colors focus:outline-none focus:ring-2"
                    style={{
                      borderColor: '#e5e7eb',
                      backgroundColor: 'white',
                    }}
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold transition-all disabled:opacity-50"
                style={{ backgroundColor: '#4F6EF7' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#384884')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4F6EF7')}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Shield size={18} />
                    Login as Admin
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer Note */}
          <p className="text-center text-xs mt-6" style={{ color: '#9ca3af' }}>
            {isAdmin ? (
              'Admin access reserved for authorized personnel only.'
            ) : (
              <>
                By continuing, you agree to the{' '}
                <span style={{ color: '#4F6EF7' }}>terms of use</span>.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
