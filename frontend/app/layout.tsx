/**
 * ParamAI Frontend — Root Layout
 * AI-Powered BPOM Food Testing Parameter Recommendation System
 *
 * Competition: AI Open Innovation Challenge 2026
 * Team: Group 1, President University
 */

import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'

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
        <div className="flex h-screen">
          {/* Sidebar Navigation */}
          <Sidebar />

          {/* Main Content Area */}
          <main className="flex-1 ml-[220px] overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}