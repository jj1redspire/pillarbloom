'use client'

import { useState, useEffect } from 'react'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem('pb_cookie_consent')) {
        setVisible(true)
      }
    } catch { /* localStorage unavailable */ }
  }, [])

  if (!visible) return null

  function accept() {
    try { localStorage.setItem('pb_cookie_consent', '1') } catch { /* ignore */ }
    setVisible(false)
  }

  function dismiss() {
    setVisible(false)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0f1e38] border-t border-white/10 px-5 py-4 animate-fade-up shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-sm text-white/70 leading-relaxed max-w-xl">
          We use cookies to improve your experience and understand how you use PillarBloom.{' '}
          <a href="/privacy" className="text-[#C6A04E] underline hover:text-[#D4B574] transition-colors">
            Learn more
          </a>
        </p>
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <button
            onClick={accept}
            className="bg-[#C6A04E] hover:bg-[#D4B574] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors min-h-[44px]"
          >
            Accept
          </button>
          <button
            onClick={dismiss}
            className="text-white/40 hover:text-white/70 text-sm transition-colors min-h-[44px] px-3"
            aria-label="Dismiss cookie notice"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}
