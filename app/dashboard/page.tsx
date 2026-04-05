import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: projects }, { data: productProjects }] = await Promise.all([
    supabase
      .from('projects')
      .select('id, title, status, created_at')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('digital_product_projects')
      .select('id, title, status, created_at, selected_types')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const hasAny = (projects?.length ?? 0) > 0 || (productProjects?.length ?? 0) > 0

  return (
    <div className="space-y-8">
      {/* Header + CTAs */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1B2A4A] tracking-tight">Dashboard</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">Repurpose content and build digital products from a single paste.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/products/new"
            className="border border-[#1B2A4A] text-[#1B2A4A] hover:bg-[#1B2A4A] hover:text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-all"
          >
            + New Product
          </Link>
          <Link
            href="/dashboard/new"
            className="bg-[#C6A04E] hover:bg-[#D4B574] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            + New Project
          </Link>
        </div>
      </div>

      {!hasAny ? (
        <WelcomeState />
      ) : (
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Content projects — wider column */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#1B2A4A]">Recent Content Projects</h2>
              <Link href="/dashboard" className="text-xs text-[#C6A04E] hover:underline font-medium">View all</Link>
            </div>
            {!projects || projects.length === 0 ? (
              <EmptyCard
                icon="✨"
                title="No content projects yet"
                desc="Paste a blog post, transcript, or article to get 30+ social outputs."
                href="/dashboard/new"
                cta="Create first project"
              />
            ) : (
              <div className="space-y-2">
                {projects.map((p) => (
                  <Link
                    key={p.id}
                    href={`/dashboard/project/${p.id}`}
                    className="flex items-center justify-between bg-white border border-[#e8eaed] rounded-xl px-5 py-4 hover:shadow-sm hover:border-[#1B2A4A]/15 transition-all group"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#1B2A4A] truncate">{p.title || 'Untitled project'}</p>
                      <p className="text-xs text-[#9CA3AF] mt-0.5">
                        {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2.5 ml-4 flex-shrink-0">
                      <StatusBadge status={p.status} />
                      <svg className="w-3.5 h-3.5 text-[#D1D5DB] group-hover:text-[#1B2A4A] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Product projects — narrower column */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#1B2A4A]">Recent Products</h2>
              <Link href="/dashboard/products" className="text-xs text-[#C6A04E] hover:underline font-medium">View all</Link>
            </div>
            {!productProjects || productProjects.length === 0 ? (
              <EmptyCard
                icon="🎁"
                title="No products yet"
                desc="Turn your content into ebooks, courses, and workbooks."
                href="/dashboard/products/new"
                cta="Create first product"
              />
            ) : (
              <div className="space-y-2">
                {productProjects.map((p) => {
                  const types: string[] = p.selected_types ?? []
                  return (
                    <Link
                      key={p.id}
                      href={`/dashboard/products/${p.id}`}
                      className="flex items-center justify-between bg-white border border-[#e8eaed] rounded-xl px-5 py-4 hover:shadow-sm hover:border-[#1B2A4A]/15 transition-all group"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#1B2A4A] truncate">{p.title || 'Untitled product'}</p>
                        <p className="text-xs text-[#9CA3AF] mt-0.5">
                          {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          {types.length > 0 && ` · ${types.length} type${types.length !== 1 ? 's' : ''}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2.5 ml-4 flex-shrink-0">
                        <StatusBadge status={p.status} />
                        <svg className="w-3.5 h-3.5 text-[#D1D5DB] group-hover:text-[#1B2A4A] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    complete: 'bg-green-50 text-green-600 border-green-200',
    generating: 'bg-blue-50 text-blue-600 border-blue-200',
    error: 'bg-red-50 text-red-600 border-red-200',
  }
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${styles[status] || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
      {status}
    </span>
  )
}

function EmptyCard({ icon, title, desc, href, cta }: { icon: string; title: string; desc: string; href: string; cta: string }) {
  return (
    <div className="bg-white border border-dashed border-[#e8eaed] rounded-xl p-6 text-center">
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-sm font-medium text-[#1B2A4A] mb-1">{title}</p>
      <p className="text-xs text-[#9CA3AF] mb-4 leading-relaxed">{desc}</p>
      <Link href={href} className="inline-block text-xs font-semibold text-white bg-[#C6A04E] hover:bg-[#D4B574] px-4 py-2 rounded-lg transition-colors">
        {cta}
      </Link>
    </div>
  )
}

function WelcomeState() {
  return (
    <div className="grid sm:grid-cols-2 gap-5 mt-2">
      {/* Content engine card */}
      <div className="bg-white border border-[#e8eaed] rounded-2xl p-8">
        <div className="w-10 h-10 bg-[#1B2A4A]/5 rounded-xl flex items-center justify-center mb-4 text-xl">✨</div>
        <h2 className="font-semibold text-[#1B2A4A] text-lg mb-2 tracking-tight">Content Engine</h2>
        <p className="text-[#6B7280] text-sm leading-relaxed mb-5">
          Paste one piece of content and get 30+ outputs — LinkedIn posts, tweet threads, newsletters, email campaigns, and more.
        </p>
        <div className="flex flex-wrap gap-1.5 mb-6">
          {['LinkedIn Post', 'Tweet Thread', 'Newsletter', 'Email Campaign', 'Key Quotes', '+ more'].map((t) => (
            <span key={t} className="text-xs bg-[#fafafa] border border-[#e8eaed] text-[#6B7280] px-2.5 py-1 rounded-full">{t}</span>
          ))}
        </div>
        <Link
          href="/dashboard/new"
          className="block text-center bg-[#1B2A4A] hover:bg-[#2D4270] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors"
        >
          Start repurposing →
        </Link>
      </div>

      {/* Product engine card */}
      <div className="bg-white border border-[#e8eaed] rounded-2xl p-8">
        <div className="w-10 h-10 bg-[#C6A04E]/10 rounded-xl flex items-center justify-center mb-4 text-xl">🎁</div>
        <h2 className="font-semibold text-[#1B2A4A] text-lg mb-2 tracking-tight">Product Engine</h2>
        <p className="text-[#6B7280] text-sm leading-relaxed mb-5">
          Transform your expertise into sellable digital products — ebooks, mini-courses, email courses, workbooks, and sales copy.
        </p>
        <div className="flex flex-wrap gap-1.5 mb-6">
          {['Ebook', 'Mini-Course', 'Email Course', 'Workbook', 'Checklist', 'Sales Copy'].map((t) => (
            <span key={t} className="text-xs bg-[#fafafa] border border-[#e8eaed] text-[#6B7280] px-2.5 py-1 rounded-full">{t}</span>
          ))}
        </div>
        <Link
          href="/dashboard/products/new"
          className="block text-center bg-[#C6A04E] hover:bg-[#D4B574] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors"
        >
          Create first product →
        </Link>
      </div>
    </div>
  )
}
