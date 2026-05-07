'use client'

/**
 * ParamAI Frontend — Sidebar Navigation Component
 * Design: Dark navy sidebar with professional SaaS aesthetic
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
  TrendingUp,
  HelpCircle,
} from 'lucide-react'
import RegulationCard from './RegulationCard'

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
    name: 'Help',
    href: '/help',
    icon: HelpCircle,
    badge: null,
  },
  {
    name: 'Analytics',
    href: '#',
    icon: TrendingUp,
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
      className="fixed left-0 top-0 h-screen w-[240px] flex flex-col z-50"
      style={{
        backgroundColor: '#384884',
        width: '240px',
      }}
    >
      {/* Logo Section */}
      <div
        className="px-6 py-5"
        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}
      >
        <div className="flex items-center gap-3">
          {/* Logo Icon */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
            style={{
              background: 'linear-gradient(135deg, #4F6EF7 0%, #8B5CF6 100%)',
            }}
          >
            P
          </div>
          {/* Logo Text */}
          <div>
            <span className="text-lg font-bold text-white">ParamAI</span>
            <p className="text-[10px] text-white/60">BPOM Testing</p>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 py-4 px-3">
        {/* Section Label */}
        <p
          className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/40"
        >
          Menu
        </p>

        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <li key={item.name}>
                {item.disabled ? (
                  <div
                    className="
                      flex items-center gap-3 px-3 py-3 rounded-lg
                      text-sm font-medium transition-all duration-200
                      text-white/30 cursor-not-allowed
                    "
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    <span>{item.name}</span>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-3 rounded-lg
                      text-sm font-medium transition-all duration-200
                      ${
                        active
                          ? 'text-white'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }
                    `
                    }
                    style={
                      active
                        ? {
                            backgroundColor: 'rgba(255, 255, 255, 0.15)',
                          }
                        : undefined
                    }
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <span
                        className="px-2 py-0.5 text-[10px] font-bold rounded-full"
                        style={{
                          backgroundColor: '#4F6EF7',
                          color: 'white',
                        }}
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

        {/* Settings Section */}
        <p
          className="px-3 mt-6 mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/40"
        >
          Settings
        </p>

        <ul className="space-y-1">
          <li>
            <button
              disabled
              className="
                w-full flex items-center gap-3 px-3 py-3 rounded-lg
                text-sm font-medium transition-all duration-200
                text-white/30 cursor-not-allowed
              "
            >
              <Settings size={20} className="flex-shrink-0" />
              <span>Settings</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Regulation Update Card */}
      <div className="px-3 pb-3">
        <RegulationCard />
      </div>

      {/* Footer User Profile */}
      <div
        className="px-4 py-4"
        style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}
      >
        <div className="flex items-center gap-3">
          {/* Avatar with Initials */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm"
            style={{
              background: 'linear-gradient(135deg, #4F6EF7 0%, #8B5CF6 100%)',
            }}
          >
            TS
          </div>
          {/* User Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">TUV Nord Staff</p>
            <p className="text-[11px] text-white/60 truncate">Regulatory Team</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
