import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const PLAN_MAP: Record<string, string> = {
  price_starter_placeholder: 'starter',
  price_pro_placeholder: 'pro',
  price_agency_placeholder: 'agency',
}

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  // Service role client for webhook (bypasses RLS)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const body = await request.arrayBuffer()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      Buffer.from(body),
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return new Response('Webhook signature verification failed', { status: 400 })
  }

  if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.created') {
    const subscription = event.data.object as Stripe.Subscription
    const userId = subscription.metadata.supabase_user_id

    if (userId) {
      const priceId = subscription.items.data[0]?.price.id
      const plan = PLAN_MAP[priceId] || 'starter'
      const status = subscription.status

      await supabaseAdmin
        .from('profiles')
        .update({
          plan: status === 'active' || status === 'trialing' ? plan : 'expired',
          stripe_subscription_id: subscription.id,
        })
        .eq('id', userId)
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    const userId = subscription.metadata.supabase_user_id

    if (userId) {
      await supabaseAdmin
        .from('profiles')
        .update({ plan: 'expired' })
        .eq('id', userId)
    }
  }

  return new Response('ok', { status: 200 })
}
