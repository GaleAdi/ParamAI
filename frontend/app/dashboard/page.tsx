'use client'

/**
 * ParamAI Frontend — Dashboard Page
 * Main dashboard with KPIs and visualizations
 *
 * Competition: AI Open Innovation Challenge 2026
 * Team: Group 1, President University
 */

import Dashboard from '@/components/Dashboard'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">
            Good morning, Team! 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Here's what's happening with ParamAI today
          </p>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <Dashboard />
      </div>
    </div>
  )
}