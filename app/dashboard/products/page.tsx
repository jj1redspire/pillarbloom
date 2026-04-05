import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function ProductsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: projects } = await supabase
    .from('digital_product_projects')
    .select('id, title, status, selected_types, created_at')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(50)

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, products_used_this_month')
    .eq('id', user!.id)
    .single()

  const limits: Record<string, number> = {
    free: 0, trial: 99, starter: 1, pro: 5, creator: 999, agency: 999, expired: 0
  }
  const used = profile?.products_used_this_month ?? 0
  const limit = limits[profile?.plan ?? 'trial'] ?? 0
  const atLimit = profile?.plan !== 'trial' && used >= limit

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#1B2A4A] tracking-tight">
            Digital Products
          </h1>
          <p className="text-sm text-[#6B7280] mt-0.5">
            Transform your content into ebooks, courses, workbooks, and sales copy.
          </p>
        </div>
        {atLimit ? (
          <Link
            href="/dashboard/settings"
            className="bg-[#C6A04E] hover:bg-[#D4B574] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            Upgrade to create products
          </Link>
        ) : (
          <Link
            href="/dashboard/products/new"
            className="bg-[#1B2A4A] hover:bg-[#2D4270] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            + New Product
          </Link>
        )}
      </div>

      {atLimit && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <span className="text-amber-500 text-lg leading-none mt-0.5">⚡</span>
          <div>
            <p className="text-sm font-medium text-amber-800">
              You&apos;ve used {used} of {limit} products this month
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              <Link href="/dashboard/settings" className="underline font-medium">Upgrade your plan</Link> to generate more digital products.
            </p>
          </div>
        </div>
      )}

      {!projects || projects.length === 0 ? (
        <ProductEmptyState atLimit={atLimit} />
      ) : (
        <div className="grid gap-3">
          {projects.map((p) => {
            const types: string[] = p.selected_types ?? []
            return (
              <Link
                key={p.id}
                href={`/dashboard/products/${p.id}`}
                className="bg-white rounded-xl border border-[#e8eaed] p-5 hover:shadow-sm hover:border-[#1B2A4A]/20 transition-all flex items-center justify-between group"
              >
                <div>
                  <p className="font-medium text-[#1B2A4A] text-sm">{p.title || 'Untitled product'}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs text-[#6B7280]">
                      {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    {types.slice(0, 3).map((t) => (
                      <span key={t} className="text-xs bg-[#fafafa] border border-[#e8eaed] text-[#6B7280] px-2 py-0.5 rounded-full capitalize">
                        {t.replace('_', ' ')}
                      </span>
                    ))}
                    {types.length > 3 && (
                      <span className="text-xs text-[#6B7280]">+{types.length - 3} more</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={p.status} />
                  <svg className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#1B2A4A] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    complete: 'bg-green-50 text-green-700 border border-green-200',
    generating: 'bg-blue-50 text-blue-700 border border-blue-200',
    error: 'bg-red-50 text-red-700 border border-red-200',
  }
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${styles[status] || 'bg-gray-50 text-gray-600 border border-gray-200'}`}>
      {status}
    </span>
  )
}

function ProductEmptyState({ atLimit }: { atLimit: boolean }) {
  const productTypes = [
    { icon: '📖', label: 'Ebook' },
    { icon: '🎓', label: 'Mini-Course' },
    { icon: '📧', label: 'Email Course' },
    { icon: '📝', label: 'Workbook' },
    { icon: '✅', label: 'Checklist' },
    { icon: '💰', label: 'Sales Copy' },
  ]
  return (
    <div className="bg-white rounded-2xl border border-[#e8eaed] p-12 text-center">
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-6">
        {productTypes.map((t) => (
          <div key={t.label} className="bg-[#fafafa] border border-[#e8eaed] rounded-lg p-3 text-center">
            <div className="text-xl mb-1">{t.icon}</div>
            <div className="text-xs text-[#6B7280] font-medium">{t.label}</div>
          </div>
        ))}
      </div>
      <h2 className="text-lg font-semibold text-[#1B2A4A] mb-2 tracking-tight">No products yet</h2>
      <p className="text-[#6B7280] text-sm mb-6 max-w-sm mx-auto leading-relaxed">
        Paste any piece of content and get a complete ebook, course outline, email sequence, workbook, or Gumroad sales page — ready to publish.
      </p>
      {atLimit ? (
        <Link
          href="/dashboard/settings"
          className="inline-block bg-[#C6A04E] hover:bg-[#D4B574] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors"
        >
          Upgrade to unlock products →
        </Link>
      ) : (
        <Link
          href="/dashboard/products/new"
          className="inline-block bg-[#C6A04E] hover:bg-[#D4B574] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors"
        >
          Create your first product →
        </Link>
      )}
    </div>
  )
}
