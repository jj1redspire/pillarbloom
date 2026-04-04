import Link from 'next/link'
import Logo from '@/components/Logo'

const OUTPUT_TYPES = [
  { icon: '💼', label: 'LinkedIn Post' },
  { icon: '📧', label: 'Email Campaign' },
  { icon: '🐦', label: 'Tweet Thread' },
  { icon: '🎁', label: 'Lead Magnet' },
  { icon: '🎬', label: 'Video Script' },
  { icon: '💬', label: 'Key Quote' },
  { icon: '📰', label: 'Newsletter' },
  { icon: '📋', label: 'Executive Summary' },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Paste your content',
    desc: 'Drop in a blog post, podcast transcript, webinar recording, case study — anything with substance.',
  },
  {
    step: '02',
    title: 'AI generates 30+ outputs',
    desc: 'Claude analyzes your content and creates platform-native outputs across 8 categories simultaneously.',
  },
  {
    step: '03',
    title: 'Edit, copy, publish',
    desc: 'Review each output in a clean editor. Tweak the tone. Copy to clipboard. Done.',
  },
]

const PLANS = [
  {
    name: 'Starter',
    price: '$29',
    period: '/month',
    desc: 'For solo creators and marketers.',
    features: ['20 projects/month', 'All 8 output types', '30+ outputs per project', 'Copy to clipboard', 'Email support'],
    cta: 'Start free trial',
    href: '/signup?plan=starter',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$79',
    period: '/month',
    desc: 'For power users and content teams.',
    features: ['Unlimited projects', 'All 8 output types', '30+ outputs per project', 'Brand voice settings', 'Priority support'],
    cta: 'Start free trial',
    href: '/signup?plan=pro',
    highlight: true,
  },
  {
    name: 'Agency',
    price: '$199',
    period: '/month',
    desc: 'For agencies managing multiple brands.',
    features: ['Unlimited projects', 'Team seats (up to 5)', 'All output types', 'Custom brand voices', 'Dedicated support'],
    cta: 'Start free trial',
    href: '/signup?plan=agency',
    highlight: false,
  },
]

const FAQS = [
  {
    q: 'What kind of content can I paste in?',
    a: 'Anything text-based works great — blog posts, podcast transcripts, webinar notes, case studies, white papers, long-form emails, or interview transcripts.',
  },
  {
    q: 'How many outputs do I actually get per project?',
    a: 'Each project generates 8 categories of content. Within those categories you get 30+ distinct pieces — multiple LinkedIn post angles, a full 5-email campaign, a 10-tweet thread, and more.',
  },
  {
    q: 'Is the 14-day trial really free?',
    a: 'Yes. No credit card required. You get full Pro access for 14 days, then choose a plan or let it expire.',
  },
  {
    q: 'Can I edit the generated outputs?',
    a: 'Yes — every output opens in an inline editor. Adjust the tone, tighten the copy, or rewrite a section. Changes are saved automatically.',
  },
  {
    q: 'Does it work for technical or B2B content?',
    a: 'Absolutely. The AI is instructed to preserve your terminology and positioning — it repurposes structure and format, not your actual message.',
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
            <Link
              href="/signup"
              className="bg-[#C6A04E] hover:bg-[#D4B574] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              Start free trial
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">

        {/* Hero — white background */}
        <section className="bg-white pt-20 pb-24 px-6 border-b border-[#e8eaed]">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[#C6A04E]/10 border border-[#C6A04E]/25 rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#C6A04E] inline-block"></span>
              <span className="text-[#C6A04E] text-xs font-semibold uppercase tracking-widest">14-day free trial — no card required</span>
            </div>

            <div className="flex justify-center mb-8">
              <Logo variant="dark" width={280} />
            </div>

            <h1 className="text-4xl md:text-6xl font-semibold text-[#1B2A4A] mb-6 leading-tight tracking-tight">
              One piece of content.<br />
              <span className="text-[#C6A04E]">30+ outputs.</span> Zero effort.
            </h1>
            <p className="text-lg md:text-xl text-[#6B7280] mb-10 max-w-2xl mx-auto leading-relaxed">
              PillarBloom turns your best content — blog posts, podcasts, case studies — into a full content calendar across every channel. In minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="bg-[#C6A04E] hover:bg-[#D4B574] text-white font-semibold px-8 py-4 rounded-lg text-base transition-colors"
              >
                Start free — 14 days →
              </Link>
              <Link
                href="#how-it-works"
                className="border border-[#e8eaed] hover:border-[#1B2A4A]/30 text-[#1B2A4A] font-semibold px-8 py-4 rounded-lg text-base transition-colors"
              >
                See how it works
              </Link>
            </div>

            {/* Output type pills */}
            <div className="flex flex-wrap gap-2 justify-center mt-12">
              {OUTPUT_TYPES.map((t) => (
                <span key={t.label} className="flex items-center gap-1.5 bg-[#fafafa] text-[#374151] text-sm px-3 py-1.5 rounded-full border border-[#e8eaed]">
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Social proof bar */}
        <section className="bg-[#fafafa] py-5 px-6 border-b border-[#e8eaed]">
          <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-8 text-sm text-[#6B7280]">
            <span className="flex items-center gap-1.5"><span className="text-[#C6A04E]">✓</span> No credit card required</span>
            <span className="flex items-center gap-1.5"><span className="text-[#C6A04E]">✓</span> Powered by Claude AI</span>
            <span className="flex items-center gap-1.5"><span className="text-[#C6A04E]">✓</span> 8 output categories</span>
            <span className="flex items-center gap-1.5"><span className="text-[#C6A04E]">✓</span> Results in under 2 minutes</span>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-24 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#C6A04E] mb-3">How It Works</p>
              <h2 className="text-3xl md:text-4xl font-semibold text-[#1B2A4A] tracking-tight">
                From one input to a full content library
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {HOW_IT_WORKS.map((step) => (
                <div key={step.step} className="bg-[#fafafa] rounded-xl p-8 border border-[#e8eaed]">
                  <div className="text-3xl font-semibold text-[#C6A04E]/30 mb-4 tabular-nums">
                    {step.step}
                  </div>
                  <h3 className="font-semibold text-[#1B2A4A] text-lg mb-2">{step.title}</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Output showcase */}
        <section className="py-24 px-6 bg-[#fafafa] border-y border-[#e8eaed]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#C6A04E] mb-3">What You Get</p>
              <h2 className="text-3xl md:text-4xl font-semibold text-[#1B2A4A] tracking-tight">
                Every format. Every channel.
              </h2>
              <p className="text-[#6B7280] mt-4 max-w-xl mx-auto">
                Paste one piece of content and get outputs tailored to each platform&apos;s format and best practices.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {OUTPUT_TYPES.map((t) => (
                <div key={t.label} className="bg-white rounded-xl p-6 border border-[#e8eaed] text-center hover:shadow-sm transition-shadow hover:border-[#C6A04E]/30">
                  <div className="text-3xl mb-3">{t.icon}</div>
                  <div className="font-medium text-[#1B2A4A] text-sm">{t.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#C6A04E] mb-3">Pricing</p>
              <h2 className="text-3xl md:text-4xl font-semibold text-[#1B2A4A] tracking-tight">
                Simple, honest pricing
              </h2>
              <p className="text-[#6B7280] mt-4">14-day free trial on every plan. No credit card required.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-xl p-8 border relative ${
                    plan.highlight
                      ? 'bg-[#1B2A4A] text-white border-[#1B2A4A] shadow-lg'
                      : 'bg-white border-[#e8eaed]'
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-[#C6A04E] text-white text-xs font-semibold px-3 py-1 rounded-full">Most Popular</span>
                    </div>
                  )}
                  <p className={`text-xs font-semibold uppercase tracking-widest mb-2 ${plan.highlight ? 'text-[#C6A04E]' : 'text-[#6B7280]'}`}>{plan.name}</p>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className={`text-4xl font-semibold tracking-tight ${plan.highlight ? 'text-white' : 'text-[#1B2A4A]'}`}>{plan.price}</span>
                    <span className={`text-sm ${plan.highlight ? 'text-blue-300' : 'text-[#6B7280]'}`}>{plan.period}</span>
                  </div>
                  <p className={`text-sm mb-6 ${plan.highlight ? 'text-blue-200' : 'text-[#6B7280]'}`}>{plan.desc}</p>
                  <ul className="space-y-2.5 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className={`flex items-center gap-2 text-sm ${plan.highlight ? 'text-blue-100' : 'text-[#374151]'}`}>
                        <svg className="w-4 h-4 flex-shrink-0 text-[#C6A04E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.href}
                    className={`block text-center font-semibold px-6 py-3 rounded-lg text-sm transition-colors ${
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
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 px-6 bg-[#fafafa] border-t border-[#e8eaed]">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-[#1B2A4A] tracking-tight">
                Frequently asked questions
              </h2>
            </div>
            <div className="space-y-3">
              {FAQS.map((faq) => (
                <div key={faq.q} className="bg-white rounded-xl p-6 border border-[#e8eaed]">
                  <h3 className="font-semibold text-[#1B2A4A] mb-2">{faq.q}</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA — one navy band */}
        <section className="bg-[#1B2A4A] py-20 px-6 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-center mb-6">
              <Logo variant="light" width={200} />
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 tracking-tight">
              Stop leaving content on the table.
            </h2>
            <p className="text-blue-200 mb-8 text-lg">
              Every blog post you&apos;ve written is worth 30 more pieces of content. Start extracting that value today.
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

      {/* Footer — light */}
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
