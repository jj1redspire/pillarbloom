'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Logo from '@/components/Logo'

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
      <div className="bg-white rounded-2xl border border-[#e8eaed] shadow-sm p-10 max-w-md w-full text-center">
        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-200">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-[#1B2A4A] mb-2 tracking-tight">
          Check your email
        </h2>
        <p className="text-[#6B7280] text-sm leading-relaxed">
          We sent a confirmation link to <strong className="text-[#1B2A4A]">{email}</strong>. Click it to activate your account and start your 14-day free trial.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-[#e8eaed] shadow-sm p-8">
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 bg-[#C6A04E]/10 border border-[#C6A04E]/25 rounded-full px-3 py-1 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C6A04E] inline-block"></span>
          <span className="text-[#C6A04E] text-xs font-semibold uppercase tracking-widest">14-day free trial</span>
        </div>
        <h1 className="text-2xl font-semibold text-[#1B2A4A] mb-1 tracking-tight">
          Create your account
        </h1>
        <p className="text-[#6B7280] text-sm">No credit card required. Cancel anytime.</p>
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
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-[#e8eaed] rounded-lg px-4 py-3 text-sm text-[#1B2A4A] focus:outline-none focus:ring-2 focus:ring-[#C6A04E] focus:border-transparent bg-white"
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

      <p className="text-center text-xs text-[#9CA3AF] mt-5">
        By creating an account you agree to our Terms of Service and Privacy Policy.
      </p>
      <p className="text-center text-sm text-[#6B7280] mt-3">
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
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="bg-white border-b border-[#e8eaed] px-6 h-14 flex items-center">
        <Link href="/">
          <Logo variant="dark" width={140} />
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-16 bg-[#fafafa]">
        <div className="w-full max-w-md">
          <Suspense fallback={<div className="text-center text-sm text-[#6B7280]">Loading…</div>}>
            <SignupForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
