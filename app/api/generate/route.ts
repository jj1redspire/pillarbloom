import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { OUTPUT_PROMPTS } from '@/lib/generation-prompts'

export const maxDuration = 60

export async function POST(request: Request) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { content, projectId } = await request.json()

  if (!content || typeof content !== 'string' || content.trim().length < 50) {
    return new Response('Content too short', { status: 400 })
  }

  // Fetch voice profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, repurposes_used_this_month, pieces_used_this_month, voice_profile')
    .eq('id', user.id)
    .single()

  const voiceProfile = profile?.voice_profile
  const voiceInstruction = voiceProfile
    ? `\n\nMATCH THIS CREATOR'S WRITING VOICE EXACTLY. Here is their voice profile:\n${JSON.stringify(voiceProfile, null, 2)}\n\nMirror their tone, sentence length, vocabulary level, and personality. The output should sound like THEM, not like AI.`
    : ''

  // Build full prompt
  const outputSections = Object.entries(OUTPUT_PROMPTS)
    .map(([key, { title, prompt }]) => `## ${title.toUpperCase()} [${key}]\n${prompt}`)
    .join('\n\n---\n\n')

  const systemPrompt = `You are an expert content strategist and copywriter. Your job is to repurpose source content into multiple formats while preserving the core message, terminology, and positioning.

CRITICAL RULES:
- Preserve all specific statistics, names, and claims from the source
- Match the expertise level and tone of the original author
- Create platform-native content (not just reformatted text)
- Each output must be complete and ready to publish (with minor tweaks)
- Separate each output with: ===SECTION:output_type_key===${voiceInstruction}

Use EXACTLY these section markers in this order:
===SECTION:linkedin_post===
===SECTION:email_campaign===
===SECTION:tweet_thread===
===SECTION:lead_magnet===
===SECTION:video_script===
===SECTION:key_quote===
===SECTION:newsletter===
===SECTION:executive_summary===`

  const userPrompt = `SOURCE CONTENT:
${content}

---

Generate all 8 content types below. Use the exact section markers specified.

${outputSections}`

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = await client.messages.stream({
          model: 'claude-sonnet-4-6',
          max_tokens: 8000,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
        })

        let fullText = ''

        for await (const chunk of anthropicStream) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            const text = chunk.delta.text
            fullText += text
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
          }
        }

        await saveOutputs(supabase, projectId, fullText)

        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Generation failed'
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`))
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function saveOutputs(supabase: any, projectId: string, fullText: string) {
  if (!projectId) return

  const sectionKeys = Object.keys(OUTPUT_PROMPTS)
  const outputs: { project_id: string; type: string; content: string }[] = []

  for (const key of sectionKeys) {
    const marker = `===SECTION:${key}===`
    const start = fullText.indexOf(marker)
    if (start === -1) continue

    const contentStart = start + marker.length
    const nextMarkerIndex = sectionKeys
      .map((k) => {
        const m = `===SECTION:${k}===`
        const idx = fullText.indexOf(m, contentStart)
        return idx > -1 ? idx : Infinity
      })
      .filter((i) => i > contentStart)
      .reduce((min, i) => Math.min(min, i), Infinity)

    const content = fullText
      .slice(contentStart, nextMarkerIndex === Infinity ? undefined : nextMarkerIndex)
      .trim()

    if (content) {
      outputs.push({ project_id: projectId, type: key, content })
    }
  }

  if (outputs.length > 0) {
    await supabase.from('outputs').insert(outputs)
    await supabase
      .from('projects')
      .update({ status: 'complete' })
      .eq('id', projectId)
  }
}
