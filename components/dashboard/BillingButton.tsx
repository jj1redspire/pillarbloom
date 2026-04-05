'use client'

import { useState } from 'react'

export default function BillingButton({
  plan,
  label = 'Manage billing',
  small = false,
}: {
  plan?: string
  label?: string
  small?: boolean
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleClick() {
    setLoading(true)
    setError('')

    try {
      if (plan) {
        // Upgrade: create checkout session
        const res = await fetch('/api/billing/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan }),
        })
        const { url, error: apiError } = await res.json()
        if (apiError) {
          setError(apiError)
          setLoading(false)
          return
        }
        window.location.href = url
      } else {
        // Customer portal: manage subscription
        const res = await fetch('/api/billing/portal', { method: 'POST' })
        const { url, error: apiError } = await res.json()
        if (apiError) {
          setError(apiError)
          setLoading(false)
          return
        }
        window.location.href = url
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className={small ? 'w-full' : ''}>
      <button
        onClick={handleClick}
        disabled={loading}
        className={`font-semibold rounded-lg transition-colors disabled:opacity-60 ${
          small
            ? 'text-xs px-3 py-1.5 bg-[#1B2A4A] text-white hover:bg-[#2D4270] w-full'
            : 'text-sm px-5 py-2.5 bg-[#1B2A4A] text-white hover:bg-[#2D4270]'
        }`}
      >
        {loading ? '…' : label}
      </button>
      {error && (
        <p className="text-xs text-red-600 mt-1.5 leading-snug">{error}</p>
      )}
    </div>
  )
}
