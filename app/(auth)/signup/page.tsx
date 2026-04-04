'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan') || 'starter'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { plan },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setDone(true)
  }

  if (done) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8E6E1] p-10 max-w-md w-full text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-[#0F1B2D] mb-2" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
          Check your email
        </h2>
        <p className="text-[#717185] text-sm">
          We sent a confirmation link to <strong className="text-[#0F1B2D]">{email}</strong>. Click it to activate your account and start your 14-day free trial.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E8E6E1] p-8">
      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#C6A04E]">14-day free trial</span>
        <h1 className="text-2xl font-bold text-[#0F1B2D] mt-1 mb-1" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
          Create your account
        </h1>
        <p className="text-[#717185] text-sm">No credit card required. Cancel anytime.</p>
      </div>

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
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-[#E8E6E1] rounded-lg px-4 py-3 text-sm text-[#0F1B2D] focus:outline-none focus:ring-2 focus:ring-[#C6A04E] focus:border-transparent"
            placeholder="At least 8 characters"
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
          {loading ? 'Creating account…' : 'Start free trial →'}
        </button>
      </form>

      <p className="text-center text-xs text-[#717185] mt-5">
        By creating an account you agree to our Terms of Service and Privacy Policy.
      </p>
      <p className="text-center text-sm text-[#717185] mt-3">
        Already have an account?{' '}
        <Link href="/login" className="text-[#C6A04E] font-medium hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#F3F1ED] flex flex-col">
      <nav className="bg-white border-b border-[#E8E6E1] px-6 h-14 flex items-center">
        <Link href="/" className="font-semibold text-[#0F1B2D]">
          Pillar<span className="text-[#C6A04E]">Bloom</span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <Suspense fallback={<div className="text-center text-sm text-[#717185]">Loading…</div>}>
            <SignupForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
