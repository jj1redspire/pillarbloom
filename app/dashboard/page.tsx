import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: projects } = await supabase
    .from('projects')
    .select('id, title, status, created_at')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0F1B2D]" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Projects
          </h1>
          <p className="text-sm text-[#717185] mt-0.5">Each project turns one piece of content into 30+ outputs.</p>
        </div>
        <Link
          href="/dashboard/new"
          className="bg-[#0F1B2D] hover:bg-[#1B3A5C] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          + New Project
        </Link>
      </div>

      {!projects || projects.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-3">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/dashboard/project/${p.id}`}
              className="bg-white rounded-xl border border-[#E8E6E1] p-5 hover:shadow-md transition-shadow flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-[#0F1B2D] text-sm">{p.title || 'Untitled project'}</p>
                <p className="text-xs text-[#717185] mt-0.5">
                  {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={p.status} />
                <svg className="w-4 h-4 text-[#717185]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    complete: 'bg-green-100 text-green-700',
    generating: 'bg-blue-100 text-blue-700',
    error: 'bg-red-100 text-red-700',
  }
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}

function EmptyState() {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E6E1] p-16 text-center">
      <div className="text-4xl mb-4">✨</div>
      <h2 className="text-lg font-semibold text-[#0F1B2D] mb-2">No projects yet</h2>
      <p className="text-[#717185] text-sm mb-6 max-w-xs mx-auto">
        Paste in any piece of content — a blog post, podcast transcript, case study — and get 30+ outputs instantly.
      </p>
      <Link
        href="/dashboard/new"
        className="inline-block bg-[#C6A04E] hover:bg-[#D4B574] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors"
      >
        Create your first project →
      </Link>
    </div>
  )
}
