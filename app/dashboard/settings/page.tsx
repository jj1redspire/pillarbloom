import { createClient } from '@/lib/supabase/server'
import BillingButton from '@/components/dashboard/BillingButton'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, trial_ends_at, stripe_customer_id, pieces_used_this_month')
    .eq('id', user!.id)
    .single()

  const plan = profile?.plan || 'trial'
  const isTrial = plan === 'trial'
  const isExpired = plan === 'expired'

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-[#0F1B2D] mb-6" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
        Settings
      </h1>

      {/* Account */}
      <div className="bg-white rounded-xl border border-[#E8E6E1] p-6 mb-4">
        <h2 className="font-semibold text-[#0F1B2D] mb-4">Account</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-[#717185]">Email</span>
            <span className="text-[#0F1B2D] font-medium">{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#717185]">Plan</span>
            <span className="capitalize font-medium text-[#0F1B2D]">{plan}</span>
          </div>
          {isTrial && profile?.trial_ends_at && (
            <div className="flex justify-between">
              <span className="text-[#717185]">Trial ends</span>
              <span className="text-[#0F1B2D] font-medium">
                {new Date(profile.trial_ends_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-[#717185]">Projects this month</span>
            <span className="text-[#0F1B2D] font-medium">{profile?.pieces_used_this_month ?? 0}</span>
          </div>
        </div>
      </div>

      {/* Billing */}
      <div className="bg-white rounded-xl border border-[#E8E6E1] p-6">
        <h2 className="font-semibold text-[#0F1B2D] mb-4">Billing</h2>

        {(isTrial || isExpired) ? (
          <div>
            <p className="text-sm text-[#717185] mb-4">
              {isExpired
                ? 'Your trial has expired. Upgrade to continue using PillarBloom.'
                : 'You\'re on the free trial. Upgrade anytime to keep your projects and unlock unlimited access.'}
            </p>
            <div className="grid grid-cols-3 gap-3">
              <PlanCard name="Starter" price="$29" plan="starter" highlight={false} />
              <PlanCard name="Pro" price="$79" plan="pro" highlight={true} />
              <PlanCard name="Agency" price="$199" plan="agency" highlight={false} />
            </div>
          </div>
        ) : profile?.stripe_customer_id ? (
          <div>
            <p className="text-sm text-[#717185] mb-4">
              Manage your subscription, update payment method, or cancel.
            </p>
            <BillingButton />
          </div>
        ) : (
          <p className="text-sm text-[#717185]">No billing information on file.</p>
        )}
      </div>
    </div>
  )
}

function PlanCard({ name, price, plan, highlight }: { name: string; price: string; plan: string; highlight: boolean }) {
  return (
    <div className={`rounded-lg p-4 border text-center ${highlight ? 'border-[#C6A04E] bg-[#C6A04E]/5' : 'border-[#E8E6E1]'}`}>
      <p className="text-xs font-semibold text-[#717185] mb-1">{name}</p>
      <p className="text-xl font-bold text-[#0F1B2D] mb-3" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>{price}<span className="text-xs font-normal text-[#717185]">/mo</span></p>
      <BillingButton plan={plan} label="Upgrade" small />
    </div>
  )
}
