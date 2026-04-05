import { createClient } from '@/lib/supabase/server'
import BillingButton from '@/components/dashboard/BillingButton'

const PLANS = [
  {
    key: 'starter',
    name: 'Starter',
    price: '$49',
    repurposes: '15/month',
    products: '1/month',
    highlight: false,
  },
  {
    key: 'pro',
    name: 'Pro',
    price: '$99',
    repurposes: 'Unlimited',
    products: '5/month',
    highlight: true,
  },
  {
    key: 'creator',
    name: 'Creator',
    price: '$149',
    repurposes: 'Unlimited',
    products: 'Unlimited',
    highlight: false,
  },
]

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, trial_ends_at, stripe_customer_id, repurposes_used_this_month, pieces_used_this_month, products_used_this_month')
    .eq('id', user!.id)
    .single()

  const plan = profile?.plan || 'trial'
  const isPaid = ['starter', 'pro', 'creator', 'agency'].includes(plan)
  const isTrial = plan === 'trial'
  const isExpired = plan === 'expired'
  const repurposesUsed = profile?.repurposes_used_this_month ?? profile?.pieces_used_this_month ?? 0
  const productsUsed = profile?.products_used_this_month ?? 0

  return (
    <div className="max-w-2xl space-y-5">
      <h1 className="text-2xl font-semibold text-[#1B2A4A] tracking-tight">Settings</h1>

      {/* Account card */}
      <div className="bg-white rounded-xl border border-[#e8eaed] p-6">
        <h2 className="font-semibold text-[#1B2A4A] mb-4 text-sm uppercase tracking-wide">Account</h2>
        <div className="space-y-3">
          <Row label="Email" value={user?.email ?? ''} />
          <Row label="Plan" value={plan.charAt(0).toUpperCase() + plan.slice(1)} />
          {isTrial && profile?.trial_ends_at && (
            <Row
              label="Trial ends"
              value={new Date(profile.trial_ends_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            />
          )}
        </div>
      </div>

      {/* Usage card */}
      <div className="bg-white rounded-xl border border-[#e8eaed] p-6">
        <h2 className="font-semibold text-[#1B2A4A] mb-4 text-sm uppercase tracking-wide">This Month&apos;s Usage</h2>
        <div className="space-y-3">
          <Row label="Content repurposes used" value={String(repurposesUsed)} />
          <Row label="Digital products generated" value={String(productsUsed)} />
        </div>
      </div>

      {/* Billing card */}
      <div className="bg-white rounded-xl border border-[#e8eaed] p-6">
        <h2 className="font-semibold text-[#1B2A4A] mb-1 text-sm uppercase tracking-wide">Billing</h2>

        {isPaid && profile?.stripe_customer_id ? (
          <div>
            <p className="text-sm text-[#6B7280] mb-4">Manage subscription, update payment, or cancel anytime.</p>
            <BillingButton />
          </div>
        ) : (
          <div>
            <p className="text-sm text-[#6B7280] mb-5">
              {isExpired
                ? 'Your trial has expired. Upgrade to continue generating content and products.'
                : isTrial
                ? "You're on a free trial. Upgrade to unlock your full monthly limits."
                : 'Choose a plan that fits your workflow.'}
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              {PLANS.map((p) => (
                <div
                  key={p.key}
                  className={`rounded-xl border p-5 ${p.highlight ? 'border-[#C6A04E] bg-[#C6A04E]/5 shadow-sm' : 'border-[#e8eaed]'}`}
                >
                  {p.highlight && (
                    <span className="inline-block bg-[#C6A04E] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2">
                      Most Popular
                    </span>
                  )}
                  <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">{p.name}</p>
                  <p className="text-2xl font-semibold text-[#1B2A4A] mt-1 tracking-tight">{p.price}<span className="text-sm font-normal text-[#9CA3AF]">/mo</span></p>
                  <div className="mt-3 space-y-1.5 text-xs text-[#6B7280] mb-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#C6A04E]">✓</span> {p.repurposes} repurposes
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#C6A04E]">✓</span> {p.products} products
                    </div>
                  </div>
                  <BillingButton plan={p.key} label="Upgrade" small />
                </div>
              ))}
            </div>

            <p className="text-xs text-[#9CA3AF]">
              All plans include a 14-day free trial. Cancel anytime.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-[#6B7280]">{label}</span>
      <span className="text-sm font-medium text-[#1B2A4A]">{value}</span>
    </div>
  )
}
