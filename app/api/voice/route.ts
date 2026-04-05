import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { samples } = await request.json()
  if (!samples || samples.trim().length < 100) {
    return new Response('Please provide more writing samples (at least 100 characters).', { status: 400 })
  }

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1200,
    messages: [{
      role: 'user',
      content: `Analyze these writing samples from a content creator and extract a detailed voice profile. Return ONLY valid JSON — no markdown, no explanation.

WRITING SAMPLES:
${samples}

Return exactly this JSON structure (fill in all fields based on the samples):
{
  "tone": "string — overall tone (e.g., 'direct and authoritative with warmth', 'casual and conversational', 'analytical but accessible')",
  "sentence_style": "string — sentence patterns (e.g., 'short punchy sentences, heavy use of em-dashes, often ends paragraphs with a single-sentence punch')",
  "vocabulary": "string — word choice patterns (e.g., 'plain language, avoids jargon, uses specific numbers and stats, prefers Anglo-Saxon words over Latinate')",
  "personality": "string — key personality traits that come through in their writing",
  "structural_patterns": ["pattern1", "pattern2", "pattern3"],
  "avoid": ["thing that would break their voice 1", "thing that would break their voice 2", "thing that would break their voice 3"],
  "signature_phrases": ["phrase or structure that sounds like them", "another", "another"],
  "energy_level": "string — low/medium/high and how it manifests"
}`
    }]
  })

  const raw = response.content[0].type === 'text' ? response.content[0].text.trim() : ''

  const jsonMatch = raw.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    return new Response('Failed to extract voice profile from samples.', { status: 500 })
  }

  let voiceProfile: Record<string, unknown>
  try {
    voiceProfile = JSON.parse(jsonMatch[0])
  } catch {
    return new Response('Failed to parse voice profile.', { status: 500 })
  }

  const { error } = await supabase
    .from('profiles')
    .update({ voice_profile: voiceProfile })
    .eq('id', user.id)

  if (error) {
    return new Response('Failed to save voice profile.', { status: 500 })
  }

  return Response.json({ success: true, profile: voiceProfile })
}
