import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/Logo'
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
    ? `Trial — ${daysLeft(profile?.trial_ends_at)}d left`
    : profile?.plan || 'trial'

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      {/* Top nav */}
      <header className="bg-white border-b border-[#e8eaed] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/dashboard">
            <Logo variant="dark" width={140} />
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden md:block text-xs font-medium text-[#6B7280] bg-[#fafafa] border border-[#e8eaed] px-3 py-1 rounded-full capitalize">
              {planLabel}
            </span>
            <DashboardNav email={user.email || ''} />
          </div>
        </div>
      </header>

      {/* Sidebar + content */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full px-6 py-8 gap-8">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-48 shrink-0 gap-0.5">
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
      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-[#6B7280] hover:bg-white hover:text-[#1B2A4A] hover:shadow-sm transition-all"
    >
      <span className="text-base">{icon}</span>
      {label}
    </Link>
  )
}

function daysLeft(date: string | null): number {
  if (!date) return 0
  const diff = new Date(date).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}
