'use client'

/**
 * ParamAI Frontend — Toast Notification Component
 * Displays success/error/info toast messages
 *
 * Competition: AI Open Innovation Challenge 2026
 * Team: Group 1, President University
 */

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastProps {
  toast: Toast
  onClose: (id: string) => void
}

// Toast item component
function ToastItem({ toast, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setIsVisible(true))

    // Auto-dismiss after duration
    const duration = toast.duration || 4000
    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [toast.duration])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => {
      onClose(toast.id)
    }, 300)
  }

  const icons = {
    success: <CheckCircle size={20} />,
    error: <XCircle size={20} />,
    warning: <AlertCircle size={20} />,
    info: <Info size={20} />,
  }

  const colors = {
    success: {
      bg: '#d1fae5',
      border: '#10b981',
      icon: '#065f46',
      title: '#065f46',
      message: '#047857',
    },
    error: {
      bg: '#fee2e2',
      border: '#ef4444',
      icon: '#991b1b',
      title: '#991b1b',
      message: '#b91c1c',
    },
    warning: {
      bg: '#fef3c7',
      border: '#f59e0b',
      icon: '#92400e',
      title: '#92400e',
      message: '#a16207',
    },
    info: {
      bg: '#dbeafe',
      border: '#4F6EF7',
      icon: '#1e40af',
      title: '#1e40af',
      message: '#1e40af',
    },
  }

  const style = colors[toast.type]

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-xl shadow-lg
        transition-all duration-300 ease-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
      style={{
        backgroundColor: style.bg,
        border: `1px solid ${style.border}`,
        minWidth: '320px',
        maxWidth: '420px',
      }}
    >
      {/* Icon */}
      <div style={{ color: style.icon }} className="flex-shrink-0 mt-0.5">
        {icons[toast.type]}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ color: style.title }}>
          {toast.title}
        </p>
        {toast.message && (
          <p className="text-xs mt-1" style={{ color: style.message }}>
            {toast.message}
          </p>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="flex-shrink-0 p-1 rounded-lg transition-colors"
        style={{ color: style.icon }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = `${style.border}20`)}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <X size={16} />
      </button>
    </div>
  )
}

// Toast Container Component
interface ToastContainerProps {
  toasts: Toast[]
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  )
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    setToasts((prev) => [...prev, { ...toast, id }])
    return id
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const toast = {
    success: (title: string, message?: string, duration?: number) =>
      addToast({ type: 'success', title, message, duration }),
    error: (title: string, message?: string, duration?: number) =>
      addToast({ type: 'error', title, message, duration }),
    warning: (title: string, message?: string, duration?: number) =>
      addToast({ type: 'warning', title, message, duration }),
    info: (title: string, message?: string, duration?: number) =>
      addToast({ type: 'info', title, message, duration }),
  }

  return { toasts, toast, removeToast }
}

export default ToastItem