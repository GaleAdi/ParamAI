'use client'

/**
 * ParamAI Frontend — Dashboard Page
 * Main dashboard with KPIs and visualizations
 * Design: Professional SaaS with silver-blue background
 *
 * Competition: AI Open Innovation Challenge 2026
 * Team: Group 1, President University
 */

import Dashboard from '@/components/Dashboard'

export default function DashboardPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#D8DAE7' }}>
      {/* Page Header */}
      <div
        className="px-6 py-5"
        style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <h1 className="text-2xl font-bold" style={{ color: '#1a1a2e' }}>
          Good morning, Team!
        </h1>
        <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
          Here's what's happening with ParamAI today
        </p>
      </div>

      {/* Dashboard Content */}
      <div className="p-6">
        <Dashboard />
      </div>

      {/* Footer Spacer */}
      <div style={{ height: '48px' }}></div>
    </div>
  )
}