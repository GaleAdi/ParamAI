'use client'

/**
 * ParamAI Frontend — Sidebar Navigation Component
 * AI-Powered BPOM Food Testing Parameter Recommendation System
 *
 * Competition: AI Open Innovation Challenge 2026
 * Team: Group 1, President University
 */

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutGrid,
  Search,
  Clock,
  FileText,
  Settings,
  ExternalLink,
} from 'lucide-react'

// Navigation items configuration
const NAV_ITEMS = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutGrid,
    badge: null,
  },
  {
    name: 'Simulator',
    href: '/simulator',
    icon: Search,
    badge: 'New',
  },
  {
    name: 'History',
    href: '/history',
    icon: Clock,
    badge: null,
  },
  {
    name: 'Summary',
    href: '/summary',
    icon: FileText,
    badge: null,
  },
  {
    name: 'Settings',
    href: '#',
    icon: Settings,
    badge: null,
    disabled: true,
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '#') return false
    return pathname === href || pathname.startsWith(`${href}`)
  }

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-[220px] flex flex-col bg-[#F4F7FF] border-r border-gray-200"
      style={{ width: '220px' }}
    >
      {/* Logo Section */}
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {/* Logo Icon */}
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{
              background: 'linear-gradient(135deg, #4F6EF7 0%, #8B5CF6 100%)',
            }}
          >
            P
          </div>
          {/* Logo Text */}
          <span className="text-lg font-semibold text-gray-900">ParamAI</span>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 py-4 px-3">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <li key={item.name}>
                {item.disabled ? (
                  <div
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg
                      text-sm font-medium transition-all duration-200
                      text-gray-400 cursor-not-allowed
                    `}
                  >
                    <Icon size={18} className="flex-shrink-0" />
                    <span>{item.name}</span>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg
                      text-sm font-medium transition-all duration-200
                      ${
                        active
                          ? 'text-white shadow-md'
                          : 'text-gray-500 hover:bg-blue-50 hover:text-gray-700'
                      }
                    `}
                    style={
                      active
                        ? {
                            background:
                              'linear-gradient(135deg, #4F6EF7 0%, #6B83F8 100%)',
                          }
                        : undefined
                    }
                  >
                    <Icon size={18} className="flex-shrink-0" />
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <span
                        className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-white/20 text-white"
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Update Card */}
      <div className="px-3 pb-3">
        <div
          className="p-3 rounded-xl text-white text-xs"
          style={{
            background:
              'linear-gradient(135deg, #4F6EF7 0%, #8B5CF6 100%)',
          }}
        >
          <p className="font-medium mb-2">BPOM regulations updated quarterly</p>
          <button className="flex items-center gap-1 text-white/90 hover:text-white transition-colors">
            <span>Check Updates</span>
            <ExternalLink size={12} />
          </button>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="p-3 border-t border-gray-200">
        <div className="flex items-center gap-3">
          {/* Avatar with Initials */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-xs"
            style={{
              background: 'linear-gradient(135deg, #4F6EF7 0%, #8B5CF6 100%)',
            }}
          >
            TS
          </div>
          {/* User Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              TUV Nord Staff
            </p>
            <p className="text-xs text-gray-500 truncate">Regulatory Team</p>
          </div>
        </div>
      </div>
    </aside>
  )
}