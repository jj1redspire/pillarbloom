'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function DashboardNav({ email }: { email: string }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm text-[#4A4A5A] hover:text-[#0F1B2D] transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-[#0F1B2D] text-white flex items-center justify-center text-xs font-semibold">
          {email.charAt(0).toUpperCase()}
        </div>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E8E6E1] rounded-xl shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-[#E8E6E1]">
            <p className="text-xs text-[#717185] truncate">{email}</p>
          </div>
          <a
            href="/dashboard/settings"
            className="block px-4 py-2 text-sm text-[#4A4A5A] hover:bg-[#F3F1ED] hover:text-[#0F1B2D] transition-colors"
            onClick={() => setOpen(false)}
          >
            Settings
          </a>
          <button
            onClick={signOut}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
