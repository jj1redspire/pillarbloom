'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  source: string
  placeholder?: string
  buttonText?: string
  variant?: 'light' | 'dark'
  className?: string
}

export default function EmailCaptureForm({
  source,
  placeholder = 'Enter your email',
  buttonText = 'Start Free →',
  variant = 'light',
  className = '',
}: Props) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)

    // Fire-and-forget: store in waitlist, don't block navigation on result
    fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source }),
    }).catch(() => {/* ignore */})

    router.push(`/signup?email=${encodeURIComponent(email)}`)
  }

  const isDark = variant === 'dark'

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        className={`flex-1 px-4 py-3.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-[#C6A04E] focus:border-transparent transition-all ${
          isDark
            ? 'bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/15'
            : 'bg-white border-[#e8eaed] text-[#1B2A4A] placeholder:text-[#9CA3AF]'
        }`}
      />
      <button
        type="submit"
        disabled={loading}
        className={`px-7 py-3.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap disabled:opacity-60 ${
          isDark
            ? 'bg-[#C6A04E] hover:bg-[#D4B574] text-white shadow-lg shadow-[#C6A04E]/30 hover:-translate-y-0.5'
            : 'bg-[#C6A04E] hover:bg-[#D4B574] text-white shadow-lg shadow-[#C6A04E]/25 hover:-translate-y-0.5'
        }`}
      >
        {loading ? 'One sec…' : buttonText}
      </button>
    </form>
  )
}
