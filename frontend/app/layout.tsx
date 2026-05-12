/**
 * ParamAI Frontend — Root Layout
 * Design: Professional SaaS dashboard with dark navy sidebar
 *
 * Competition: AI Open Innovation Challenge 2026
 * Team: Group 1, President University
 */

import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import { ToastProvider } from './providers'

export const metadata: Metadata = {
  title: 'ParamAI - BPOM Testing Parameter Recommendation',
  description: 'AI-powered system for BPOM food testing parameter recommendations',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ToastProvider>
          {/* Sidebar Navigation - Fixed Left */}
          <Sidebar />

          {/* Main Content Area - With margin to account for sidebar */}
          <main
            className="min-h-screen"
            style={{ marginLeft: '240px', backgroundColor: '#D8DAE7' }}
          >
            {children}
          </main>

          {/* Footer Bar */}
          <footer
            className="fixed bottom-0 right-0 flex items-center justify-end px-6 py-3 text-white text-xs"
            style={{
              marginLeft: '240px',
              backgroundColor: '#2d3a5c',
              width: 'calc(100% - 240px)',
            }}
          >
            <div className="flex items-center gap-4">
              <span className="text-white/60">Team Kebut Semalam - President University</span>
              <span
                className="px-2 py-1 rounded text-[10px] font-semibold"
                style={{ backgroundColor: '#4F6EF7' }}
              >
                v1.0.0
              </span>
            </div>
          </footer>
        </ToastProvider>
      </body>
    </html>
  )
}