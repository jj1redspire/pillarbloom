import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { PRODUCT_PROMPTS } from '@/lib/generation-prompts'

export const maxDuration = 60

export async function POST(request: Request) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { content, selectedTypes, projectId } = await request.json()

  if (!content || content.trim().length < 100) {
    return new Response('Content too short', { status: 400 })
  }

  if (!selectedTypes || selectedTypes.length === 0) {
    return new Response('Select at least one product type', { status: 400 })
  }

  // Check usage limit + fetch voice profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, products_used_this_month, voice_profile')
    .eq('id', user.id)
    .single()

  const limits: Record<string, number> = {
    free: 0, trial: 99, starter: 1, pro: 5, creator: 999, agency: 999, expired: 0
  }
  const used = profile?.products_used_this_month ?? 0
  const limit = limits[profile?.plan ?? 'trial'] ?? 0

  if (used >= limit && profile?.plan !== 'trial') {
    return new Response(
      JSON.stringify({ error: 'limit_reached', plan: profile?.plan, used, limit }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const voiceProfile = profile?.voice_profile
  const voiceInstruction = voiceProfile
    ? `\n\nMATCH THIS CREATOR'S WRITING VOICE EXACTLY. Here is their voice profile:\n${JSON.stringify(voiceProfile, null, 2)}\n\nMirror their tone, sentence length, vocabulary level, and personality. The output should sound like THEM, not like AI.`
    : ''

  const selected = selectedTypes.filter((t: string) => PRODUCT_PROMPTS[t])

  const sections = selected
    .map((key: string) => {
      const { title, prompt } = PRODUCT_PROMPTS[key]
      return `## ${title.toUpperCase()} [${key}]\n${prompt}`
    })
    .join('\n\n---\n\n')

  const systemPrompt = `You are a digital product creation expert. Transform the user's source content into professional, sellable digital products. Each output should be comprehensive, well-structured, and ready for the creator to sell or use as a lead magnet. Maintain the creator's voice and expertise throughout. Format with clear headings, sections, and actionable content.${voiceInstruction}

Use EXACTLY these section markers between each product:
${selected.map((k: string) => `===PRODUCT:${k}===`).join('\n')}`

  const userPrompt = `SOURCE CONTENT:\n${content}\n\n---\n\nGenerate each digital product below. Use the exact section markers.\n\n${sections}`

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

        await saveProductOutputs(supabase, projectId, fullText, selected)

        await supabase
          .from('profiles')
          .update({ products_used_this_month: used + 1 })
          .eq('id', user.id)

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
async function saveProductOutputs(supabase: any, projectId: string, fullText: string, selectedTypes: string[]) {
  if (!projectId) return

  const outputs: { project_id: string; type: string; content: string }[] = []

  for (const key of selectedTypes) {
    const marker = `===PRODUCT:${key}===`
    const start = fullText.indexOf(marker)
    if (start === -1) continue

    const contentStart = start + marker.length
    const nextIdx = selectedTypes
      .map((k) => {
        const idx = fullText.indexOf(`===PRODUCT:${k}===`, contentStart)
        return idx > -1 ? idx : Infinity
      })
      .filter((i) => i > contentStart)
      .reduce((min, i) => Math.min(min, i), Infinity)

    const content = fullText.slice(contentStart, nextIdx === Infinity ? undefined : nextIdx).trim()
    if (content) outputs.push({ project_id: projectId, type: key, content })
  }

  if (outputs.length > 0) {
    await supabase.from('digital_product_outputs').insert(outputs)
    await supabase.from('digital_product_projects').update({ status: 'complete' }).eq('id', projectId)
  }
}
