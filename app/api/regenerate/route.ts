import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { OUTPUT_PROMPTS, PRODUCT_PROMPTS } from '@/lib/generation-prompts'

export const maxDuration = 60

export async function POST(request: Request) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { projectId, outputType, projectKind, feedback } = await request.json()
  if (!projectId || !outputType || !projectKind) {
    return new Response('Missing required fields', { status: 400 })
  }
  const feedbackInstruction = feedback?.trim()
    ? `\n\nUSER FEEDBACK — apply this to the regenerated output:\n"${feedback.trim()}"\nKeep the same structure and format but incorporate this feedback exactly.`
    : ''

  // Load project source content
  const table = projectKind === 'product' ? 'digital_product_projects' : 'projects'
  const { data: project } = await supabase
    .from(table)
    .select('source_content, user_id')
    .eq('id', projectId)
    .single()

  if (!project || project.user_id !== user.id) {
    return new Response('Project not found', { status: 404 })
  }

  // Load voice profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('voice_profile')
    .eq('id', user.id)
    .single()

  const voiceProfile = profile?.voice_profile
  const voiceInstruction = voiceProfile
    ? `\n\nMATCH THIS CREATOR'S WRITING VOICE EXACTLY. Here is their voice profile:\n${JSON.stringify(voiceProfile, null, 2)}\n\nMirror their tone, sentence length, vocabulary level, and personality. The output should sound like THEM, not like AI.`
    : ''

  // Get the prompt for this output type
  const allPrompts = { ...OUTPUT_PROMPTS, ...PRODUCT_PROMPTS }
  const promptDef = allPrompts[outputType]
  if (!promptDef) return new Response('Unknown output type', { status: 400 })

  const isProduct = projectKind === 'product'
  const marker = isProduct ? `===PRODUCT:${outputType}===` : `===SECTION:${outputType}===`

  const systemPrompt = isProduct
    ? `You are a digital product creation expert. Transform the user's source content into a professional, sellable digital product. The output should be comprehensive, well-structured, and ready for the creator to sell or use as a lead magnet. Format with clear headings, sections, and actionable content.${voiceInstruction}`
    : `You are an expert content strategist and copywriter. Your job is to repurpose source content into the requested format while preserving the core message, terminology, and positioning. Create platform-native content that is complete and ready to publish with minor tweaks.${voiceInstruction}`

  const userPrompt = `SOURCE CONTENT:\n${project.source_content}\n\n---\n\nGenerate ONLY this single output type. Start immediately with the section marker, then the content.\n\n${marker}\n\n${promptDef.prompt}${feedbackInstruction}`

  const encoder = new TextEncoder()
  const outputsTable = isProduct ? 'digital_product_outputs' : 'outputs'

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = await client.messages.stream({
          model: 'claude-sonnet-4-6',
          max_tokens: 4000,
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

        // Extract content from the marker
        const start = fullText.indexOf(marker)
        const content = start !== -1
          ? fullText.slice(start + marker.length).trim()
          : fullText.trim()

        if (content) {
          // Upsert: update if exists, insert if not
          const { data: existing } = await supabase
            .from(outputsTable)
            .select('id')
            .eq('project_id', projectId)
            .eq('type', outputType)
            .single()

          if (existing) {
            await supabase
              .from(outputsTable)
              .update({ content, is_edited: false })
              .eq('id', existing.id)
          } else {
            await supabase
              .from(outputsTable)
              .insert({ project_id: projectId, type: outputType, content })
          }
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Regeneration failed'
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
