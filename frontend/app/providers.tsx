'use client'

/**
 * ParamAI Frontend — Toast Provider
 * Context provider for toast notifications throughout the app
 *
 * Competition: AI Open Innovation Challenge 2026
 * Team: Group 1, President University
 */

'use client'

import { createContext, useContext, ReactNode } from 'react'
import { ToastContainer, useToast, Toast, ToastType } from '@/components/Toast'

// Define the toast context type
interface ToastContextType {
  toast: {
    success: (title: string, message?: string, duration?: number) => void
    error: (title: string, message?: string, duration?: number) => void
    warning: (title: string, message?: string, duration?: number) => void
    info: (title: string, message?: string, duration?: number) => void
  }
}

// Create the context
const ToastContext = createContext<ToastContextType | null>(null)

// Provider component
export function ToastProvider({ children }: { children: ReactNode }) {
  const { toasts, toast, removeToast } = useToast()

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  )
}

// Custom hook to use toast
export function useToastMessage() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToastMessage must be used within a ToastProvider')
  }
  return context
}

// Export types for use in other components
export type { ToastContextType }