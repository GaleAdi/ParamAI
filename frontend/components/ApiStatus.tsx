'use client'

/**
 * ParamAI Frontend — API Status Component
 * Real-time connection status to backend API
 *
 * Competition: AI Open Innovation Challenge 2026
 * Team: Kebut Semalam, President University
 */

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Loader2, Wifi, WifiOff } from 'lucide-react'
import { checkApiHealth } from '@/lib/api'

interface ApiStatusProps {
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  autoRefresh?: boolean
  refreshInterval?: number // in milliseconds
}

export default function ApiStatus({
  showLabel = true,
  size = 'md',
  autoRefresh = true,
  refreshInterval = 30000, // 30 seconds
}: ApiStatusProps) {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking')
  const [latency, setLatency] = useState<number | null>(null)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const checkStatus = async () => {
    setStatus('checking')
    const startTime = Date.now()

    try {
      const isHealthy = await checkApiHealth()
      const endTime = Date.now()

      if (isHealthy) {
        setStatus('connected')
        setLatency(endTime - startTime)
        setLastChecked(new Date())
      } else {
        setStatus('disconnected')
        setLatency(null)
      }
    } catch (error) {
      console.error('API health check failed:', error)
      setStatus('disconnected')
      setLatency(null)
    }
  }

  useEffect(() => {
    // Initial check
    checkStatus()

    // Auto refresh if enabled
    if (autoRefresh) {
      const interval = setInterval(checkStatus, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval])

  // Size configurations
  const sizes = {
    sm: {
      dot: 'w-2 h-2',
      icon: 12,
      text: 'text-xs',
    },
    md: {
      dot: 'w-3 h-3',
      icon: 16,
      text: 'text-sm',
    },
    lg: {
      dot: 'w-4 h-4',
      icon: 20,
      text: 'text-base',
    },
  }

  const config = sizes[size]

  // Status configurations
  const statusConfig = {
    checking: {
      bg: 'bg-yellow-100',
      text: '#b45309',
      dot: 'bg-yellow-500',
      icon: <Loader2 size={config.icon} className="animate-spin" style={{ color: '#b45309' }} />,
      label: 'Checking...',
    },
    connected: {
      bg: 'bg-green-100',
      text: '#065f46',
      dot: 'bg-green-500 animate-pulse',
      icon: <CheckCircle size={config.icon} />,
      label: 'API Connected',
    },
    disconnected: {
      bg: 'bg-red-100',
      text: '#991b1b',
      dot: 'bg-red-500',
      icon: <XCircle size={config.icon} />,
      label: 'API Disconnected',
    },
  }

  const current = statusConfig[status]

  // Format last checked time
  const formatLastChecked = () => {
    if (!lastChecked) return ''
    const now = new Date()
    const diff = Math.floor((now.getTime() - lastChecked.getTime()) / 1000)

    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    return lastChecked.toLocaleTimeString()
  }

  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl transition-all"
      style={{ backgroundColor: current.bg }}
    >
      {/* Status Dot/Icon */}
      <div className="relative">
        <div className={`${config.dot} rounded-full`} style={{ backgroundColor: current.text }} />
        {status === 'checking' && (
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{ backgroundColor: current.text, opacity: 0.5 }}
          />
        )}
      </div>

      {/* Icon */}
      <div style={{ color: current.text }}>
        {status === 'connected' ? <Wifi size={config.icon} /> : status === 'disconnected' ? <WifiOff size={config.icon} /> : current.icon}
      </div>

      {/* Label */}
      {showLabel && (
        <div className="flex items-center gap-1">
          <span className={`font-medium ${config.text}`} style={{ color: current.text }}>
            {current.label}
          </span>

          {/* Latency indicator for connected state */}
          {status === 'connected' && latency !== null && (
            <span className={`${config.text}`} style={{ color: current.text, opacity: 0.7 }}>
              • {latency}ms
            </span>
          )}
        </div>
      )}

      {/* Last checked timestamp */}
      {showLabel && lastChecked && (
        <span className="text-[10px]" style={{ color: current.text, opacity: 0.6 }}>
          ({formatLastChecked()})
        </span>
      )}

      {/* Retry button for disconnected state */}
      {status === 'disconnected' && (
        <button
          onClick={checkStatus}
          className="ml-1 px-2 py-0.5 rounded text-xs font-medium transition-colors"
          style={{
            backgroundColor: current.text,
            color: 'white',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Retry
        </button>
      )}
    </div>
  )
}