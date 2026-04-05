'use client'

import { useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'

const PLAYBOOK_CONTENT = `# The Content-to-Product Playbook
## 5 Digital Products You Can Create From One Blog Post

*A PillarBloom free guide*

---

### Introduction

You already have everything you need to build a digital product business.

That blog post you spent 4 hours writing? It's sitting on 5 untapped income streams. This playbook shows you exactly how to unlock each one — fast.

---

### Product 1: The Ebook (Depth Play)

**What it is:** A 5,000–15,000 word deep-dive that expands on your post's core idea.

**Why it sells:** People pay for depth. A blog post is a preview; an ebook is the full meal.

**How to build it:**
1. Identify the 3–5 biggest questions your post raises but doesn't fully answer
2. Write a full chapter for each — examples, case studies, how-to steps
3. Add an introduction, conclusion, and resource list
4. Export as PDF, set a price ($9–$47 range works well for first products)

**Time to create with PillarBloom:** ~15 minutes for the full outline + chapter summaries

---

### Product 2: The Email Course (Trust Builder)

**What it is:** A 5–7 day email sequence that teaches a skill or transformation.

**Why it sells:** Email courses sell on autopilot. Write once, sell forever. Plus they build your list.

**How to build it:**
1. Define the before state (problem) and after state (result)
2. Map 5–7 lessons as daily emails, each with one actionable idea
3. Day 1: Promise + Quick Win. Days 2–6: Progressive steps. Day 7: Graduation + Offer
4. Deliver via ConvertKit or Gumroad

**Time to create with PillarBloom:** ~10 minutes for the full 7-day outline

---

### Product 3: The Workbook (Action Taker's Edition)

**What it is:** A fillable PDF with exercises, prompts, and trackers tied to your content.

**Why it sells:** Workbooks are bought by the action-oriented. They want to DO something, not just read.

**How to build it:**
1. List every "what should the reader do after this section?" from your blog post
2. Turn each answer into a worksheet page: reflection prompts, fill-in templates, checklists
3. Design in Canva (free) using their workbook templates
4. Sell at $17–$37 — workbooks have higher perceived value than ebooks

**Time to create with PillarBloom:** ~10 minutes for all exercises and prompts

---

### Product 4: The Mini-Course (Premium Tier)

**What it is:** 3–5 video lessons or slide decks covering a specific skill.

**Why it sells:** Video builds trust like nothing else. Premium price point ($97–$297) is achievable.

**How to build it:**
1. Take your blog post's main argument and split it into 3–5 teachable modules
2. For each module: Learning Objective → Core Lesson → Action Step
3. Record screenshare videos using Loom (free) — no fancy equipment needed
4. Host on Gumroad, Podia, or Teachable

**Time to create with PillarBloom:** ~15 minutes for module outlines, lesson plans, and quiz questions

---

### Product 5: The Sales Page (Revenue Closer)

**What it is:** A complete Gumroad/Payhip sales page for any of the above products.

**Why it matters:** This isn't the product — it's what makes the product sell. Most creators skip this and wonder why nothing converts.

**What it needs:**
- A headline that names the transformation ("Stop losing hours to content creation")
- 3–5 bullet points on what they get
- One clear call-to-action
- A simple guarantee ("If you apply this and don't see results, email me")

**Time to create with PillarBloom:** ~5 minutes for a complete sales page draft

---

### Your Action Plan

**This week:**
1. Pick your best blog post (1,000+ words, topic you know cold)
2. Paste it into PillarBloom → run the Product Engine
3. Choose ONE product type to finish first
4. Set a price. Put it on Gumroad. Share the link once.

That's the entire system.

---

### About PillarBloom

PillarBloom is the platform that turns your existing content into digital products — automatically, in your voice.

Start your free trial at **pillarbloom.com**

*No credit card required.*
`

function downloadPlaybook() {
  const blob = new Blob([PLAYBOOK_CONTENT], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'content-to-product-playbook-pillarbloom.md'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function LeadMagnetClient() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'lead_magnet' }),
      })
    } catch {
      // Don't block download if API fails
    }

    downloadPlaybook()
    setDownloaded(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-[#e8eaed] px-6 h-14 flex items-center">
        <Link href="/">
          <Logo variant="dark" width={140} />
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-20">

        {/* Badge */}
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 bg-[#C6A04E]/10 border border-[#C6A04E]/25 rounded-full px-4 py-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6A04E]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#C6A04E]">Free Download</span>
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-4xl md:text-5xl font-bold text-[#1B2A4A] text-center tracking-tight leading-tight mb-5">
          The Content-to-Product Playbook
        </h1>
        <p className="text-xl text-[#6B7280] text-center leading-relaxed mb-4 max-w-2xl mx-auto">
          5 Digital Products You Can Create From One Blog Post — with the exact steps to build and sell each one.
        </p>

        {/* What's inside */}
        <div className="bg-[#fafafa] border border-[#e8eaed] rounded-2xl p-6 mb-10 max-w-lg mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-[#9CA3AF] mb-4">What&apos;s Inside</p>
          <ul className="space-y-3">
            {[
              'The Ebook — turn depth into a sellable PDF ($9–$47)',
              'The Email Course — passive income, automated delivery',
              'The Workbook — action-takers pay more ($17–$37)',
              'The Mini-Course — premium tier, $97–$297',
              'The Sales Page — the copy that makes everything convert',
              'Your 4-step action plan for this week',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-[#374151]">
                <span className="text-[#C6A04E] font-bold flex-shrink-0 mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Form */}
        {!downloaded ? (
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full border border-[#e8eaed] rounded-xl px-4 py-3.5 text-sm text-[#1B2A4A] focus:outline-none focus:ring-2 focus:ring-[#C6A04E] focus:border-transparent bg-white"
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#C6A04E] hover:bg-[#D4B574] disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl text-sm transition-colors shadow-lg shadow-[#C6A04E]/25"
              >
                {loading ? 'Preparing download…' : 'Send me the free playbook →'}
              </button>
            </form>
            <p className="text-center text-xs text-[#9CA3AF] mt-3">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        ) : (
          <div className="max-w-md mx-auto text-center">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-200">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[#1B2A4A] mb-2 tracking-tight">Downloading now!</h2>
            <p className="text-[#6B7280] text-sm mb-6 leading-relaxed">
              Your playbook should be in your downloads folder. Ready to put it into practice?
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-[#C6A04E] hover:bg-[#D4B574] text-white font-semibold px-7 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-[#C6A04E]/25 hover:-translate-y-0.5"
            >
              Start building products now — free →
            </Link>
            <p className="text-xs text-[#9CA3AF] mt-3">No credit card required</p>
          </div>
        )}

      </div>
    </div>
  )
}
