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

  async function handleClick() {
    setLoading(true)

    try {
      if (plan) {
        // Checkout (upgrade)
        const res = await fetch('/api/billing/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan }),
        })
        const { url, error } = await res.json()
        if (error) {
          alert(error)
          setLoading(false)
          return
        }
        window.location.href = url
      } else {
        // Customer portal
        const res = await fetch('/api/billing/portal', { method: 'POST' })
        const { url, error } = await res.json()
        if (error) {
          alert(error)
          setLoading(false)
          return
        }
        window.location.href = url
      }
    } catch {
      alert('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`font-semibold rounded-lg transition-colors disabled:opacity-60 ${
        small
          ? 'text-xs px-3 py-1.5 bg-[#0F1B2D] text-white hover:bg-[#1B3A5C] w-full'
          : 'text-sm px-5 py-2.5 bg-[#0F1B2D] text-white hover:bg-[#1B3A5C]'
      }`}
    >
      {loading ? '…' : label}
    </button>
  )
}
