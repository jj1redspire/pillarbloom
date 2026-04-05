'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const OUTPUT_LABELS: Record<string, { title: string; icon: string }> = {
  linkedin_post: { title: 'LinkedIn Post', icon: '💼' },
  email_campaign: { title: 'Email Campaign', icon: '📧' },
  tweet_thread: { title: 'Tweet Thread', icon: '🐦' },
  lead_magnet: { title: 'Lead Magnet', icon: '🎁' },
  video_script: { title: 'Video Script', icon: '🎬' },
  key_quote: { title: 'Key Quotes', icon: '💬' },
  newsletter: { title: 'Newsletter', icon: '📰' },
  executive_summary: { title: 'Exec Summary', icon: '📋' },
  ebook: { title: 'Ebook / PDF', icon: '📖' },
  mini_course: { title: 'Mini-Course', icon: '🎓' },
  email_course: { title: 'Email Course', icon: '📧' },
  workbook: { title: 'Workbook', icon: '📝' },
  checklist: { title: 'Checklist', icon: '✅' },
  product_description: { title: 'Sales Copy', icon: '💰' },
}

type Template = {
  id: string
  name: string
  output_type: string
  project_kind: string
  content: string
  created_at: string
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/templates')
      .then((r) => r.json())
      .then((d) => { setTemplates(d.templates ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function copyTemplate(t: Template) {
    await navigator.clipboard.writeText(t.content)
    setCopied(t.id)
    setTimeout(() => setCopied(null), 2000)
  }

  async function deleteTemplate(id: string) {
    if (!confirm('Delete this template?')) return
    setDeleting(id)
    await fetch('/api/templates', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setTemplates((prev) => prev.filter((t) => t.id !== id))
    setDeleting(null)
    if (activeId === id) setActiveId(null)
  }

  const activeTemplate = templates.find((t) => t.id === activeId)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex gap-1">
          {[1, 2, 3].map((i) => (
            <span key={i} className="typing-dot w-2 h-2 rounded-full bg-[#C6A04E] inline-block" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#1B2A4A] tracking-tight">Templates</h1>
        <p className="text-xs text-[#6B7280] mt-1">
          Saved output formats you can copy and reuse across projects.
        </p>
      </div>

      {templates.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-[#e8eaed] p-12 text-center">
          <div className="w-12 h-12 bg-[#fafafa] rounded-2xl border border-[#e8eaed] flex items-center justify-center text-2xl mx-auto mb-4">
            📁
          </div>
          <h2 className="text-sm font-semibold text-[#1B2A4A] mb-2">No templates saved yet</h2>
          <p className="text-xs text-[#9CA3AF] mb-5 max-w-xs mx-auto">
            When you generate an output you like, click &ldquo;Save as template&rdquo; in the action bar to store it here.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C6A04E] hover:underline"
          >
            Go to your projects →
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {/* Template list */}
          <div className="md:col-span-1 space-y-2">
            {templates.map((t) => {
              const label = OUTPUT_LABELS[t.output_type] ?? { title: t.output_type, icon: '📄' }
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveId(t.id === activeId ? null : t.id)}
                  className={`w-full text-left bg-white rounded-xl border px-4 py-3.5 transition-all hover:shadow-sm ${
                    activeId === t.id
                      ? 'border-[#C6A04E] shadow-sm ring-1 ring-[#C6A04E]/20'
                      : 'border-[#e8eaed]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base flex-shrink-0">{label.icon}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#1B2A4A] truncate">{t.name}</p>
                        <p className="text-[10px] text-[#9CA3AF] mt-0.5">{label.title}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteTemplate(t.id) }}
                      disabled={deleting === t.id}
                      className="text-[#9CA3AF] hover:text-red-500 transition-colors text-xs flex-shrink-0 mt-0.5"
                      title="Delete template"
                    >
                      {deleting === t.id ? '…' : '✕'}
                    </button>
                  </div>
                  <p className="text-[10px] text-[#9CA3AF] mt-2">
                    {new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </button>
              )
            })}
          </div>

          {/* Preview */}
          <div className="md:col-span-2">
            {activeTemplate ? (
              <div className="bg-white rounded-2xl border border-[#e8eaed] overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#e8eaed] bg-[#fafafa]">
                  <div className="flex items-center gap-2">
                    <span>{OUTPUT_LABELS[activeTemplate.output_type]?.icon ?? '📄'}</span>
                    <span className="text-sm font-semibold text-[#1B2A4A]">{activeTemplate.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => copyTemplate(activeTemplate)}
                      className="flex items-center gap-1.5 text-xs font-medium text-[#6B7280] hover:text-[#1B2A4A] bg-white hover:bg-[#f0f0f0] border border-[#e8eaed] px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      {copied === activeTemplate.id ? '✓ Copied!' : '📋 Copy'}
                    </button>
                    <button
                      onClick={() => {
                        const blob = new Blob([activeTemplate.content], { type: 'text/markdown' })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = `${activeTemplate.name.toLowerCase().replace(/\s+/g, '-')}.md`
                        a.click()
                        URL.revokeObjectURL(url)
                      }}
                      className="flex items-center gap-1.5 text-xs font-medium text-[#6B7280] hover:text-[#1B2A4A] bg-white hover:bg-[#f0f0f0] border border-[#e8eaed] px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      ↓ .md
                    </button>
                  </div>
                </div>
                <div className="p-5 max-h-[520px] overflow-y-auto">
                  <pre className="text-xs text-[#374151] whitespace-pre-wrap font-mono leading-relaxed">
                    {activeTemplate.content}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-[#e8eaed] h-48 flex items-center justify-center">
                <p className="text-sm text-[#9CA3AF]">Select a template to preview</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
