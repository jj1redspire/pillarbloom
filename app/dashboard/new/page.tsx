'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const CONTENT_EXAMPLES = [
  'Blog post about your industry',
  'Podcast transcript',
  'Webinar notes or recording',
  'Case study',
  'White paper or report',
  'Long-form email or newsletter',
]

export default function NewProjectPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (content.trim().length < 100) {
      setError('Please paste at least 100 characters of content.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      // Create project record
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          title: title.trim() || content.slice(0, 60).trim() + '…',
          source_content: content.trim(),
          status: 'generating',
        })
        .select('id')
        .single()

      if (projectError || !project) {
        setError('Failed to create project. Please try again.')
        setLoading(false)
        return
      }

      // Navigate to project page which will trigger generation
      router.push(`/dashboard/project/${project.id}?generate=true`)
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0F1B2D]" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
          New Project
        </h1>
        <p className="text-sm text-[#717185] mt-1">
          Paste your content below. We&apos;ll turn it into 30+ outputs across 8 formats.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-[#0F1B2D] mb-1.5">
            Project title <span className="text-[#717185] font-normal">(optional)</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Q1 Product Launch Post"
            className="w-full bg-white border border-[#E8E6E1] rounded-lg px-4 py-3 text-sm text-[#0F1B2D] focus:outline-none focus:ring-2 focus:ring-[#C6A04E] focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-[#0F1B2D] mb-1.5">
            Source content <span className="text-red-500">*</span>
          </label>
          <div className="mb-2 flex flex-wrap gap-1.5">
            {CONTENT_EXAMPLES.map((ex) => (
              <span key={ex} className="text-xs text-[#717185] bg-[#F3F1ED] px-2.5 py-1 rounded-full">
                {ex}
              </span>
            ))}
          </div>
          <textarea
            id="content"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={16}
            placeholder="Paste your blog post, podcast transcript, case study, or any long-form content here..."
            className="w-full bg-white border border-[#E8E6E1] rounded-xl px-4 py-3 text-sm text-[#0F1B2D] focus:outline-none focus:ring-2 focus:ring-[#C6A04E] focus:border-transparent resize-none leading-relaxed"
          />
          <p className="text-xs text-[#717185] mt-1.5">
            {content.length} characters · Minimum 100 · More content = better outputs
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#C6A04E] hover:bg-[#D4B574] disabled:opacity-60 text-white font-semibold px-8 py-3 rounded-lg text-sm transition-colors"
          >
            {loading ? 'Creating project…' : 'Generate 30+ outputs →'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-[#717185] hover:text-[#0F1B2D] transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
