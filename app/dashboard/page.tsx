import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ upgraded?: string; plan?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const params = await searchParams
  const justUpgraded = params.upgraded === 'true'
  const upgradedPlan = params.plan ?? ''

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
      {/* Upgraded success banner */}
      {justUpgraded && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-4">
          <div className="w-8 h-8 rounded-full bg-green-100 border border-green-200 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-green-800">
              {upgradedPlan
                ? `Welcome to ${upgradedPlan.charAt(0).toUpperCase() + upgradedPlan.slice(1)}!`
                : 'Plan upgraded successfully!'}
            </p>
            <p className="text-xs text-green-700 mt-0.5">
              Your new limits are active. Start generating content and products.
            </p>
          </div>
          <Link href="/dashboard/settings" className="text-xs font-semibold text-green-700 hover:text-green-900 underline whitespace-nowrap flex-shrink-0">
            View plan →
          </Link>
        </div>
      )}

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
        <OnboardingState />
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

function OnboardingState() {
  const steps = [
    { n: '1', label: 'Paste your content', desc: 'A blog post, transcript, framework, or any expertise-rich writing.' },
    { n: '2', label: 'Choose your outputs', desc: 'Pick from 8 social formats or 6 digital product types — or both.' },
    { n: '3', label: 'Watch it generate', desc: 'Claude reads your content and builds everything in 30–60 seconds.' },
    { n: '4', label: 'Copy and publish', desc: 'Edit inline, copy as markdown or plain text, download — done.' },
  ]

  return (
    <div className="space-y-6">
      {/* Step journey */}
      <div className="bg-white border border-[#e8eaed] rounded-2xl p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF] mb-6">How it works</p>
        <div className="grid sm:grid-cols-4 gap-4 mb-8">
          {steps.map((step, i) => (
            <div key={step.n} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden sm:block absolute top-4 left-[calc(50%+16px)] right-0 h-px bg-[#e8eaed]" />
              )}
              <div className="flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-full bg-[#1B2A4A] text-white text-sm font-semibold flex items-center justify-center mb-3 relative z-10">
                  {step.n}
                </div>
                <p className="text-sm font-semibold text-[#1B2A4A] mb-1">{step.label}</p>
                <p className="text-xs text-[#6B7280] leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Voice profile nudge */}
        <div className="bg-[#C6A04E]/6 border border-[#C6A04E]/20 rounded-xl p-4 mb-6 flex items-start gap-3">
          <span className="text-[#C6A04E] text-lg leading-none mt-0.5">✦</span>
          <div>
            <p className="text-sm font-semibold text-[#1B2A4A] mb-0.5">Set up your Brand Voice first</p>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Paste 3–5 samples of your existing writing in{' '}
              <Link href="/dashboard/settings" className="text-[#C6A04E] font-medium hover:underline">Settings → Brand Voice</Link>
              {' '}and every output will sound like you — not like AI.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard/new"
            className="flex-1 block text-center bg-[#1B2A4A] hover:bg-[#2D4270] text-white font-semibold px-6 py-3.5 rounded-xl text-sm transition-colors"
          >
            ✨ Start repurposing content →
          </Link>
          <Link
            href="/dashboard/products/new"
            className="flex-1 block text-center bg-[#C6A04E] hover:bg-[#D4B574] text-white font-semibold px-6 py-3.5 rounded-xl text-sm transition-colors"
          >
            🎁 Create a digital product →
          </Link>
        </div>
      </div>

      {/* What you can create — product type preview */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white border border-[#e8eaed] rounded-2xl p-6">
          <div className="w-9 h-9 bg-[#1B2A4A]/5 rounded-xl flex items-center justify-center mb-3 text-lg">✨</div>
          <h2 className="font-semibold text-[#1B2A4A] mb-1.5 tracking-tight">Content Engine</h2>
          <p className="text-[#6B7280] text-xs leading-relaxed mb-4">
            Paste once, get 8 ready-to-publish formats across every platform you use.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {['LinkedIn Post', 'Tweet Thread', 'Newsletter', 'Email Campaign', 'Video Script', 'Lead Magnet', 'Key Quotes', 'Exec Summary'].map((t) => (
              <span key={t} className="text-xs bg-[#fafafa] border border-[#e8eaed] text-[#6B7280] px-2 py-0.5 rounded-full">{t}</span>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#e8eaed] rounded-2xl p-6">
          <div className="w-9 h-9 bg-[#C6A04E]/10 rounded-xl flex items-center justify-center mb-3 text-lg">🎁</div>
          <h2 className="font-semibold text-[#1B2A4A] mb-1.5 tracking-tight">Product Engine</h2>
          <p className="text-[#6B7280] text-xs leading-relaxed mb-4">
            Turn your expertise into sellable products with complete structure and copy.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {['Ebook', 'Mini-Course', 'Email Course', 'Workbook', 'Checklist', 'Sales Copy'].map((t) => (
              <span key={t} className="text-xs bg-[#fafafa] border border-[#e8eaed] text-[#6B7280] px-2 py-0.5 rounded-full">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
