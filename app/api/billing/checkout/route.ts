import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  // Lazy init — Stripe client created inside handler, not at module scope
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  const PRICE_IDS: Record<string, string | undefined> = {
    starter: process.env.STRIPE_PRICE_STARTER,
    pro:     process.env.STRIPE_PRICE_PRO,
    creator: process.env.STRIPE_PRICE_CREATOR,
    // legacy alias kept for backward compat
    agency:  process.env.STRIPE_PRICE_AGENCY ?? process.env.STRIPE_PRICE_CREATOR,
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { plan } = await request.json()
  const priceId = PRICE_IDS[plan]

  if (!priceId || priceId.includes('placeholder')) {
    return Response.json({ error: 'This plan is not yet configured. Price IDs must be set in Stripe.' }, { status: 400 })
  }

  // Get or create Stripe customer
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  let customerId = profile?.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    })
    customerId = customer.id

    await supabase
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', user.id)
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/dashboard?upgraded=true&plan=${plan}`,
    cancel_url: `${baseUrl}/dashboard/settings`,
    subscription_data: {
      trial_period_days: 14,
      metadata: { supabase_user_id: user.id, plan },
    },
  })

  return Response.json({ url: session.url })
}
