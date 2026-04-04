'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#F3F1ED] flex flex-col">
      <nav className="bg-white border-b border-[#E8E6E1] px-6 h-14 flex items-center">
        <Link href="/" className="font-semibold text-[#0F1B2D]">
          Pillar<span className="text-[#C6A04E]">Bloom</span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-[#E8E6E1] p-8">
            <h1 className="text-2xl font-bold text-[#0F1B2D] mb-1" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              Welcome back
            </h1>
            <p className="text-[#717185] text-sm mb-8">Log in to your PillarBloom account.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#0F1B2D] mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-[#E8E6E1] rounded-lg px-4 py-3 text-sm text-[#0F1B2D] focus:outline-none focus:ring-2 focus:ring-[#C6A04E] focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#0F1B2D] mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-[#E8E6E1] rounded-lg px-4 py-3 text-sm text-[#0F1B2D] focus:outline-none focus:ring-2 focus:ring-[#C6A04E] focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0F1B2D] hover:bg-[#1B3A5C] disabled:opacity-60 text-white font-semibold py-3 rounded-lg text-sm transition-colors"
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            <p className="text-center text-sm text-[#717185] mt-6">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-[#C6A04E] font-medium hover:underline">
                Start free trial
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
