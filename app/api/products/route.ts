import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

export const maxDuration = 60

const PRODUCT_PROMPTS: Record<string, { title: string; prompt: string }> = {
  ebook: {
    title: 'Ebook / PDF Lead Magnet',
    prompt: `Create a complete, professional ebook based on the source content.

Structure:
TITLE: [Compelling, benefit-driven title]
SUBTITLE: [Supporting subtitle clarifying the transformation]

INTRODUCTION (200 words): Hook, credibility statement, promise of transformation, how to use this ebook.

CHAPTER 1: [Title]
- Overview (100 words)
- 3-4 key concepts with explanations
- Real-world application example
- Chapter takeaway

CHAPTER 2: [Title]
- Same structure as Chapter 1

CHAPTER 3: [Title]
- Same structure as Chapter 1

CONCLUSION (150 words): Recap key insights, call to transformation, next steps CTA.

ABOUT THE AUTHOR: [2-3 sentence placeholder based on content expertise demonstrated]

Make it 2,000-2,500 words total. Professional, authoritative, immediately actionable.`,
  },
  mini_course: {
    title: 'Mini-Course Outline',
    prompt: `Design a complete mini-course from the source content.

COURSE TITLE: [Transformation-focused title]
TAGLINE: [One-sentence promise]
TARGET STUDENT: [Who this is for, what problem it solves]
LEARNING OUTCOMES: List 5 specific skills/results students will achieve

MODULE 1: [Title]
  Lesson 1.1: [Title] — [What student learns, 2 sentences]
  Lesson 1.2: [Title] — [What student learns, 2 sentences]
  Lesson 1.3: [Title] — [What student learns, 2 sentences]
  Module Assignment: [Specific action to complete]
  Assessment Question: [Quiz question to test comprehension]

MODULE 2: [Title]
  [Same structure — 3 lessons, assignment, assessment]

MODULE 3: [Title]
  [Same structure]

MODULE 4: [Title]
  [Same structure]

BONUS MODULE: [Title — advanced or supplementary content]
  [2 lessons]

COURSE COMPLETION: Certificate criteria, community/support access, next steps

3-4 modules minimum. Each lesson should be 15-20 minutes of content.`,
  },
  email_course: {
    title: 'Email Course (5-7 Days)',
    prompt: `Write a complete 7-day email course based on the source content.

COURSE NAME: [Title]
WELCOME EMAIL (Day 0):
  Subject: [Compelling subject line]
  Preview: [Under 90 chars]
  Body: Welcome, what to expect, quick win to build momentum (200 words)

DAY 1 EMAIL:
  Subject: [Subject line]
  Preview: [Under 90 chars]
  Body: Core concept #1, why it matters, one action step (250 words)

DAY 2 EMAIL:
  Subject: [Subject line]
  Preview: [Under 90 chars]
  Body: Core concept #2, case example, one action step (250 words)

DAY 3 EMAIL:
  Subject: [Subject line]
  Preview: [Under 90 chars]
  Body: Core concept #3, common mistake to avoid, one action step (250 words)

DAY 4 EMAIL:
  Subject: [Subject line]
  Preview: [Under 90 chars]
  Body: Advanced application, framework or checklist (250 words)

DAY 5 EMAIL:
  Subject: [Subject line]
  Preview: [Under 90 chars]
  Body: Real-world example or case study (250 words)

DAY 6 EMAIL:
  Subject: [Subject line]
  Preview: [Under 90 chars]
  Body: Putting it all together, system/process summary (250 words)

DAY 7 EMAIL (Graduation):
  Subject: [Subject line]
  Preview: [Under 90 chars]
  Body: Celebration, results recap, next step CTA (200 words)

Each email: conversational, one big idea, one action. No filler.`,
  },
  workbook: {
    title: 'Coaching Workbook',
    prompt: `Create a professional coaching workbook from the source content.

WORKBOOK TITLE: [Action-oriented title]
INTRODUCTION: How to use this workbook, commitment statement, space for goals (150 words)

SECTION 1: FOUNDATION
  Reflection Prompt 1: [Deep question about current situation]
  Reflection Prompt 2: [Question about desired outcome]
  Action Step: [Concrete first action]
  Framework Exercise: [Apply the core concept from source content]
  Space for notes: ___

SECTION 2: STRATEGY
  Reflection Prompt 1: [Question about obstacles]
  Reflection Prompt 2: [Question about resources/strengths]
  Action Step: [Concrete strategic action]
  Framework Exercise: [Apply a tool or model from source content]
  30-day planning grid: [Structure for implementation]

SECTION 3: EXECUTION
  Daily check-in prompts (7 days): [One question per day]
  Weekly review: [5 review questions]
  Accountability tracker: [Simple tracking format]

SECTION 4: INTEGRATION
  Reflection Prompt: [What has changed?]
  Results documentation: [Track wins and lessons]
  Next 90-day vision: [Planning prompts]

APPENDIX: Key frameworks summary, resource recommendations, glossary of terms used

Make it hands-on. Every page should have space to write.`,
  },
  checklist: {
    title: 'Checklist / Cheat Sheet',
    prompt: `Create a comprehensive, actionable checklist and cheat sheet from the source content.

CHEAT SHEET TITLE: [The Ultimate [Topic] Checklist]
SUBTITLE: [Specific benefit in one line]

QUICK REFERENCE CARD:
The 3 Core Principles:
1. [Principle] — [One-line explanation]
2. [Principle] — [One-line explanation]
3. [Principle] — [One-line explanation]

THE MASTER CHECKLIST:

PHASE 1: [Stage name]
□ [Action item with brief context]
□ [Action item with brief context]
□ [Action item with brief context]
□ [Action item with brief context]
□ [Action item with brief context]

PHASE 2: [Stage name]
□ [5 action items — same format]

PHASE 3: [Stage name]
□ [5 action items — same format]

PHASE 4: [Stage name]
□ [5 action items — same format]

COMMON MISTAKES TO AVOID:
✗ [Mistake] → [Fix]
✗ [Mistake] → [Fix]
✗ [Mistake] → [Fix]

QUICK WINS (Do these first):
⚡ [Highest-leverage action]
⚡ [Highest-leverage action]
⚡ [Highest-leverage action]

RESOURCES & TOOLS: [Relevant tools, templates, or references from source content]

Keep it scannable. Single page if printed. Every item should be immediately actionable.`,
  },
  product_description: {
    title: 'Product Sales Copy (Gumroad/Payhip)',
    prompt: `Write complete sales copy for this digital product, ready for Gumroad, Payhip, or Etsy.

PRODUCT NAME: [Compelling, benefit-focused product name]

TAGLINE: [One sentence — the transformation this product delivers]

PRICE SUGGESTION: $[XX] — [Justify the pricing briefly]

SHORT DESCRIPTION (160 chars for SEO/preview):
[Punchy, keyword-rich description]

FULL SALES PAGE COPY:

HEADLINE: [Bold benefit statement]

OPENING HOOK (100 words):
[Speak directly to the pain point. "You've tried X, Y, Z. Nothing worked. Here's why — and the fix."]

WHAT YOU GET:
✓ [Deliverable] — [Specific benefit]
✓ [Deliverable] — [Specific benefit]
✓ [Deliverable] — [Specific benefit]
✓ [Deliverable] — [Specific benefit]
✓ [Deliverable] — [Specific benefit]

WHO THIS IS FOR:
→ You're a [persona] who [struggle]
→ You want [outcome] without [sacrifice]
→ You're ready to [action]

WHO THIS IS NOT FOR:
→ [Qualifier 1]
→ [Qualifier 2]

THE RESULT: [Vivid description of transformation — what life/work looks like after]

FAQ:
Q: [Common objection]
A: [Confident answer]
Q: [Common objection]
A: [Confident answer]
Q: [Common objection]
A: [Confident answer]

CALL TO ACTION: [Get [Product Name] — $XX]
GUARANTEE: [30-day satisfaction guarantee language]

TAGS: [8-10 relevant search tags for the marketplace]`,
  },
}

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

  // Check usage limit
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, products_used_this_month')
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

  const selected = selectedTypes.filter((t: string) => PRODUCT_PROMPTS[t])

  const sections = selected
    .map((key: string) => {
      const { title, prompt } = PRODUCT_PROMPTS[key]
      return `## ${title.toUpperCase()} [${key}]\n${prompt}`
    })
    .join('\n\n---\n\n')

  const systemPrompt = `You are a digital product creation expert. Transform the user's source content into professional, sellable digital products. Each output should be comprehensive, well-structured, and ready for the creator to sell or use as a lead magnet. Maintain the creator's voice and expertise throughout. Format with clear headings, sections, and actionable content.

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

        // Increment usage counter
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
