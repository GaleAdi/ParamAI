/**
 * ParamAI Frontend — Root Layout
 * Design: Professional SaaS dashboard with dark navy sidebar
 *
 * Competition: AI Open Innovation Challenge 2026
 * Team: Kebut Semalam, President University
 */

import type { Metadata } from 'next'
import './globals.css'
import { ToastProvider } from './providers'
import ClientLayout from './ClientLayout'

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
          <ClientLayout>{children}</ClientLayout>
        </ToastProvider>
      </body>
    </html>
  )
}