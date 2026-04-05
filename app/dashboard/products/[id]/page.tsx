'use client'

import { useEffect, useState, useCallback, use } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const PRODUCT_LABELS: Record<string, { title: string; icon: string }> = {
  ebook: { title: 'Ebook / PDF', icon: '📖' },
  mini_course: { title: 'Mini-Course', icon: '🎓' },
  email_course: { title: 'Email Course', icon: '📧' },
  workbook: { title: 'Workbook', icon: '📝' },
  checklist: { title: 'Checklist', icon: '✅' },
  product_description: { title: 'Sales Copy', icon: '💰' },
}

type Output = { id: string; type: string; content: string; is_edited: boolean }
type Project = { id: string; title: string; source_content: string; selected_types: string[]; status: string; created_at: string }

export default function ProductViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const searchParams = useSearchParams()
  const router = useRouter()
  const shouldGenerate = searchParams.get('generate') === 'true'

  const [project, setProject] = useState<Project | null>(null)
  const [outputs, setOutputs] = useState<Output[]>([])
  const [activeTab, setActiveTab] = useState<string>('')
  const [streaming, setStreaming] = useState(false)
  const [streamText, setStreamText] = useState('')
  const [editContent, setEditContent] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadProject = useCallback(async () => {
    const supabase = createClient()
    const { data: proj } = await supabase
      .from('digital_product_projects')
      .select('*')
      .eq('id', id)
      .single()

    if (!proj) { router.push('/dashboard/products'); return }
    setProject(proj)

    const { data: outs } = await supabase
      .from('digital_product_outputs')
      .select('*')
      .eq('project_id', id)
      .order('created_at')

    if (outs && outs.length > 0) {
      setOutputs(outs)
      const edits: Record<string, string> = {}
      outs.forEach((o: Output) => { edits[o.type] = o.content })
      setEditContent(edits)
      setActiveTab(outs[0].type)
    } else if (proj.selected_types?.length > 0) {
      setActiveTab(proj.selected_types[0])
    }

    setLoading(false)
    return proj
  }, [id, router])

  const startGeneration = useCallback(async (proj: Project) => {
    setStreaming(true)
    setStreamText('')
    setError('')

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: proj.source_content,
          selectedTypes: proj.selected_types,
          projectId: proj.id,
        }),
      })

      if (response.status === 429) {
        const data = await response.json()
        setError(`You've reached your product generation limit (${data.used}/${data.limit}). Upgrade your plan to continue.`)
        setStreaming(false)
        return
      }

      if (!response.ok) throw new Error('Generation failed')

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              setStreaming(false)
              await loadProject()
              return
            }
            try {
              const parsed = JSON.parse(data)
              if (parsed.text) setStreamText((prev) => prev + parsed.text)
              if (parsed.error) {
                setError(parsed.error)
                setStreaming(false)
                return
              }
            } catch { /* ignore */ }
          }
        }
      }

      setStreaming(false)
      await loadProject()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
      setStreaming(false)
    }
  }, [loadProject])

  useEffect(() => {
    loadProject().then((proj) => {
      if (proj && shouldGenerate && proj.status === 'generating') {
        startGeneration(proj)
      }
    })
  }, [loadProject, shouldGenerate, startGeneration])

  async function saveEdit(type: string) {
    const supabase = createClient()
    const output = outputs.find((o) => o.type === type)
    if (!output) return
    await supabase
      .from('digital_product_outputs')
      .update({ content: editContent[type], is_edited: true })
      .eq('id', output.id)
  }

  async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function downloadAsText(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

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

  if (!project) return null

  const tabs = (project.selected_types ?? []).filter((t) => PRODUCT_LABELS[t])
  const currentOutput = outputs.find((o) => o.type === activeTab)

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[#1B2A4A] tracking-tight">{project.title}</h1>
          <p className="text-xs text-[#6B7280] mt-1">
            {new Date(project.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            {' · '}{outputs.length} of {tabs.length} products generated
          </p>
        </div>
        {!streaming && project.status !== 'complete' && (
          <button onClick={() => startGeneration(project)} className="text-sm font-medium text-[#C6A04E] hover:underline">
            Regenerate
          </button>
        )}
      </div>

      {/* Streaming indicator */}
      {streaming && (
        <div className="bg-[#1B2A4A] rounded-xl p-6 mb-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <span key={i} className="typing-dot w-2 h-2 rounded-full bg-[#C6A04E] inline-block" />
              ))}
            </div>
            <span className="text-sm font-medium text-blue-200">Building your digital products…</span>
          </div>
          <div className="bg-white/5 rounded-lg p-4 max-h-44 overflow-y-auto">
            <pre className="text-xs text-blue-100 whitespace-pre-wrap font-mono leading-relaxed">
              {streamText || 'Analyzing your content…'}
            </pre>
          </div>
          <p className="text-xs text-blue-300 mt-2">This takes 30–90 seconds depending on products selected. Don&apos;t close this tab.</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
          {error}
          {!error.includes('limit') && (
            <button onClick={() => startGeneration(project)} className="ml-3 font-semibold underline">Try again</button>
          )}
          {error.includes('limit') && (
            <a href="/dashboard/settings" className="ml-3 font-semibold underline">Upgrade plan →</a>
          )}
        </div>
      )}

      {outputs.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#e8eaed] overflow-hidden">
          {/* Tab bar */}
          <div className="flex overflow-x-auto border-b border-[#e8eaed] bg-[#fafafa]">
            {tabs.map((key) => {
              const { title, icon } = PRODUCT_LABELS[key] ?? { title: key, icon: '📄' }
              const hasOutput = outputs.some((o) => o.type === key)
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  disabled={!hasOutput}
                  className={`flex items-center gap-1.5 px-4 py-3.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === key
                      ? 'border-[#C6A04E] text-[#1B2A4A] bg-white'
                      : 'border-transparent text-[#6B7280] hover:text-[#1B2A4A]'
                  } ${!hasOutput ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <span>{icon}</span>
                  {title}
                </button>
              )
            })}
          </div>

          {/* Content */}
          <div className="p-6">
            {currentOutput ? (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-[#1B2A4A] text-sm">
                    {PRODUCT_LABELS[activeTab]?.title}
                    {currentOutput.is_edited && <span className="ml-2 text-xs text-[#9CA3AF] font-normal">· edited</span>}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => downloadAsText(editContent[activeTab] || currentOutput.content, `${project.title}-${activeTab}`)}
                      className="flex items-center gap-1.5 text-xs font-medium text-[#6B7280] hover:text-[#1B2A4A] bg-[#fafafa] hover:bg-[#f0f0f0] border border-[#e8eaed] px-3 py-1.5 rounded-lg transition-colors"
                    >
                      ↓ Download
                    </button>
                    <button
                      onClick={() => copyToClipboard(editContent[activeTab] || currentOutput.content)}
                      className="flex items-center gap-1.5 text-xs font-medium text-[#6B7280] hover:text-[#1B2A4A] bg-[#fafafa] hover:bg-[#f0f0f0] border border-[#e8eaed] px-3 py-1.5 rounded-lg transition-colors"
                    >
                      {copied ? '✓ Copied!' : '📋 Copy'}
                    </button>
                  </div>
                </div>

                <textarea
                  value={editContent[activeTab] ?? currentOutput.content}
                  onChange={(e) => setEditContent((prev) => ({ ...prev, [activeTab]: e.target.value }))}
                  onBlur={() => saveEdit(activeTab)}
                  rows={28}
                  className="w-full bg-[#fafafa] border border-[#e8eaed] rounded-xl px-4 py-3 text-sm text-[#1B2A4A] focus:outline-none focus:ring-2 focus:ring-[#C6A04E] focus:border-transparent resize-none leading-relaxed font-mono"
                />
                <p className="text-xs text-[#9CA3AF] mt-2">Click to edit. Changes save automatically when you click away.</p>
              </div>
            ) : (
              <div className="text-center py-12 text-[#9CA3AF] text-sm">
                {streaming ? 'Generating…' : 'Output not available'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
