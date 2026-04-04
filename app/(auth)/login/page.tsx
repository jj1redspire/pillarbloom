'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Logo from '@/components/Logo'

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
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="bg-white border-b border-[#e8eaed] px-6 h-14 flex items-center">
        <Link href="/">
          <Logo variant="dark" width={140} />
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-16 bg-[#fafafa]">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-[#e8eaed] shadow-sm p-8">
            <div className="mb-7">
              <h1 className="text-2xl font-semibold text-[#1B2A4A] tracking-tight">
                Welcome back
              </h1>
              <p className="text-[#6B7280] text-sm mt-1">Log in to your PillarBloom account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#1B2A4A] mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-[#e8eaed] rounded-lg px-4 py-3 text-sm text-[#1B2A4A] focus:outline-none focus:ring-2 focus:ring-[#C6A04E] focus:border-transparent bg-white"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#1B2A4A] mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-[#e8eaed] rounded-lg px-4 py-3 text-sm text-[#1B2A4A] focus:outline-none focus:ring-2 focus:ring-[#C6A04E] focus:border-transparent bg-white"
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
                className="w-full bg-[#C6A04E] hover:bg-[#D4B574] disabled:opacity-60 text-white font-semibold py-3 rounded-lg text-sm transition-colors"
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            <p className="text-center text-sm text-[#6B7280] mt-6">
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
