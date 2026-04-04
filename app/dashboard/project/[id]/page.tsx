'use client'

import { useEffect, useState, useCallback, use } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const OUTPUT_LABELS: Record<string, { title: string; icon: string }> = {
  linkedin_post: { title: 'LinkedIn Post', icon: '💼' },
  email_campaign: { title: 'Email Campaign', icon: '📧' },
  tweet_thread: { title: 'Tweet Thread', icon: '🐦' },
  lead_magnet: { title: 'Lead Magnet', icon: '🎁' },
  video_script: { title: 'Video Script', icon: '🎬' },
  key_quote: { title: 'Key Quotes', icon: '💬' },
  newsletter: { title: 'Newsletter', icon: '📰' },
  executive_summary: { title: 'Executive Summary', icon: '📋' },
}

type Output = {
  id: string
  type: string
  content: string
  is_edited: boolean
}

type Project = {
  id: string
  title: string
  source_content: string
  status: string
  created_at: string
}

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const searchParams = useSearchParams()
  const router = useRouter()
  const shouldGenerate = searchParams.get('generate') === 'true'

  const [project, setProject] = useState<Project | null>(null)
  const [outputs, setOutputs] = useState<Output[]>([])
  const [activeTab, setActiveTab] = useState('linkedin_post')
  const [streaming, setStreaming] = useState(false)
  const [streamText, setStreamText] = useState('')
  const [editContent, setEditContent] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadProject = useCallback(async () => {
    const supabase = createClient()

    const { data: proj } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (!proj) {
      router.push('/dashboard')
      return
    }

    setProject(proj)

    const { data: outs } = await supabase
      .from('outputs')
      .select('*')
      .eq('project_id', id)
      .order('created_at')

    if (outs && outs.length > 0) {
      setOutputs(outs)
      const edits: Record<string, string> = {}
      outs.forEach((o: Output) => { edits[o.type] = o.content })
      setEditContent(edits)
    }

    setLoading(false)
    return proj
  }, [id, router])

  const startGeneration = useCallback(async (proj: Project) => {
    setStreaming(true)
    setStreamText('')
    setError('')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: proj.source_content, projectId: proj.id }),
      })

      if (!response.ok) {
        throw new Error('Generation failed')
      }

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
              // Reload outputs from DB
              await loadProject()
              return
            }
            try {
              const parsed = JSON.parse(data)
              if (parsed.text) {
                setStreamText((prev) => prev + parsed.text)
              }
              if (parsed.error) {
                setError(parsed.error)
                setStreaming(false)
                return
              }
            } catch {
              // ignore parse errors
            }
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
      .from('outputs')
      .update({ content: editContent[type], is_edited: true })
      .eq('id', output.id)
  }

  async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex gap-1">
          <span className="typing-dot w-2 h-2 rounded-full bg-[#C6A04E] inline-block"></span>
          <span className="typing-dot w-2 h-2 rounded-full bg-[#C6A04E] inline-block"></span>
          <span className="typing-dot w-2 h-2 rounded-full bg-[#C6A04E] inline-block"></span>
        </div>
      </div>
    )
  }

  if (!project) return null

  const currentOutput = outputs.find((o) => o.type === activeTab)

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#0F1B2D]" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              {project.title}
            </h1>
            <p className="text-xs text-[#717185] mt-1">
              {new Date(project.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              {' · '}
              {outputs.length} of 8 outputs generated
            </p>
          </div>
          {!streaming && project.status !== 'complete' && (
            <button
              onClick={() => startGeneration(project)}
              className="text-sm font-semibold text-[#C6A04E] hover:underline"
            >
              Regenerate
            </button>
          )}
        </div>
      </div>

      {/* Streaming progress */}
      {streaming && (
        <div className="bg-[#0F1B2D] rounded-xl p-6 mb-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex gap-1">
              <span className="typing-dot w-2 h-2 rounded-full bg-[#C6A04E] inline-block"></span>
              <span className="typing-dot w-2 h-2 rounded-full bg-[#C6A04E] inline-block"></span>
              <span className="typing-dot w-2 h-2 rounded-full bg-[#C6A04E] inline-block"></span>
            </div>
            <span className="text-sm font-medium text-blue-200">Generating your outputs…</span>
          </div>
          <div className="bg-white/5 rounded-lg p-4 max-h-40 overflow-y-auto">
            <pre className="text-xs text-blue-100 whitespace-pre-wrap font-mono leading-relaxed">
              {streamText || 'Starting generation…'}
            </pre>
          </div>
          <p className="text-xs text-blue-300 mt-2">This takes about 30-60 seconds. Don&apos;t close this tab.</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
          {error}
          <button
            onClick={() => startGeneration(project)}
            className="ml-3 font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Output tabs + content */}
      {outputs.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E8E6E1] overflow-hidden">
          {/* Tab bar */}
          <div className="flex overflow-x-auto border-b border-[#E8E6E1] bg-[#FAFAF8]">
            {Object.entries(OUTPUT_LABELS).map(([key, { title, icon }]) => {
              const hasOutput = outputs.some((o) => o.type === key)
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === key
                      ? 'border-[#C6A04E] text-[#0F1B2D]'
                      : 'border-transparent text-[#717185] hover:text-[#0F1B2D]'
                  } ${!hasOutput ? 'opacity-40' : ''}`}
                  disabled={!hasOutput}
                >
                  <span>{icon}</span>
                  {title}
                </button>
              )
            })}
          </div>

          {/* Content area */}
          <div className="p-6">
            {currentOutput ? (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-[#0F1B2D] text-sm">
                    {OUTPUT_LABELS[activeTab]?.title}
                    {currentOutput.is_edited && (
                      <span className="ml-2 text-xs text-[#717185] font-normal">· edited</span>
                    )}
                  </h2>
                  <button
                    onClick={() => copyToClipboard(editContent[activeTab] || currentOutput.content)}
                    className="flex items-center gap-1.5 text-xs font-medium text-[#717185] hover:text-[#0F1B2D] bg-[#F3F1ED] hover:bg-[#E8E6E1] px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {copied ? '✓ Copied!' : '📋 Copy'}
                  </button>
                </div>

                <textarea
                  value={editContent[activeTab] ?? currentOutput.content}
                  onChange={(e) => setEditContent((prev) => ({ ...prev, [activeTab]: e.target.value }))}
                  onBlur={() => saveEdit(activeTab)}
                  rows={20}
                  className="w-full bg-[#FAFAF8] border border-[#E8E6E1] rounded-xl px-4 py-3 text-sm text-[#0F1B2D] focus:outline-none focus:ring-2 focus:ring-[#C6A04E] focus:border-transparent resize-none leading-relaxed font-mono"
                />

                <p className="text-xs text-[#717185] mt-2">Click anywhere in the text to edit. Changes save automatically when you click away.</p>
              </div>
            ) : (
              <div className="text-center py-12 text-[#717185] text-sm">
                {streaming ? 'Generating…' : 'Output not available'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
