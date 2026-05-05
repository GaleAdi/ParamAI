/**
 * ParamAI Frontend — Main Page
 * Redirects to /simulator
 */

import { redirect } from 'next/navigation'

export default function HomePage() {
  redirect('/simulator')
}