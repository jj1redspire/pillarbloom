'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const PRODUCT_TYPES = [
  {
    key: 'ebook',
    icon: '📖',
    label: 'Ebook / PDF Lead Magnet',
    desc: 'Chapter structure, intro, conclusion — ready to export as PDF',
  },
  {
    key: 'mini_course',
    icon: '🎓',
    label: 'Mini-Course Outline',
    desc: 'Modules, lessons, learning objectives, and assessment questions',
  },
  {
    key: 'email_course',
    icon: '📧',
    label: 'Email Course (7 Days)',
    desc: 'Full 7-day drip sequence with subject lines and body copy',
  },
  {
    key: 'workbook',
    icon: '📝',
    label: 'Coaching Workbook',
    desc: 'Reflection prompts, action steps, framework exercises',
  },
  {
    key: 'checklist',
    icon: '✅',
    label: 'Checklist / Cheat Sheet',
    desc: 'Condensed, scannable steps — one page, immediately actionable',
  },
  {
    key: 'product_description',
    icon: '💰',
    label: 'Product Sales Copy',
    desc: 'Gumroad/Payhip-ready copy with pricing suggestion, benefits, FAQ',
  },
]

export default function NewProductPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selected, setSelected] = useState<string[]>(['ebook', 'checklist'])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function toggleType(key: string) {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (content.trim().length < 100) {
      setError('Please paste at least 100 characters of source content.')
      return
    }
    if (selected.length === 0) {
      setError('Select at least one product type.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: project, error: projectError } = await supabase
        .from('digital_product_projects')
        .insert({
          user_id: user.id,
          title: title.trim() || content.slice(0, 60).trim() + '…',
          source_content: content.trim(),
          selected_types: selected,
          status: 'generating',
        })
        .select('id')
        .single()

      if (projectError || !project) {
        setError('Failed to create project. Please try again.')
        setLoading(false)
        return
      }

      router.push(`/dashboard/products/${project.id}?generate=true`)
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#1B2A4A] tracking-tight">New Digital Product</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Paste your source content and choose which products to generate.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Content */}
        <div className="bg-white rounded-xl border border-[#e8eaed] p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-[#1B2A4A] text-white text-xs font-semibold flex items-center justify-center">1</span>
            <h2 className="font-semibold text-[#1B2A4A] text-sm">Paste your source content</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-[#1B2A4A] mb-1.5">
                Product title <span className="text-[#9CA3AF] font-normal">(optional — we&apos;ll generate one)</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The Content Creator's Playbook"
                className="w-full bg-white border border-[#e8eaed] rounded-lg px-4 py-2.5 text-sm text-[#1B2A4A] focus:outline-none focus:ring-2 focus:ring-[#C6A04E] focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-[#1B2A4A] mb-1.5">
                Source content <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={14}
                placeholder="Paste your blog post, framework, methodology, transcript, or any expertise-rich content here…"
                className="w-full bg-white border border-[#e8eaed] rounded-xl px-4 py-3 text-sm text-[#1B2A4A] focus:outline-none focus:ring-2 focus:ring-[#C6A04E] focus:border-transparent resize-none leading-relaxed"
              />
              <p className="text-xs text-[#9CA3AF] mt-1.5">
                {content.length} characters · More depth = better products
              </p>
            </div>
          </div>
        </div>

        {/* Step 2: Product types */}
        <div className="bg-white rounded-xl border border-[#e8eaed] p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-[#1B2A4A] text-white text-xs font-semibold flex items-center justify-center">2</span>
            <h2 className="font-semibold text-[#1B2A4A] text-sm">Choose product types</h2>
            <span className="text-xs text-[#9CA3AF] ml-1">({selected.length} selected)</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {PRODUCT_TYPES.map((type) => {
              const isSelected = selected.includes(type.key)
              return (
                <button
                  key={type.key}
                  type="button"
                  onClick={() => toggleType(type.key)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-[#C6A04E] bg-[#C6A04E]/5 shadow-sm'
                      : 'border-[#e8eaed] hover:border-[#1B2A4A]/20 hover:bg-[#fafafa]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors ${
                      isSelected ? 'border-[#C6A04E] bg-[#C6A04E]' : 'border-[#D1D5DB]'
                    }`}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-base leading-none">{type.icon}</span>
                        <span className="text-sm font-medium text-[#1B2A4A]">{type.label}</span>
                      </div>
                      <p className="text-xs text-[#6B7280] leading-relaxed">{type.desc}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading || selected.length === 0}
            className="bg-[#C6A04E] hover:bg-[#D4B574] disabled:opacity-60 text-white font-semibold px-8 py-3 rounded-lg text-sm transition-colors"
          >
            {loading
              ? 'Creating…'
              : `Generate ${selected.length} product${selected.length !== 1 ? 's' : ''} →`}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-[#6B7280] hover:text-[#1B2A4A] transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
