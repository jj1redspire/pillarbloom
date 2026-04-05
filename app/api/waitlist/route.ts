import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const { email, source = 'landing' } = await request.json()

    if (!email || typeof email !== 'string') {
      return Response.json({ error: 'Email is required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Upsert — ignore conflicts so duplicate submissions don't error
    const { error } = await supabase
      .from('waitlist')
      .upsert(
        { email: email.toLowerCase().trim(), source },
        { onConflict: 'email,source', ignoreDuplicates: true }
      )

    if (error) {
      console.error('Waitlist insert error:', error)
      // Don't surface DB errors to users — still return success
    }

    return Response.json({ success: true })
  } catch {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
