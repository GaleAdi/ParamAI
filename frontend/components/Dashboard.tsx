'use client'

/**
 * ParamAI Frontend — Dashboard Component
 * Main dashboard page with KPIs, stats, and visualizations
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
import { CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { getCategories, getHistory } from '@/lib/api'
import { Category, HistoryItem } from '@/lib/types'

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
      {/* Background ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#E5E7EB"
        strokeWidth={strokeWidth}
      />
      {/* Progress ring */}
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
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center gap-4">
        {/* Ring Progress */}
        <div className="relative">
          <RingProgress value={value} max={max} color={color} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-gray-800">{value}</span>
          </div>
        </div>
        {/* Text */}
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
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
          fetchCategories(),
          fetchHistory(),
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

  // Calculate category distribution from history
  const getCategoryDistribution = () => {
    if (history.length === 0) {
      return [
        { name: '07.1', value: 25, fill: '#4F6EF7' },
        { name: '14.1', value: 20, fill: '#6B83F8' },
        { name: 'supp', value: 30, fill: '#8B5CF6' },
        { name: '01.2', value: 15, fill: '#A78BFA' },
        { name: '08.3', value: 10, fill: '#C4B5FD' },
      ]
    }

    const distribution: Record<string, number> = {}
    history.forEach((item) => {
      const cat = item.category_name || 'Unknown'
      distribution[cat] = (distribution[cat] || 0) + 1
    })

    const total = history.length
    return Object.entries(distribution)
      .slice(0, 5)
      .map(([name, count], index) => ({
        name: name.length > 10 ? name.substring(0, 10) + '...' : name,
        value: Math.round((count / total) * 100),
        fill: ['#4F6EF7', '#6B83F8', '#8B5CF6', '#A78BFA', '#C4B5FD'][index],
      }))
  }

  // Mock data for KPI cards
  const totalQueries = history.length || 12
  const avgResponseTime = '18 sec'
  const consistencyRate = '99.8%'
  const categoriesCovered = `${categories.length} / 16`

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ===================================================================== */}
      {/* KPI Cards Row */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          value={totalQueries}
          label="Total Queries"
          subtitle="This month"
          color="#4F6EF7"
          max={50}
        />
        <KPICard
          value={18}
          label="Avg Response Time"
          subtitle="seconds per query"
          color="#10B981"
          max={60}
        />
        <KPICard
          value={99}
          label="Consistency Rate"
          subtitle="+0.8% vs last month"
          color="#8B5CF6"
          max={100}
        />
        <KPICard
          value={categories.length}
          label="Categories Covered"
          subtitle="BPOM taxonomy"
          color="#F59E0B"
          max={16}
        />
      </div>

      {/* ===================================================================== */}
      {/* Hero Banner */}
      {/* ===================================================================== */}
      <div
        className="relative overflow-hidden rounded-2xl p-8 text-white"
        style={{
          background: 'linear-gradient(135deg, #6B73FF 0%, #9B59F5 100%)',
        }}
      >
        {/* Glassmorphism stats boxes */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">
              ParamAI is saving your team workdays this month!
            </h2>
            <p className="text-white/80 text-sm">
              AI-powered BPOM parameter recommendations
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
            <p className="text-3xl font-bold">127</p>
            <p className="text-xs text-white/80 mt-1">Hours Saved</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
            <p className="text-3xl font-bold">342</p>
            <p className="text-xs text-white/80 mt-1">Queries Processed</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
            <p className="text-3xl font-bold">$0.003</p>
            <p className="text-xs text-white/80 mt-1">Cost per Query</p>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* Two-Column Grid */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Recent Queries Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Recent Queries</h3>
            <p className="text-sm text-gray-500">Latest product classification requests</p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Confidence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Sample data rows */}
                {[
                  {
                    product: 'Chocolate Biscuit',
                    category: '07.1',
                    confidence: 94,
                    status: 'reviewed',
                  },
                  {
                    product: 'Mango Juice',
                    category: '14.1',
                    confidence: 88,
                    status: 'reviewed',
                  },
                  {
                    product: 'Whey Protein',
                    category: 'supp',
                    confidence: 72,
                    status: 'pending',
                  },
                  {
                    product: 'Beef Sausage',
                    category: '08.3',
                    confidence: 85,
                    status: 'reviewed',
                  },
                  {
                    product: 'Yogurt',
                    category: '01.2',
                    confidence: 91,
                    status: 'reviewed',
                  },
                ].map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {row.product}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                      {row.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {row.confidence}%
                    </td>
                    <td className="px-6 py-4">
                      {row.status === 'reviewed' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                          <CheckCircle size={12} />
                          Reviewed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
                          <Clock size={12} />
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Category Distribution Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Category Distribution</h3>
            <p className="text-sm text-gray-500">Query breakdown by BPOM category</p>
          </div>

          {/* Chart */}
          <div className="p-6">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={getCategoryDistribution()}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  formatter={(value: number) => [`${value}%`, 'Distribution']}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {getCategoryDistribution().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-4">
              {getCategoryDistribution().map((item, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-xs text-gray-600">
                    {item.name}: {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Parameters Section */}
          <div className="px-6 py-4 border-t border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Top Requested Parameters
            </h4>
            <div className="space-y-2">
              {[
                { name: 'Lead (Pb)', count: 45, type: 'heavy_metal' },
                { name: 'E. coli', count: 38, type: 'microbiological' },
                { name: 'Protein Content', count: 32, type: 'chemical' },
              ].map((param, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 flex items-center justify-center bg-white rounded-full text-xs font-medium text-gray-600 border border-gray-200">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {param.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {param.count} requests
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}