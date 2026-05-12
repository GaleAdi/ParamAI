'use client'

/**
 * ParamAI Frontend — Dashboard Component
 * Main dashboard page with KPIs, stats, and visualizations
 * Design: Professional SaaS with dark navy accents
 *
 * Competition: AI Open Innovation Challenge 2026
 * Team: Group 1, President University
 */

import { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from 'recharts'
import { CheckCircle, Clock, TrendingUp, Activity } from 'lucide-react'
import { getCategories, getHistory } from '@/lib/api'
import type { Category, HistoryItem } from '@/lib/types'

// Ring progress SVG component
function RingProgress({
  value,
  max,
  color,
  size = 80,
  strokeWidth = 8,
}: {
  value: number
  max: number
  color: string
  size?: number
  strokeWidth?: number
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const percent = Math.min((value / max) * 100, 100)
  const strokeDashoffset = circumference - (percent / 100) * circumference

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E5E7EB" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
      />
    </svg>
  )
}

// KPI Card component
function KPICard({
  value,
  label,
  subtitle,
  color,
  max = 100,
}: {
  value: number
  label: string
  subtitle: string
  color: string
  max?: number
}) {
  return (
    <div
      className="rounded-xl p-5"
      style={{
        backgroundColor: 'white',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <RingProgress value={value} max={max} color={color} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold" style={{ color: '#1a1a2e' }}>{value}</span>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>{label}</p>
          <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{subtitle}</p>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [categories, setCategories] = useState<Category[]>([])
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [cats, hist] = await Promise.all([
          getCategories(),
          getHistory(),
        ])
        setCategories(cats)
        setHistory(hist)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Calculate real KPIs from history
  const totalQueries = history.length
  const avgConfidence = history.length > 0
    ? Math.round(history.reduce((sum, h) => sum + h.confidence, 0) / history.length * 100) / 100
    : 0
  const pendingReviews = history.filter(h => h.review_flag).length
  const reviewedCount = history.length - pendingReviews
  const consistencyRate = history.length > 1 ? Math.round((reviewedCount / history.length) * 100) : 100
  const categoryCount = categories.length

  // Calculate estimated time saved (avg 25 min per query, using real count)
  const estimatedTimeSavedMinutes = totalQueries * 25
  const estimatedTimeSavedHours = Math.round(estimatedTimeSavedMinutes / 60)

  const getCategoryDistribution = () => {
    if (history.length === 0) {
      return [
        { name: '07.1', value: 30, fill: '#384884' },
        { name: '14.1', value: 25, fill: '#4F6EF7' },
        { name: 'Supp', value: 20, fill: '#6B83F8' },
        { name: '01.2', value: 15, fill: '#8B5CF6' },
        { name: '08.3', value: 10, fill: '#A78BFA' },
      ]
    }
    const distribution: Record<string, number> = {}
    history.forEach((item) => {
      const cat = item.category_code || 'Unknown'
      distribution[cat] = (distribution[cat] || 0) + 1
    })
    const total = history.length
    const colors = ['#384884', '#4F6EF7', '#6B83F8', '#8B5CF6', '#A78BFA']
    return Object.entries(distribution).slice(0, 5).map(([name, count], index) => ({
      name: name.length > 10 ? name.substring(0, 10) + '...' : name,
      value: Math.round((count / total) * 100),
      fill: colors[index] || colors[colors.length - 1],
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div
          className="w-12 h-12 rounded-full border-4 animate-spin"
          style={{ borderColor: '#4F6EF7', borderTopColor: 'transparent' }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#1a1a2e' }}>Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Overview of BPOM parameter recommendation system</p>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard value={totalQueries} label="Total Queries" subtitle="This session" color="#4F6EF7" max={Math.max(totalQueries * 2, 50)} />
        <KPICard value={avgConfidence} label="Avg Confidence" subtitle="Classification accuracy" color="#10B981" max={100} />
        <KPICard value={consistencyRate} label="Consistency Rate" subtitle="Auto-classified" color="#384884" max={100} />
        <KPICard value={categoryCount} label="Categories" subtitle="BPOM taxonomy" color="#8B5CF6" max={20} />
      </div>

      {/* Hero Banner */}
      <div
        className="relative overflow-hidden rounded-2xl p-8 text-white"
        style={{ background: 'linear-gradient(135deg, #384884 0%, #4F6EF7 100%)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">ParamAI Analytics</h2>
            <p className="text-white/80 text-sm">AI-powered BPOM parameter recommendations</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10">
            <Activity size={18} />
            <span className="text-sm font-medium">Live</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center border border-white/20">
            <p className="text-3xl font-bold">{estimatedTimeSavedHours > 0 ? estimatedTimeSavedHours + 'h' : estimatedTimeSavedMinutes + 'm'}</p>
            <p className="text-xs text-white/80 mt-1">Time Saved (est.)</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center border border-white/20">
            <p className="text-3xl font-bold">{totalQueries}</p>
            <p className="text-xs text-white/80 mt-1">Queries Processed</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center border border-white/20">
            <p className="text-3xl font-bold text-white/60">***</p>
            <p className="text-xs text-white/80 mt-1">API Cost (Internal)</p>
          </div>
        </div>
      </div>

      {/* Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Queries Table */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
        >
          <div
            className="px-6 py-4"
            style={{ backgroundColor: '#384884' }}
          >
            <h3 className="text-lg font-bold text-white">Recent Queries</h3>
            <p className="text-sm text-white/70">Latest product classification requests</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: '#475569' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Confidence</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-sm" style={{ color: '#9ca3af' }}>
                      No queries yet. Try the simulator to get started.
                    </td>
                  </tr>
                ) : (
                  history.slice(0, 10).map((row, index) => (
                    <tr
                      key={index}
                      style={index % 2 === 0 ? { backgroundColor: 'white' } : { backgroundColor: '#f9fafb' }}
                    >
                      <td className="px-6 py-4 text-sm font-semibold" style={{ color: '#1a1a2e' }}>{row.input_summary || 'Unknown'}</td>
                      <td className="px-6 py-4 text-sm font-mono" style={{ color: '#4F6EF7' }}>{row.category_code}</td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#374151' }}>{Math.round(row.confidence * 100)}%</td>
                      <td className="px-6 py-4">
                        {row.review_flag ? (
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full"
                            style={{ backgroundColor: '#fef3c7', color: '#92400e' }}
                          >
                            <Clock size={12} />
                            Pending
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full"
                            style={{ backgroundColor: '#d1fae5', color: '#065f46' }}
                          >
                            <CheckCircle size={12} />
                            Reviewed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Distribution Chart */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
        >
          <div
            className="px-6 py-4"
            style={{ backgroundColor: '#384884' }}
          >
            <h3 className="text-lg font-bold text-white">Category Distribution</h3>
            <p className="text-sm text-white/70">Query breakdown by BPOM category</p>
          </div>

          <div className="p-6">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={getCategoryDistribution()}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => [`${value}%`, 'Distribution']} contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '12px' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {getCategoryDistribution().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <div className="flex flex-wrap gap-3 mt-4">
              {getCategoryDistribution().map((item, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.fill }} />
                  <span className="text-xs" style={{ color: '#6b7280' }}>{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="px-6 py-4"
            style={{ borderTop: '1px solid #e5e7eb' }}
          >
            <h4 className="text-sm font-semibold mb-3" style={{ color: '#1a1a2e' }}>Categories Available</h4>
            <div className="space-y-2">
              {categories.slice(0, 5).map((cat, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 px-3 rounded-lg"
                  style={{ backgroundColor: '#f9fafb' }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium"
                      style={{ backgroundColor: '#384884', color: 'white' }}
                    >
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium" style={{ color: '#374151' }}>{cat.name}</span>
                  </div>
                  <span className="text-xs font-mono" style={{ color: '#6b7280' }}>{cat.code}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}