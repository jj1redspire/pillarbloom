import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

export const maxDuration = 60

const OUTPUT_PROMPTS: Record<string, { title: string; prompt: string }> = {
  linkedin_post: {
    title: 'LinkedIn Post',
    prompt: `Write a compelling LinkedIn post based on the content.
- 150-250 words
- Hook in first line (no "I" as first word)
- 3-5 key insights as short paragraphs or bullets
- End with a thought-provoking question or call to action
- Professional but conversational tone
- No hashtag spam (max 3 relevant hashtags at end)`,
  },
  email_campaign: {
    title: 'Email Campaign',
    prompt: `Create a 3-email nurture sequence based on the content.

Email 1 — SUBJECT LINE + BODY: Introduce the core concept, deliver immediate value, end with a question.
Email 2 — SUBJECT LINE + BODY: Go deeper on one specific insight, share a framework or checklist.
Email 3 — SUBJECT LINE + BODY: Address the main objection/hesitation, include a clear CTA.

Each email: 150-200 words. Conversational. Specific.`,
  },
  tweet_thread: {
    title: 'Tweet Thread',
    prompt: `Write a 10-tweet thread based on the content.

Tweet 1: Hook — bold claim or surprising stat (under 280 chars)
Tweets 2-9: One insight per tweet, numbered (2/, 3/, etc.), each under 280 chars
Tweet 10: Summary + CTA to follow or share

Make each tweet punchy and standalone. No filler.`,
  },
  lead_magnet: {
    title: 'Lead Magnet',
    prompt: `Create a lead magnet outline based on the content. Choose the best format (checklist, cheat sheet, or mini-guide).

Include:
- Compelling title
- Subtitle explaining the specific benefit
- 5-10 actionable items or sections
- Each item: one line headline + 1-2 sentence explanation
- Brief intro paragraph
- Closing CTA

Make it immediately useful. Someone should get value in 5 minutes.`,
  },
  video_script: {
    title: 'Video Script',
    prompt: `Write a 3-5 minute YouTube/LinkedIn video script based on the content.

Structure:
- HOOK (0:00-0:15): Pattern interrupt — bold statement or question
- PROMISE (0:15-0:30): What viewer will learn/get
- BODY (0:30-3:30): 3 main points, one story or example each
- CTA (last 30s): Subscribe/follow + one action to take

Include [B-ROLL SUGGESTION] notes. Write for spoken delivery — short sentences, natural rhythm.`,
  },
  key_quote: {
    title: 'Key Quotes',
    prompt: `Extract or create 8 quotable, shareable quotes from the content.

Requirements for each:
- 10-30 words
- Self-contained — makes sense without context
- Strong, confident, specific language
- Suitable for image overlay or social share

Format as numbered list. Vary the style: some bold claims, some counterintuitive, some actionable.`,
  },
  newsletter: {
    title: 'Newsletter Edition',
    prompt: `Write a newsletter edition based on the content. Style: smart, opinionated, like a trusted expert sharing what they actually think.

Structure:
- SUBJECT LINE (5-9 words, curiosity-driven)
- PREVIEW TEXT (under 90 chars)
- OPENING (2-3 sentences — hook + why this matters now)
- MAIN SECTION (400-500 words — key insight with examples, data, or story)
- TAKEAWAY (3-bullet summary)
- CLOSING (1-2 sentences + signature)

Opinionated. No corporate hedging.`,
  },
  executive_summary: {
    title: 'Executive Summary',
    prompt: `Write an executive summary of the content for a busy decision-maker.

Format:
- HEADLINE: One-sentence summary of the core message
- SITUATION: What problem or opportunity this addresses (2-3 sentences)
- KEY FINDINGS: 4-5 bullet points, each starting with a strong verb
- IMPLICATIONS: What this means for the reader's business/decisions (2-3 sentences)
- RECOMMENDED ACTION: One clear, specific next step

Total length: 250-350 words. No jargon. Crisp.`,
  },
}

export async function POST(request: Request) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  // Verify auth
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { content, projectId } = await request.json()

  if (!content || typeof content !== 'string' || content.trim().length < 50) {
    return new Response('Content too short', { status: 400 })
  }

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
- Separate each output with: ===SECTION:output_type_key===

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

        // Parse and save outputs to database
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
