import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DashboardNav from '@/components/dashboard/DashboardNav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, trial_ends_at, pieces_used_this_month')
    .eq('id', user.id)
    .single()

  const planLabel = profile?.plan === 'trial'
    ? `Trial (${daysLeft(profile?.trial_ends_at)} days left)`
    : profile?.plan || 'trial'

  return (
    <div className="min-h-screen bg-[#F3F1ED] flex flex-col">
      {/* Top nav */}
      <header className="bg-white border-b border-[#E8E6E1] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="font-semibold text-[#0F1B2D] text-base">
            Pillar<span className="text-[#C6A04E]">Bloom</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden md:block text-xs font-medium text-[#717185] bg-[#F3F1ED] px-3 py-1 rounded-full capitalize">
              {planLabel}
            </span>
            <DashboardNav email={user.email || ''} />
          </div>
        </div>
      </header>

      {/* Sidebar + content */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full px-6 py-8 gap-8">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-52 shrink-0 gap-1">
          <SidebarLink href="/dashboard" label="Projects" icon="📁" />
          <SidebarLink href="/dashboard/new" label="New Project" icon="✨" />
          <SidebarLink href="/dashboard/settings" label="Settings" icon="⚙️" />
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}

function SidebarLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#4A4A5A] hover:bg-white hover:text-[#0F1B2D] transition-colors"
    >
      <span>{icon}</span>
      {label}
    </Link>
  )
}

function daysLeft(date: string | null): number {
  if (!date) return 0
  const diff = new Date(date).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}
