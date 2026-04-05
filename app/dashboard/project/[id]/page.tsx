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
  executive_summary: { title: 'Exec Summary', icon: '📋' },
}

// PDF export makes sense for long-form outputs
const PDF_ELIGIBLE = new Set(['newsletter', 'lead_magnet', 'email_campaign', 'executive_summary'])

type Output = { id: string; type: string; content: string; is_edited: boolean }
type Project = { id: string; title: string; source_content: string; status: string; created_at: string }
type VoiceProfile = Record<string, unknown>

function stripMarkdown(md: string): string {
  return md
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/^>\s+/gm, '')
    .replace(/`{1,3}([^`]+)`{1,3}/g, '$1')
    .replace(/^[-*+]\s+/gm, '• ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function computeQualityStats(text: string, voiceProfile: VoiceProfile | null) {
  const words = text.trim().split(/\s+/).filter(Boolean)
  const wordCount = words.length
  const readingTime = Math.max(1, Math.round(wordCount / 238))

  let voiceMatch: number | null = null
  if (voiceProfile && wordCount > 0) {
    const checks: boolean[] = []
    const lowerText = text.toLowerCase()
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 3)
    const avgWords = wordCount / Math.max(1, sentences.length)

    const style = voiceProfile.sentence_style as string | undefined
    if (style === 'short') checks.push(avgWords < 16)
    else if (style === 'long') checks.push(avgWords > 22)
    else checks.push(avgWords >= 10 && avgWords <= 25)

    const tones = (voiceProfile.tone as string[] | undefined) ?? []
    if (tones.length > 0) checks.push(tones.some((t) => lowerText.includes(t.toLowerCase())))

    const personality = (voiceProfile.personality as string[] | undefined) ?? []
    if (personality.length > 0) checks.push(personality.some((p) => lowerText.includes(p.toLowerCase())))

    const avoid = (voiceProfile.avoid as string[] | undefined) ?? []
    if (avoid.length > 0) checks.push(!avoid.some((a) => lowerText.includes(a.toLowerCase())))

    const sigPhrases = (voiceProfile.signature_phrases as string[] | undefined) ?? []
    if (sigPhrases.length > 0) checks.push(sigPhrases.some((p) => lowerText.includes(p.toLowerCase())))

    const passed = checks.filter(Boolean).length
    voiceMatch = Math.round(52 + (passed / Math.max(1, checks.length)) * 46)
  }

  return { wordCount, readingTime, voiceMatch }
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
  const [copied, setCopied] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [regenTab, setRegenTab] = useState<string | null>(null)
  const [regenStream, setRegenStream] = useState('')
  const [voiceProfile, setVoiceProfile] = useState<VoiceProfile | null>(null)

  // Feedback (regenerate with feedback)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackText, setFeedbackText] = useState('')

  // Save as template modal
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [templateSaving, setTemplateSaving] = useState(false)
  const [templateSaved, setTemplateSaved] = useState(false)

  const loadProject = useCallback(async () => {
    const supabase = createClient()
    const { data: proj } = await supabase
      .from('projects').select('*').eq('id', id).single()

    if (!proj) { router.push('/dashboard'); return }
    setProject(proj)

    // Load voice profile separately (non-blocking)
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('profiles').select('voice_profile').eq('id', user.id).single()
        .then(({ data }) => { if (data?.voice_profile) setVoiceProfile(data.voice_profile as VoiceProfile) })
    })

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

      if (response.status === 429) {
        const data = await response.json()
        setError(`You've used all ${data.limit} repurposes this month (${data.used}/${data.limit}). Upgrade your plan to continue.`)
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
            if (data === '[DONE]') { setStreaming(false); await loadProject(); return }
            try {
              const parsed = JSON.parse(data)
              if (parsed.text) setStreamText((prev) => prev + parsed.text)
              if (parsed.error) { setError(parsed.error); setStreaming(false); return }
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

  async function regenOutput(type: string, feedback?: string) {
    if (!project) return
    setRegenTab(type)
    setRegenStream('')
    setShowFeedback(false)
    setFeedbackText('')

    try {
      const response = await fetch('/api/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id, outputType: type, projectKind: 'content', feedback }),
      })
      if (!response.ok) throw new Error('Regeneration failed')

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
            if (data === '[DONE]') { setRegenTab(null); await loadProject(); return }
            try {
              const parsed = JSON.parse(data)
              if (parsed.text) setRegenStream((prev) => prev + parsed.text)
            } catch { /* ignore */ }
          }
        }
      }
      setRegenTab(null)
      await loadProject()
    } catch {
      setRegenTab(null)
    }
  }

  useEffect(() => {
    loadProject().then((proj) => {
      if (proj && shouldGenerate && proj.status === 'generating') startGeneration(proj)
    })
  }, [loadProject, shouldGenerate, startGeneration])

  async function saveEdit(type: string) {
    const supabase = createClient()
    const output = outputs.find((o) => o.type === type)
    if (!output) return
    await supabase.from('outputs').update({ content: editContent[type], is_edited: true }).eq('id', output.id)
  }

  async function copy(text: string, kind: string) {
    await navigator.clipboard.writeText(text)
    setCopied(kind)
    setTimeout(() => setCopied(null), 2000)
  }

  function downloadMarkdown(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${filename}.md`; a.click()
    URL.revokeObjectURL(url)
  }

  async function downloadPDF(content: string, title: string) {
    const { downloadEbookPDF } = await import('@/lib/pdf-export')
    await downloadEbookPDF(content, title)
  }

  async function saveTemplate() {
    if (!templateName.trim() || !project) return
    setTemplateSaving(true)
    const currentOutput = outputs.find((o) => o.type === activeTab)
    const content = editContent[activeTab] || currentOutput?.content || ''
    await fetch('/api/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: templateName.trim(),
        output_type: activeTab,
        project_kind: 'content',
        content,
      }),
    })
    setTemplateSaving(false)
    setTemplateSaved(true)
    setShowTemplateModal(false)
    setTemplateName('')
    setTimeout(() => setTemplateSaved(false), 3000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex gap-1">
          {[1, 2, 3].map((i) => <span key={i} className="typing-dot w-2 h-2 rounded-full bg-[#C6A04E] inline-block" />)}
        </div>
      </div>
    )
  }
  if (!project) return null

  const currentOutput = outputs.find((o) => o.type === activeTab)
  const currentText = editContent[activeTab] || currentOutput?.content || ''
  const isRegenerating = regenTab === activeTab
  const stats = currentText ? computeQualityStats(currentText, voiceProfile) : null

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#1B2A4A] tracking-tight">{project.title}</h1>
            <p className="text-xs text-[#6B7280] mt-1">
              {new Date(project.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              {' · '}{outputs.length} of 8 outputs generated
            </p>
          </div>
          {!streaming && project.status !== 'complete' && (
            <button onClick={() => startGeneration(project)} className="text-sm font-semibold text-[#C6A04E] hover:underline">
              Generate all
            </button>
          )}
        </div>
      </div>

      {streaming && (
        <div className="bg-[#1B2A4A] rounded-xl p-6 mb-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => <span key={i} className="typing-dot w-2 h-2 rounded-full bg-[#C6A04E] inline-block" />)}
            </div>
            <span className="text-sm font-medium text-blue-200">Generating your outputs…</span>
          </div>
          <div className="bg-white/5 rounded-lg p-4 max-h-40 overflow-y-auto">
            <pre className="text-xs text-blue-100 whitespace-pre-wrap font-mono leading-relaxed">{streamText || 'Starting…'}</pre>
          </div>
          <p className="text-xs text-blue-300 mt-2">This takes about 30–60 seconds. Don&apos;t close this tab.</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4 flex items-center justify-between gap-3 flex-wrap">
          <span>{error}</span>
          {error.includes('limit') || error.includes('Upgrade') ? (
            <a href="/dashboard/settings" className="font-semibold underline whitespace-nowrap">Upgrade plan →</a>
          ) : (
            <button onClick={() => startGeneration(project)} className="font-semibold underline whitespace-nowrap">Try again</button>
          )}
        </div>
      )}

      {outputs.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#e8eaed] overflow-hidden">
          {/* Tab bar */}
          <div className="flex overflow-x-auto border-b border-[#e8eaed] bg-[#fafafa]">
            {Object.entries(OUTPUT_LABELS).map(([key, { title, icon }]) => {
              const hasOutput = outputs.some((o) => o.type === key)
              return (
                <button
                  key={key}
                  onClick={() => { setActiveTab(key); setShowFeedback(false); setFeedbackText('') }}
                  disabled={!hasOutput && regenTab !== key}
                  className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === key
                      ? 'border-[#C6A04E] text-[#1B2A4A] bg-white'
                      : 'border-transparent text-[#6B7280] hover:text-[#1B2A4A]'
                  } ${!hasOutput && regenTab !== key ? 'opacity-40' : ''}`}
                >
                  <span>{icon}</span>
                  {title}
                  {regenTab === key && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C6A04E] inline-block animate-pulse ml-0.5" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Content area */}
          <div className="p-6">
            {isRegenerating ? (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => <span key={i} className="typing-dot w-1.5 h-1.5 rounded-full bg-[#C6A04E] inline-block" />)}
                  </div>
                  <span className="text-xs text-[#6B7280]">Regenerating {OUTPUT_LABELS[activeTab]?.title}…</span>
                </div>
                <div className="bg-[#fafafa] border border-[#e8eaed] rounded-xl px-4 py-3 min-h-40 max-h-96 overflow-y-auto">
                  <pre className="text-xs text-[#6B7280] whitespace-pre-wrap font-mono leading-relaxed">{regenStream || 'Analyzing your content…'}</pre>
                </div>
              </div>
            ) : currentOutput ? (
              <div>
                {/* Quality stats bar */}
                {stats && stats.wordCount > 0 && (
                  <div className="flex items-center gap-4 mb-4 px-3 py-2 bg-[#fafafa] border border-[#e8eaed] rounded-lg">
                    <span className="text-xs text-[#6B7280]">
                      <span className="font-semibold text-[#1B2A4A]">{stats.wordCount.toLocaleString()}</span> words
                    </span>
                    <span className="text-[#e8eaed]">·</span>
                    <span className="text-xs text-[#6B7280]">
                      <span className="font-semibold text-[#1B2A4A]">{stats.readingTime} min</span> read
                    </span>
                    {stats.voiceMatch !== null && (
                      <>
                        <span className="text-[#e8eaed]">·</span>
                        <span className="text-xs text-[#6B7280] flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${stats.voiceMatch >= 80 ? 'bg-green-400' : stats.voiceMatch >= 65 ? 'bg-[#C6A04E]' : 'bg-[#9CA3AF]'}`} />
                          Voice match <span className="font-semibold text-[#1B2A4A]">{stats.voiceMatch}%</span>
                        </span>
                      </>
                    )}
                    {templateSaved && (
                      <>
                        <span className="text-[#e8eaed]">·</span>
                        <span className="text-xs text-green-600 font-medium">✓ Template saved</span>
                      </>
                    )}
                  </div>
                )}

                {/* Action bar */}
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <h2 className="font-semibold text-[#1B2A4A] text-sm">
                    {OUTPUT_LABELS[activeTab]?.title}
                    {currentOutput.is_edited && <span className="ml-2 text-xs text-[#9CA3AF] font-normal">· edited</span>}
                  </h2>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => { setShowFeedback((v) => !v); }}
                      className="flex items-center gap-1.5 text-xs font-medium text-[#6B7280] hover:text-[#1B2A4A] bg-[#fafafa] hover:bg-[#f0f0f0] border border-[#e8eaed] px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      ↻ Re-generate
                    </button>
                    <button
                      onClick={() => { setShowTemplateModal((v) => !v); setTemplateName('') }}
                      className="flex items-center gap-1.5 text-xs font-medium text-[#6B7280] hover:text-[#1B2A4A] bg-[#fafafa] hover:bg-[#f0f0f0] border border-[#e8eaed] px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      📁 Save template
                    </button>
                    <button
                      onClick={() => copy(currentText, 'md')}
                      className="flex items-center gap-1.5 text-xs font-medium text-[#6B7280] hover:text-[#1B2A4A] bg-[#fafafa] hover:bg-[#f0f0f0] border border-[#e8eaed] px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      {copied === 'md' ? '✓ Copied!' : '📋 Copy Markdown'}
                    </button>
                    <button
                      onClick={() => copy(stripMarkdown(currentText), 'plain')}
                      className="flex items-center gap-1.5 text-xs font-medium text-[#6B7280] hover:text-[#1B2A4A] bg-[#fafafa] hover:bg-[#f0f0f0] border border-[#e8eaed] px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      {copied === 'plain' ? '✓ Copied!' : '📄 Copy Plain'}
                    </button>
                    <button
                      onClick={() => downloadMarkdown(currentText, `${project.title}-${activeTab}`)}
                      className="flex items-center gap-1.5 text-xs font-medium text-[#6B7280] hover:text-[#1B2A4A] bg-[#fafafa] hover:bg-[#f0f0f0] border border-[#e8eaed] px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      ↓ .md
                    </button>
                    {PDF_ELIGIBLE.has(activeTab) && (
                      <button
                        onClick={() => downloadPDF(currentText, project.title)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#1B2A4A] hover:bg-[#2D4270] px-2.5 py-1.5 rounded-lg transition-colors"
                      >
                        ↓ PDF
                      </button>
                    )}
                  </div>
                </div>

                {/* Regenerate with feedback panel */}
                {showFeedback && (
                  <div className="mb-4 p-4 bg-[#fafafa] border border-[#e8eaed] rounded-xl animate-fade-in">
                    <p className="text-xs font-semibold text-[#1B2A4A] mb-2">Refine this output</p>
                    <p className="text-xs text-[#6B7280] mb-3">Tell the AI what to change — it will regenerate while keeping the same structure.</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && feedbackText.trim()) regenOutput(activeTab, feedbackText) }}
                        placeholder="e.g. make it more conversational, shorter paragraphs, add a stronger hook"
                        className="flex-1 border border-[#e8eaed] rounded-lg px-3 py-2 text-xs text-[#1B2A4A] focus:outline-none focus:ring-2 focus:ring-[#C6A04E] focus:border-transparent bg-white"
                        autoFocus
                      />
                      <button
                        onClick={() => regenOutput(activeTab, feedbackText || undefined)}
                        className="text-xs font-semibold text-white bg-[#C6A04E] hover:bg-[#D4B574] px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                      >
                        {feedbackText.trim() ? 'Apply & regenerate' : 'Regenerate'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Save template modal */}
                {showTemplateModal && (
                  <div className="mb-4 p-4 bg-[#fafafa] border border-[#C6A04E]/25 rounded-xl animate-fade-in">
                    <p className="text-xs font-semibold text-[#1B2A4A] mb-1">Save as template</p>
                    <p className="text-xs text-[#6B7280] mb-3">Give this output a name so you can reuse it across projects.</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && templateName.trim()) saveTemplate() }}
                        placeholder="e.g. Newsletter — casual tone, 600 words"
                        className="flex-1 border border-[#e8eaed] rounded-lg px-3 py-2 text-xs text-[#1B2A4A] focus:outline-none focus:ring-2 focus:ring-[#C6A04E] focus:border-transparent bg-white"
                        autoFocus
                      />
                      <button
                        onClick={saveTemplate}
                        disabled={!templateName.trim() || templateSaving}
                        className="text-xs font-semibold text-white bg-[#C6A04E] hover:bg-[#D4B574] disabled:opacity-50 px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                      >
                        {templateSaving ? 'Saving…' : 'Save'}
                      </button>
                      <button
                        onClick={() => setShowTemplateModal(false)}
                        className="text-xs text-[#9CA3AF] hover:text-[#6B7280] px-2 py-2 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <textarea
                  value={currentText}
                  onChange={(e) => setEditContent((prev) => ({ ...prev, [activeTab]: e.target.value }))}
                  onBlur={() => saveEdit(activeTab)}
                  rows={22}
                  className="w-full bg-[#fafafa] border border-[#e8eaed] rounded-xl px-4 py-3 text-sm text-[#1B2A4A] focus:outline-none focus:ring-2 focus:ring-[#C6A04E] focus:border-transparent resize-none leading-relaxed font-mono"
                />
                <p className="text-xs text-[#9CA3AF] mt-2">Click to edit. Changes save automatically when you click away.</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-sm text-[#9CA3AF] mb-3">Output not yet generated</p>
                <button
                  onClick={() => regenOutput(activeTab)}
                  className="text-xs font-medium text-[#C6A04E] hover:underline"
                >
                  Generate {OUTPUT_LABELS[activeTab]?.title} →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
