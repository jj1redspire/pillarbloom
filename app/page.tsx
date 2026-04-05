import Link from 'next/link'
import Logo from '@/components/Logo'

const CONTENT_OUTPUTS = ['LinkedIn Post', 'Tweet Thread', 'Newsletter', 'Email Campaign', 'Key Quotes', 'Video Script', 'Executive Summary', 'Lead Magnet']
const PRODUCT_OUTPUTS = ['Ebook / PDF', 'Mini-Course', '7-Day Email Course', 'Coaching Workbook', 'Checklist', 'Gumroad Sales Copy']

const PLANS = [
  {
    key: 'free',
    name: 'Free',
    price: '$0',
    period: '',
    desc: 'Try it before you buy it.',
    features: [
      '3 content repurposes/month',
      'All 8 output types',
      'Copy to clipboard',
      'No product generation',
    ],
    note: 'Upgrade to unlock Products',
    cta: 'Get started free',
    href: '/signup',
    highlight: false,
    dimProducts: true,
  },
  {
    key: 'starter',
    name: 'Starter',
    price: '$49',
    period: '/month',
    desc: 'For creators publishing consistently.',
    features: [
      '15 content repurposes/month',
      '1 digital product/month',
      'All 8 content output types',
      'All 6 product types',
      'Download as text',
    ],
    cta: 'Start free trial',
    href: '/signup?plan=starter',
    highlight: false,
    dimProducts: false,
  },
  {
    key: 'pro',
    name: 'Pro',
    price: '$99',
    period: '/month',
    desc: 'For serious content businesses.',
    features: [
      'Unlimited content repurposes',
      '5 digital products/month',
      'All output types',
      'Brand voice learning',
      'Priority support',
    ],
    cta: 'Start free trial',
    href: '/signup?plan=pro',
    highlight: true,
    dimProducts: false,
  },
  {
    key: 'creator',
    name: 'Creator',
    price: '$149',
    period: '/month',
    desc: 'For agencies and full-time creators.',
    features: [
      'Unlimited content repurposes',
      'Unlimited digital products',
      'Marketplace-ready export',
      'White-label output',
      'A/B product descriptions',
    ],
    cta: 'Start free trial',
    href: '/signup?plan=creator',
    highlight: false,
    dimProducts: false,
  },
]

const FAQS = [
  {
    q: 'What kind of content can I paste in?',
    a: 'Anything text-based — blog posts, podcast transcripts, webinar notes, case studies, white papers, long-form emails, or interview transcripts. The more substance, the better the output.',
  },
  {
    q: 'What\'s the difference between content repurposing and product generation?',
    a: 'Content repurposing turns your source material into social and marketing content (LinkedIn posts, newsletters, tweet threads). Product generation turns that same material into sellable or gated assets — ebooks, courses, workbooks, and Gumroad-ready sales copy.',
  },
  {
    q: 'How long does generation take?',
    a: 'Content repurposing (30+ outputs) takes about 30–60 seconds. Digital product generation takes 60–90 seconds depending on how many product types you select.',
  },
  {
    q: 'Can I edit the outputs?',
    a: 'Yes — every output has an inline editor. Click anywhere to edit. Changes save automatically when you click away. You can also download any output as a .txt file.',
  },
  {
    q: 'Does the Pro plan really include unlimited content repurposing?',
    a: 'Yes. Unlimited means no cap on content projects per month. Digital products are capped at 5/month on Pro — upgrade to Creator for unlimited products.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes. Every paid plan includes a 14-day free trial. No credit card required to start.',
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[#e8eaed]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo variant="dark" width={160} />
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-[#6B7280] hover:text-[#1B2A4A] transition-colors font-medium">
              Log in
            </Link>
            <Link href="/signup" className="bg-[#C6A04E] hover:bg-[#D4B574] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
              Start free →
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">

        {/* Hero */}
        <section className="bg-white pt-20 pb-20 px-6 border-b border-[#e8eaed]">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[#C6A04E]/10 border border-[#C6A04E]/25 rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#C6A04E] inline-block"></span>
              <span className="text-[#C6A04E] text-xs font-semibold uppercase tracking-widest">14-day free trial · No card required</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-semibold text-[#1B2A4A] mb-5 leading-tight tracking-tight">
              Turn your expertise into<br />
              <span className="text-[#C6A04E]">content AND income</span>
            </h1>

            <p className="text-xl text-[#6B7280] mb-10 max-w-2xl mx-auto leading-relaxed">
              Paste once. Get 30 days of social media content <em>and</em> sellable digital products — ebooks, courses, workbooks, and more. All from the same source material.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
              <Link href="/signup" className="bg-[#C6A04E] hover:bg-[#D4B574] text-white font-semibold px-8 py-4 rounded-lg text-base transition-colors shadow-sm">
                Start free — 14 days →
              </Link>
              <Link href="#how-it-works" className="border border-[#e8eaed] hover:border-[#1B2A4A]/25 text-[#1B2A4A] font-semibold px-8 py-4 rounded-lg text-base transition-colors">
                See how it works
              </Link>
            </div>

            {/* Dual stream preview */}
            <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto text-left">
              <div className="bg-[#fafafa] border border-[#e8eaed] rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">✨</span>
                  <span className="text-sm font-semibold text-[#1B2A4A]">Content Engine</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {CONTENT_OUTPUTS.map((o) => (
                    <span key={o} className="text-xs bg-white border border-[#e8eaed] text-[#6B7280] px-2.5 py-1 rounded-full">{o}</span>
                  ))}
                </div>
              </div>
              <div className="bg-[#fafafa] border border-[#e8eaed] rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🎁</span>
                  <span className="text-sm font-semibold text-[#1B2A4A]">Product Engine</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PRODUCT_OUTPUTS.map((o) => (
                    <span key={o} className="text-xs bg-white border border-[#e8eaed] text-[#6B7280] px-2.5 py-1 rounded-full">{o}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social proof bar */}
        <section className="bg-[#fafafa] py-4 px-6 border-b border-[#e8eaed]">
          <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-8 text-sm text-[#6B7280]">
            {['No credit card required', 'Powered by Claude AI', '30+ content outputs', '6 product types', 'Results in under 2 minutes'].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <span className="text-[#C6A04E] font-bold">✓</span> {item}
              </span>
            ))}
          </div>
        </section>

        {/* Replacement math */}
        <section className="py-16 px-6 bg-white border-b border-[#e8eaed]">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#1B2A4A] rounded-2xl p-8 md:p-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#C6A04E] mb-3">Replace your entire toolkit</p>
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6 tracking-tight">
                Stop paying for 5 tools to do what one can.
              </h2>
              <div className="grid sm:grid-cols-2 gap-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-3">What you&apos;re replacing</p>
                  <div className="space-y-2.5">
                    {[
                      ['Designrr (ebook creator)', '$29/mo'],
                      ['ChatGPT (content drafts)', '$20/mo'],
                      ['Canva Pro (design)', '$10/mo'],
                      ['Email tool (drip courses)', '$29/mo'],
                      ['Hours of manual work', 'priceless'],
                    ].map(([tool, price]) => (
                      <div key={tool} className="flex items-center justify-between">
                        <span className="text-sm text-blue-200">{tool}</span>
                        <span className="text-sm text-blue-300 font-medium line-through">{price}</span>
                      </div>
                    ))}
                    <div className="border-t border-white/10 pt-2.5 flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">Total</span>
                      <span className="text-sm font-semibold text-red-300 line-through">$88+/mo + hours</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-3">With PillarBloom</p>
                    <div className="space-y-2.5">
                      {[
                        ['Content repurposing', '30+ outputs/paste'],
                        ['Digital product generation', '6 product types'],
                        ['Inline editing & download', 'included'],
                        ['Claude AI (best-in-class)', 'included'],
                      ].map(([feat, val]) => (
                        <div key={feat} className="flex items-center justify-between">
                          <span className="text-sm text-blue-200">{feat}</span>
                          <span className="text-xs text-[#C6A04E] font-medium">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6 bg-white/10 rounded-xl p-4 text-center">
                    <p className="text-2xl font-semibold text-white tracking-tight">From $49<span className="text-sm font-normal text-blue-300">/mo</span></p>
                    <p className="text-xs text-blue-300 mt-1">Save $39+/month vs. separate tools</p>
                    <Link href="/signup" className="mt-3 block bg-[#C6A04E] hover:bg-[#D4B574] text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors">
                      Start free trial →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-24 px-6 bg-[#fafafa] border-b border-[#e8eaed]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#C6A04E] mb-3">How It Works</p>
              <h2 className="text-3xl md:text-4xl font-semibold text-[#1B2A4A] tracking-tight">Three steps. One paste.</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { n: '01', title: 'Paste your content', body: 'Drop in a blog post, podcast transcript, webinar recording, case study — anything with substance and expertise.' },
                { n: '02', title: 'Choose what to generate', body: 'Pick from content outputs (social, email, newsletter) or product outputs (ebook, course, workbook). Or both.' },
                { n: '03', title: 'Edit, copy, publish', body: 'Every output opens in a clean inline editor. Tweak the tone, copy to clipboard, or download as a file.' },
              ].map((step) => (
                <div key={step.n} className="bg-white rounded-xl p-8 border border-[#e8eaed] hover:shadow-sm transition-shadow">
                  <div className="text-3xl font-semibold text-[#C6A04E]/25 mb-4 tabular-nums">{step.n}</div>
                  <h3 className="font-semibold text-[#1B2A4A] text-lg mb-2 tracking-tight">{step.title}</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#C6A04E] mb-3">Pricing</p>
              <h2 className="text-3xl md:text-4xl font-semibold text-[#1B2A4A] tracking-tight">Simple, honest pricing</h2>
              <p className="text-[#6B7280] mt-3">14-day free trial on every paid plan. Cancel anytime.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {PLANS.map((plan) => (
                <div
                  key={plan.key}
                  className={`rounded-2xl p-7 border relative flex flex-col ${
                    plan.highlight
                      ? 'bg-[#1B2A4A] border-[#1B2A4A] shadow-xl text-white'
                      : 'bg-white border-[#e8eaed]'
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-[#C6A04E] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">Most Popular</span>
                    </div>
                  )}
                  <div className="mb-5">
                    <p className={`text-xs font-semibold uppercase tracking-widest mb-2 ${plan.highlight ? 'text-[#C6A04E]' : 'text-[#9CA3AF]'}`}>{plan.name}</p>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className={`text-3xl font-semibold tracking-tight ${plan.highlight ? 'text-white' : 'text-[#1B2A4A]'}`}>{plan.price}</span>
                      {plan.period && <span className={`text-sm ${plan.highlight ? 'text-blue-300' : 'text-[#9CA3AF]'}`}>{plan.period}</span>}
                    </div>
                    <p className={`text-xs ${plan.highlight ? 'text-blue-200' : 'text-[#6B7280]'}`}>{plan.desc}</p>
                  </div>

                  <ul className="space-y-2 mb-6 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className={`flex items-start gap-2 text-xs leading-relaxed ${plan.highlight ? 'text-blue-100' : 'text-[#374151]'}`}>
                        <svg className="w-3.5 h-3.5 flex-shrink-0 text-[#C6A04E] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>

                  {plan.dimProducts && (
                    <p className={`text-xs mb-4 ${plan.highlight ? 'text-blue-300' : 'text-[#C6A04E]'} font-medium`}>
                      ⚡ {plan.note}
                    </p>
                  )}

                  <Link
                    href={plan.href}
                    className={`block text-center font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors ${
                      plan.highlight
                        ? 'bg-[#C6A04E] hover:bg-[#D4B574] text-white'
                        : 'border border-[#1B2A4A] text-[#1B2A4A] hover:bg-[#fafafa]'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>

            {/* Comparison callout */}
            <div className="mt-8 bg-[#fafafa] border border-[#e8eaed] rounded-xl p-5 text-center max-w-2xl mx-auto">
              <p className="text-sm text-[#6B7280]">
                <span className="font-semibold text-[#1B2A4A]">All plans include both engines</span> — content repurposing AND digital product generation.
                The difference is volume limits. Free plan shows content repurposing only.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 px-6 bg-[#fafafa] border-t border-[#e8eaed]">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-semibold text-[#1B2A4A] tracking-tight">Questions</h2>
            </div>
            <div className="space-y-3">
              {FAQS.map((faq) => (
                <div key={faq.q} className="bg-white rounded-xl p-6 border border-[#e8eaed]">
                  <h3 className="font-semibold text-[#1B2A4A] mb-2 text-sm">{faq.q}</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA — one navy band */}
        <section className="bg-[#1B2A4A] py-20 px-6 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-center mb-7">
              <Logo variant="light" width={200} />
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 tracking-tight">
              One paste. Thirty outputs.<br />Six products. Zero wasted expertise.
            </h2>
            <p className="text-blue-200 mb-8 text-lg leading-relaxed">
              Every piece of content you&apos;ve ever written is sitting there, untapped. Start turning it into social content and sellable products today.
            </p>
            <Link
              href="/signup"
              className="inline-block bg-[#C6A04E] hover:bg-[#D4B574] text-white font-semibold px-10 py-4 rounded-lg text-base transition-colors"
            >
              Start free — 14 days, no card →
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#e8eaed] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <Logo variant="dark" width={140} />
          <div className="flex gap-6 text-[#6B7280]">
            <Link href="/login" className="hover:text-[#1B2A4A] transition-colors">Log in</Link>
            <Link href="/signup" className="hover:text-[#1B2A4A] transition-colors">Sign up</Link>
            <a href="mailto:hello@pillarbloom.com" className="hover:text-[#1B2A4A] transition-colors">Contact</a>
          </div>
          <span className="text-[#9CA3AF]">© 2026 PillarBloom. All rights reserved.</span>
        </div>
      </footer>

    </div>
  )
}
