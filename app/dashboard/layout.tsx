import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/Logo'
import DashboardNav from '@/components/dashboard/DashboardNav'
import UsageBar from '@/components/dashboard/UsageBar'

export const metadata: Metadata = {
  title: 'Dashboard — PillarBloom',
  robots: { index: false, follow: false },
}

const PLAN_LIMITS: Record<string, { repurposes: number; products: number; unlimitedRepurposes: boolean; unlimitedProducts: boolean }> = {
  free:     { repurposes: 3,   products: 0,  unlimitedRepurposes: false, unlimitedProducts: false },
  trial:    { repurposes: 99,  products: 99, unlimitedRepurposes: true,  unlimitedProducts: true  },
  starter:  { repurposes: 15,  products: 1,  unlimitedRepurposes: false, unlimitedProducts: false },
  pro:      { repurposes: 999, products: 5,  unlimitedRepurposes: true,  unlimitedProducts: false },
  creator:  { repurposes: 999, products: 999,unlimitedRepurposes: true,  unlimitedProducts: true  },
  agency:   { repurposes: 999, products: 999,unlimitedRepurposes: true,  unlimitedProducts: true  },
  expired:  { repurposes: 0,   products: 0,  unlimitedRepurposes: false, unlimitedProducts: false },
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, trial_ends_at, repurposes_used_this_month, pieces_used_this_month, products_used_this_month')
    .eq('id', user.id)
    .single()

  const plan = profile?.plan ?? 'trial'
  const limits = PLAN_LIMITS[plan] ?? PLAN_LIMITS.trial
  const repurposesUsed = profile?.repurposes_used_this_month ?? profile?.pieces_used_this_month ?? 0
  const productsUsed = profile?.products_used_this_month ?? 0

  const planDisplay = plan === 'trial'
    ? `Trial — ${daysLeft(profile?.trial_ends_at)}d left`
    : plan.charAt(0).toUpperCase() + plan.slice(1)

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      {/* Top nav */}
      <header className="bg-white border-b border-[#e8eaed] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center">
            <Logo variant="dark" width={140} />
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden md:block text-xs font-medium text-[#6B7280] bg-[#fafafa] border border-[#e8eaed] px-3 py-1 rounded-full">
              {planDisplay}
            </span>
            <DashboardNav email={user.email || ''} />
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl mx-auto w-full px-6 py-8 gap-8">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-52 shrink-0">

          {/* Content section */}
          <div className="mb-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF] px-3 mb-1">Content</p>
            <SidebarLink href="/dashboard" label="All Projects" icon="📁" />
            <SidebarLink href="/dashboard/new" label="New Project" icon="✨" highlight />
          </div>

          {/* Products section */}
          <div className="mt-4 mb-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF] px-3 mb-1">Products</p>
            <SidebarLink href="/dashboard/products" label="My Products" icon="🎁" />
            <SidebarLink href="/dashboard/products/new" label="New Product" icon="⚡" />
          </div>

          {/* Divider */}
          <div className="border-t border-[#e8eaed] my-4" />

          {/* Usage */}
          <div className="mb-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF] px-3 mb-1">Usage</p>
            <UsageBar
              label="Repurposes"
              used={repurposesUsed}
              limit={limits.repurposes}
              isUnlimited={limits.unlimitedRepurposes}
            />
            <UsageBar
              label="Products"
              used={productsUsed}
              limit={limits.products}
              isUnlimited={limits.unlimitedProducts}
            />
            {(plan === 'free' || plan === 'trial' || plan === 'expired') && (
              <Link
                href="/dashboard/settings"
                className="mx-3 mt-2 block text-center text-xs font-semibold text-[#C6A04E] hover:text-[#D4B574] bg-[#C6A04E]/8 hover:bg-[#C6A04E]/12 border border-[#C6A04E]/25 px-3 py-2 rounded-lg transition-colors"
              >
                Upgrade plan →
              </Link>
            )}
          </div>

          {/* Bottom */}
          <div className="mt-auto pt-4 border-t border-[#e8eaed]">
            <SidebarLink href="/dashboard/templates" label="Templates" icon="📁" />
            <SidebarLink href="/dashboard/settings" label="Settings" icon="⚙️" />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}

function SidebarLink({ href, label, icon, highlight }: { href: string; label: string; icon: string; highlight?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
        highlight
          ? 'text-[#C6A04E] hover:bg-[#C6A04E]/8'
          : 'text-[#6B7280] hover:bg-white hover:text-[#1B2A4A] hover:shadow-sm'
      }`}
    >
      <span className="text-sm">{icon}</span>
      {label}
    </Link>
  )
}

function daysLeft(date: string | null | undefined): number {
  if (!date) return 0
  return Math.max(0, Math.ceil((new Date(date).getTime() - Date.now()) / 86400000))
}
