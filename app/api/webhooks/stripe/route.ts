import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

// Map live Stripe price IDs → internal plan names at runtime using env vars
function getPlanFromPriceId(priceId: string): string {
  if (priceId && priceId === process.env.STRIPE_PRICE_STARTER) return 'starter'
  if (priceId && priceId === process.env.STRIPE_PRICE_PRO)     return 'pro'
  if (priceId && priceId === process.env.STRIPE_PRICE_CREATOR) return 'creator'
  if (priceId && priceId === process.env.STRIPE_PRICE_AGENCY)  return 'creator' // legacy
  // Fallback: derive from placeholder names still in use during dev
  if (priceId?.includes('starter')) return 'starter'
  if (priceId?.includes('pro'))     return 'pro'
  if (priceId?.includes('creator') || priceId?.includes('agency')) return 'creator'
  return 'starter'
}

export async function POST(request: Request) {
  // Lazy init — both clients created inside handler, never at module scope
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
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

  // ── checkout.session.completed ─────────────────────────────────────────────
  // Fires when a customer completes checkout. Use as the canonical trigger for
  // setting the plan + Stripe IDs so we're not dependent on subscription events
  // arriving in the right order.
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const subscriptionId = session.subscription as string | null

    if (subscriptionId) {
      try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const userId = subscription.metadata?.supabase_user_id
        const priceId = subscription.items.data[0]?.price.id
        const plan = getPlanFromPriceId(priceId)
        const status = subscription.status

        if (userId) {
          await supabaseAdmin
            .from('profiles')
            .update({
              plan: status === 'active' || status === 'trialing' ? plan : 'expired',
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: subscriptionId,
            })
            .eq('id', userId)
        }
      } catch (err) {
        console.error('checkout.session.completed handler error:', err)
        // Don't return 400 — Stripe will retry if we do
      }
    }
  }

  // ── customer.subscription.created / updated ────────────────────────────────
  if (
    event.type === 'customer.subscription.created' ||
    event.type === 'customer.subscription.updated'
  ) {
    const subscription = event.data.object as Stripe.Subscription
    const userId = subscription.metadata?.supabase_user_id

    if (userId) {
      const priceId = subscription.items.data[0]?.price.id
      const plan = getPlanFromPriceId(priceId)
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

  // ── customer.subscription.deleted ─────────────────────────────────────────
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    const userId = subscription.metadata?.supabase_user_id

    if (userId) {
      await supabaseAdmin
        .from('profiles')
        .update({ plan: 'free', stripe_subscription_id: null })
        .eq('id', userId)
    }
  }

  // ── invoice.payment_failed ────────────────────────────────────────────────
  // Downgrade to free if the renewal payment fails after retries
  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as Stripe.Invoice & { subscription?: string | null }
    const subscriptionId = invoice.subscription

    if (subscriptionId) {
      try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const userId = subscription.metadata?.supabase_user_id
        if (userId && (subscription.status === 'past_due' || subscription.status === 'unpaid')) {
          await supabaseAdmin
            .from('profiles')
            .update({ plan: 'expired' })
            .eq('id', userId)
        }
      } catch { /* ignore retrieval errors */ }
    }
  }

  return new Response('ok', { status: 200 })
}
