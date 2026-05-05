'use client'

/**
 * ParamAI Frontend — Summary/Report Page
 * Executive summary of ParamAI performance
 *
 * Competition: AI Open Innovation Challenge 2026
 * Team: Group 1, President University
 */

import { FileText, TrendingUp, Users, Clock } from 'lucide-react'

export default function SummaryPage() {
  // Mock data for the summary
  const summaryStats = [
    {
      icon: Clock,
      label: 'Time Saved',
      value: '127 hours',
      subtext: 'This month',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: TrendingUp,
      label: 'Queries Processed',
      value: '342',
      subtext: 'This month',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: Users,
      label: 'Team Members',
      value: '12',
      subtext: 'Active users',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      icon: FileText,
      label: 'Reports Generated',
      value: '89',
      subtext: 'This month',
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Executive Summary</h1>
          <p className="text-sm text-gray-500 mt-1">
            Performance overview and key metrics
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}
                  >
                    <Icon size={24} className={stat.color} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-400">{stat.subtext}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Chart Placeholder */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Monthly Performance Trend
            </h3>
            <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">
                  Chart visualization coming soon
                </p>
                <div className="flex gap-2 justify-center">
                  {[65, 78, 82, 88, 92, 95, 98].map((value, i) => (
                    <div
                      key={i}
                      className="w-8 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t"
                      style={{ height: `${value}%` }}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Jan - Jul 2026
                </p>
              </div>
            </div>
          </div>

          {/* Cost Analysis */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Cost Analysis
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">
                  Claude API Cost per Query
                </span>
                <span className="text-sm font-semibold text-gray-900">$0.003</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">
                  Avg. Manual Lookup Time
                </span>
                <span className="text-sm font-semibold text-gray-900">25 min</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">
                  Time Saved per Query
                </span>
                <span className="text-sm font-semibold text-green-600">22 min</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-sm text-gray-600">
                  Monthly Total Savings
                </span>
                <span className="text-lg font-bold text-green-600">~$850</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Categories Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">
              Top Categories by Query Volume
            </h3>
            <p className="text-sm text-gray-500">BPOM product categories breakdown</p>
          </div>

          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Category Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Category Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Queries
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { rank: 1, code: 'supp', name: 'Dietary Supplements', queries: 125, pct: '36.5%' },
                { rank: 2, code: '07.1', name: 'Biscuits and Cookies', queries: 98, pct: '28.7%' },
                { rank: 3, code: '14.1', name: 'Non-Alcoholic Beverages', queries: 65, pct: '19.0%' },
                { rank: 4, code: '01.2', name: 'Dairy Products', queries: 32, pct: '9.4%' },
                { rank: 5, code: '08.3', name: 'Processed Meat', queries: 22, pct: '6.4%' },
              ].map((row) => (
                <tr key={row.rank}>
                  <td className="px-6 py-4 text-sm text-gray-500">{row.rank}</td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-700">
                    {row.code}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {row.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.queries}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.pct}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Export Options */}
        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">
            Export CSV
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600">
            Generate PDF Report
          </button>
        </div>
      </div>
    </div>
  )
}