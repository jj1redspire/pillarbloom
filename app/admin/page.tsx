import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/Logo'

export const metadata: Metadata = {
  title: 'Admin — PillarBloom',
  robots: { index: false, follow: false },
}

const ADMIN_EMAIL = 'pnwmbd@gmail.com'

export default async function AdminPage() {
  // Auth check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) redirect('/login')

  const admin = createAdminClient()

  // Fetch all metrics in parallel
  const [
    { count: totalUsers },
    { data: recentWaitlist },
    { count: totalWaitlist },
    { count: totalProjects },
    { count: totalProducts },
    { data: recentSignups },
    { data: planBreakdown },
  ] = await Promise.all([
    admin.from('profiles').select('*', { count: 'exact', head: true }),
    admin.from('waitlist').select('email, source, created_at').order('created_at', { ascending: false }).limit(20),
    admin.from('waitlist').select('*', { count: 'exact', head: true }),
    admin.from('projects').select('*', { count: 'exact', head: true }),
    admin.from('digital_product_projects').select('*', { count: 'exact', head: true }),
    admin.from('profiles').select('email, plan, created_at').order('created_at', { ascending: false }).limit(10),
    admin.from('profiles').select('plan'),
  ])

  // Plan breakdown counts
  const planCounts: Record<string, number> = {}
  for (const row of (planBreakdown ?? [])) {
    const p = row.plan ?? 'unknown'
    planCounts[p] = (planCounts[p] ?? 0) + 1
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <header className="bg-white border-b border-[#e8eaed] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Logo variant="dark" width={130} />
            </Link>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C6A04E] bg-[#C6A04E]/10 border border-[#C6A04E]/25 px-3 py-1 rounded-full">
              Admin
            </span>
          </div>
          <Link href="/dashboard" className="text-sm text-[#6B7280] hover:text-[#1B2A4A] transition-colors">
            ← Dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="font-display text-2xl font-bold text-[#1B2A4A] mb-1 tracking-tight">Overview</h1>
        <p className="text-sm text-[#9CA3AF] mb-8">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: totalUsers ?? 0, icon: '👤' },
            { label: 'Waitlist', value: totalWaitlist ?? 0, icon: '📧' },
            { label: 'Content Projects', value: totalProjects ?? 0, icon: '📄' },
            { label: 'Product Projects', value: totalProducts ?? 0, icon: '🎁' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-[#e8eaed] p-5 shadow-sm">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-[#1B2A4A] tracking-tight">{stat.value.toLocaleString()}</div>
              <div className="text-xs text-[#9CA3AF] font-medium mt-1 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">

          {/* Plan breakdown */}
          <div className="bg-white rounded-2xl border border-[#e8eaed] p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#9CA3AF] mb-4">Users by Plan</h2>
            <div className="space-y-3">
              {Object.entries(planCounts).sort((a, b) => b[1] - a[1]).map(([plan, count]) => {
                const total = totalUsers ?? 1
                const pct = Math.round((count / total) * 100)
                return (
                  <div key={plan}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-[#1B2A4A] capitalize">{plan}</span>
                      <span className="text-[#6B7280]">{count} · {pct}%</span>
                    </div>
                    <div className="h-2 bg-[#fafafa] rounded-full overflow-hidden border border-[#e8eaed]">
                      <div
                        className="h-full bg-[#C6A04E] rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
              {Object.keys(planCounts).length === 0 && (
                <p className="text-sm text-[#9CA3AF]">No users yet</p>
              )}
            </div>
          </div>

          {/* Recent signups */}
          <div className="bg-white rounded-2xl border border-[#e8eaed] p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#9CA3AF] mb-4">Recent Signups</h2>
            <div className="space-y-3">
              {(recentSignups ?? []).map((u) => (
                <div key={u.email} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-[#C6A04E]/10 border border-[#C6A04E]/20 flex items-center justify-center text-xs font-bold text-[#C6A04E] flex-shrink-0">
                      {(u.email as string)?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <span className="text-[#374151] truncate">{u.email}</span>
                  </div>
                  <span className="text-[#9CA3AF] text-xs flex-shrink-0 ml-2 capitalize">{u.plan}</span>
                </div>
              ))}
              {(recentSignups ?? []).length === 0 && (
                <p className="text-sm text-[#9CA3AF]">No signups yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Waitlist */}
        <div className="bg-white rounded-2xl border border-[#e8eaed] p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#9CA3AF] mb-4">
            Waitlist — Recent Submissions ({totalWaitlist ?? 0} total)
          </h2>
          {(recentWaitlist ?? []).length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e8eaed]">
                    <th className="text-left text-xs font-bold uppercase tracking-wider text-[#9CA3AF] pb-3 pr-6">Email</th>
                    <th className="text-left text-xs font-bold uppercase tracking-wider text-[#9CA3AF] pb-3 pr-6">Source</th>
                    <th className="text-left text-xs font-bold uppercase tracking-wider text-[#9CA3AF] pb-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f5f5]">
                  {(recentWaitlist ?? []).map((row) => (
                    <tr key={`${row.email}-${row.source}`}>
                      <td className="py-3 pr-6 text-[#374151] font-medium">{row.email}</td>
                      <td className="py-3 pr-6">
                        <span className="text-xs bg-[#fafafa] border border-[#e8eaed] px-2 py-1 rounded-full text-[#6B7280]">
                          {row.source}
                        </span>
                      </td>
                      <td className="py-3 text-[#9CA3AF] text-xs">
                        {new Date(row.created_at as string).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-[#9CA3AF]">No waitlist submissions yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
