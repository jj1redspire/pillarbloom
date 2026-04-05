import Link from 'next/link'
import Logo from '@/components/Logo'
import HeroMockup from '@/components/landing/HeroMockup'
import ROICalculator from '@/components/landing/ROICalculator'
import PricingSection from '@/components/landing/PricingSection'

// ─────────────────────────────────────────────────────────────────────────────
// SECTION HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C6A04E] mb-4">
      {children}
    </p>
  )
}

function SectionHeading({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <h2 className={`font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight ${light ? 'text-white' : 'text-[#1B2A4A]'}`}>
      {children}
    </h2>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#e8eaed]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo variant="dark" width={140} />
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#6B7280]">
            <a href="#how-it-works" className="hover:text-[#1B2A4A] transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-[#1B2A4A] transition-colors">Pricing</a>
            <Link href="/login" className="hover:text-[#1B2A4A] transition-colors">Sign in</Link>
          </div>
          <Link
            href="/signup"
            className="bg-[#C6A04E] hover:bg-[#D4B574] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all animate-glow-pulse"
          >
            Start Free →
          </Link>
        </div>
      </nav>

      {/* SECTION 1 — HERO */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-40 pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#C6A04E]/8 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left — Copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#fafafa] border border-[#e8eaed] rounded-full px-4 py-2 mb-8 animate-fade-up">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
                <span className="text-xs font-medium text-[#6B7280]">Join early creators — first 100 get 50% off for life</span>
              </div>

              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-[#1B2A4A] tracking-tight leading-[1.05] mb-6 animate-fade-up animate-fade-up-delay-1">
                Turn Your Expertise Into{' '}
                <em className="not-italic text-[#C6A04E]">Content</em>{' '}
                <span className="block">
                  AND{' '}
                  <em className="not-italic text-[#C6A04E]">Income</em>
                </span>
              </h1>

              <p className="text-xl text-[#6B7280] leading-relaxed mb-4 animate-fade-up animate-fade-up-delay-2 max-w-lg">
                One paste. 30 days of social content. Sellable digital products. All in your voice.
              </p>

              <p className="text-sm text-[#9CA3AF] mb-9 animate-fade-up animate-fade-up-delay-3">
                Join early adopters who&apos;ve stopped doing this manually.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 animate-fade-up animate-fade-up-delay-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 bg-[#C6A04E] hover:bg-[#D4B574] text-white font-semibold px-8 py-4 rounded-xl text-base transition-all shadow-lg shadow-[#C6A04E]/25 hover:shadow-[#C6A04E]/40 hover:-translate-y-0.5"
                >
                  Start Free — No card needed
                </Link>
                <a
                  href="#demo"
                  className="inline-flex items-center justify-center gap-2 border-2 border-[#1B2A4A] text-[#1B2A4A] hover:bg-[#1B2A4A] hover:text-white font-semibold px-8 py-4 rounded-xl text-base transition-all"
                >
                  Watch It Work ↓
                </a>
              </div>

              <div className="flex flex-wrap gap-2 mt-7 animate-fade-up animate-fade-up-delay-5">
                {['8 content formats', '6 digital products', 'Brand voice AI', 'One subscription'].map((pill) => (
                  <span key={pill} className="flex items-center gap-1.5 text-xs font-medium text-[#6B7280] bg-[#fafafa] border border-[#e8eaed] px-3 py-1.5 rounded-full">
                    <span className="text-[#C6A04E]">✓</span> {pill}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — Animated mockup */}
            <div className="flex justify-center lg:justify-end animate-fade-up animate-fade-up-delay-2" id="demo">
              <HeroMockup />
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2 — TRUST BAR */}
      <section className="bg-[#fafafa] border-y border-[#e8eaed] py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 text-center">
            <span className="text-sm font-bold text-[#1B2A4A] uppercase tracking-widest whitespace-nowrap">Replaces:</span>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                { name: 'Repurpose.io', price: '$29/mo' },
                { name: 'Designrr', price: '$27/mo' },
                { name: 'ChatGPT', price: '$20/mo' },
                { name: 'Email tools', price: '$12/mo' },
              ].map((tool, i) => (
                <div key={tool.name} className="flex items-center gap-2">
                  <span className="bg-white border border-[#e8eaed] text-[#9CA3AF] text-xs font-medium px-3 py-1.5 rounded-full line-through">
                    {tool.name} · {tool.price}
                  </span>
                  {i < 3 && <span className="text-[#C6A04E] font-bold text-sm">+</span>}
                </div>
              ))}
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-[#6B7280]">=</span>
                <span className="bg-[#C6A04E] text-white text-xs font-bold px-4 py-1.5 rounded-full">
                  PillarBloom from $49/mo
                </span>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-[#9CA3AF] mt-3">
            One platform. One paste. Everything you need to publish and sell.
          </p>
        </div>
      </section>

      {/* SECTION 3 — TWO-STREAM VALUE PROP */}
      <section id="how-it-works" className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-16">
            <SectionLabel>What PillarBloom Does</SectionLabel>
            <SectionHeading>One paste. Two revenue streams.</SectionHeading>
            <p className="text-lg text-[#6B7280] mt-4 max-w-2xl mx-auto leading-relaxed">
              Every piece of content you create is sitting on two untapped opportunities.
              PillarBloom unlocks both automatically.
            </p>
          </div>

          {/* Single input connector — mobile */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="bg-[#1B2A4A] text-white text-sm font-bold px-6 py-3 rounded-xl shadow-lg">
              📄 Your Content → Two streams
            </div>
          </div>

          {/* Single input connector — desktop */}
          <div className="hidden lg:flex justify-center mb-8">
            <div className="flex flex-col items-center">
              <div className="bg-[#1B2A4A] text-white text-sm font-bold px-6 py-3 rounded-xl shadow-lg mb-3">
                📄 Your Content
              </div>
              <div className="flex items-center gap-0">
                <div className="w-32 h-px bg-gradient-to-l from-[#C6A04E] to-transparent" />
                <div className="w-3 h-3 rounded-full bg-[#C6A04E] shadow-md shadow-[#C6A04E]/40" />
                <div className="w-32 h-px bg-gradient-to-r from-[#C6A04E] to-transparent" />
              </div>
              <div className="flex gap-48 -mt-1">
                <div className="w-px h-6 bg-[#C6A04E]/40" />
                <div className="w-px h-6 bg-[#C6A04E]/40" />
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">

            {/* Content Engine */}
            <div className="bg-white rounded-3xl border border-[#e8eaed] p-8 shadow-sm gold-hover-border card-hover relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#1B2A4A] rounded-t-3xl" />
              <div className="w-12 h-12 bg-[#1B2A4A]/5 rounded-2xl flex items-center justify-center mb-5 text-2xl">✨</div>
              <h3 className="font-display text-2xl font-bold text-[#1B2A4A] mb-1">Content Engine</h3>
              <p className="text-[#C6A04E] text-xs font-bold uppercase tracking-wider mb-2">Never run out of things to post</p>
              <p className="text-[#6B7280] text-sm mb-6 leading-relaxed">Paste weekly. Stay visible everywhere. 8 platform-native formats from one input.</p>
              <div className="grid grid-cols-2 gap-2.5 mb-6">
                {[
                  { icon: '💼', label: 'LinkedIn Post', desc: '150–250 words, hook-first' },
                  { icon: '🐦', label: 'Tweet Thread', desc: '10 punchy tweets' },
                  { icon: '📰', label: 'Newsletter', desc: 'Full edition with takeaways' },
                  { icon: '📧', label: 'Email Campaign', desc: '3-email nurture sequence' },
                  { icon: '🎬', label: 'Video Script', desc: '3–5 minute script' },
                  { icon: '💬', label: 'Key Quotes', desc: '8 shareable quotes' },
                  { icon: '🎁', label: 'Lead Magnet', desc: 'Checklist or mini-guide' },
                  { icon: '📋', label: 'Exec Summary', desc: 'Decision-maker brief' },
                ].map((item) => (
                  <div key={item.label} className="bg-[#fafafa] border border-[#e8eaed] rounded-xl p-3">
                    <div className="text-base mb-1">{item.icon}</div>
                    <p className="text-xs font-semibold text-[#1B2A4A]">{item.label}</p>
                    <p className="text-[10px] text-[#9CA3AF] leading-tight mt-0.5">{item.desc}</p>
                  </div>
                ))}
              </div>
              <Link href="/signup" className="block text-center text-sm font-semibold text-white bg-[#1B2A4A] hover:bg-[#2D4270] px-6 py-3 rounded-xl transition-colors">
                Start repurposing content →
              </Link>
            </div>

            {/* Product Engine */}
            <div className="bg-white rounded-3xl border border-[#e8eaed] p-8 shadow-sm gold-hover-border card-hover relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#C6A04E] rounded-t-3xl" />
              <div className="w-12 h-12 bg-[#C6A04E]/10 rounded-2xl flex items-center justify-center mb-5 text-2xl">🎁</div>
              <h3 className="font-display text-2xl font-bold text-[#1B2A4A] mb-1">Product Engine</h3>
              <p className="text-[#C6A04E] text-xs font-bold uppercase tracking-wider mb-2">Turn ideas into products you can sell</p>
              <p className="text-[#6B7280] text-sm mb-6 leading-relaxed">Generate once. Sell forever. Complete structure, formatted and Gumroad-ready.</p>
              <div className="grid grid-cols-2 gap-2.5 mb-6">
                {[
                  { icon: '📖', label: 'Ebook / PDF', desc: 'Chapters, intro, conclusion' },
                  { icon: '🎓', label: 'Mini-Course', desc: 'Modules, lessons, assessments' },
                  { icon: '📧', label: 'Email Course', desc: '7-day sequence, day by day' },
                  { icon: '📝', label: 'Workbook', desc: 'Prompts, exercises, trackers' },
                  { icon: '✅', label: 'Checklist', desc: 'Phased, scannable action steps' },
                  { icon: '💰', label: 'Sales Copy', desc: 'Gumroad/Payhip-ready page' },
                ].map((item) => (
                  <div key={item.label} className="bg-[#fafafa] border border-[#e8eaed] rounded-xl p-3">
                    <div className="text-base mb-1">{item.icon}</div>
                    <p className="text-xs font-semibold text-[#1B2A4A]">{item.label}</p>
                    <p className="text-[10px] text-[#9CA3AF] leading-tight mt-0.5">{item.desc}</p>
                  </div>
                ))}
              </div>
              <Link href="/signup" className="block text-center text-sm font-semibold text-white bg-[#C6A04E] hover:bg-[#D4B574] px-6 py-3 rounded-xl transition-colors">
                Create your first product →
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4 — HOW IT WORKS */}
      <section className="py-24 md:py-32 bg-[#fafafa]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <SectionLabel>Simple by Design</SectionLabel>
            <SectionHeading>Three steps. That&apos;s it.</SectionHeading>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-px bg-gradient-to-r from-[#C6A04E]/30 via-[#C6A04E] to-[#C6A04E]/30" />
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  n: '01', icon: '📄', title: 'Paste your content',
                  desc: 'Blog post, podcast transcript, framework, or any expertise-rich piece you\'ve written.',
                  detail: 'No minimum length. The richer, the better.',
                },
                {
                  n: '02', icon: '🎯', title: 'Choose your outputs',
                  desc: 'Select content formats, digital products, or both. Run Content Engine and Product Engine simultaneously.',
                  detail: 'Content + Products in one run.',
                },
                {
                  n: '03', icon: '✨', title: 'Get everything, in your voice',
                  desc: 'AI generates complete, structured, publish-ready output that sounds like you — not a generic robot.',
                  detail: 'Edit, copy, download. Done.',
                },
              ].map((step) => (
                <div key={step.n} className="flex flex-col items-center text-center relative">
                  <div className="w-16 h-16 bg-white border-2 border-[#C6A04E] rounded-2xl flex items-center justify-center text-2xl mb-5 shadow-sm relative z-10">
                    {step.icon}
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#C6A04E] rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                      {step.n.slice(1)}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#1B2A4A] mb-3">{step.title}</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed mb-3">{step.desc}</p>
                  <span className="text-xs font-semibold text-[#C6A04E] bg-[#C6A04E]/8 border border-[#C6A04E]/20 px-3 py-1 rounded-full">
                    {step.detail}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-14">
            <Link href="/signup" className="inline-flex items-center gap-2 bg-[#1B2A4A] hover:bg-[#2D4270] text-white font-semibold px-8 py-4 rounded-xl text-base transition-all shadow-lg hover:-translate-y-0.5">
              Try it free — takes 2 minutes →
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 5 — BEFORE / AFTER */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <SectionLabel>The Transformation</SectionLabel>
            <SectionHeading>What changes when you start.</SectionHeading>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#fafafa] rounded-3xl border border-[#e8eaed] p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-xl bg-[#e8eaed] flex items-center justify-center text-sm font-bold text-[#9CA3AF]">✗</div>
                <h3 className="font-display text-xl font-bold text-[#9CA3AF]">Without PillarBloom</h3>
              </div>
              <ul className="space-y-4">
                {[
                  '6+ months to build a course from scratch',
                  'Hours reformatting each post for every platform',
                  '$88+/month across 4 separate tools',
                  'Generic AI output that doesn\'t sound like you',
                  'Content sits unused after publishing once',
                  'New tool to learn every time you want to monetize',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[#9CA3AF]">
                    <span className="text-red-400 mt-0.5 flex-shrink-0 font-bold">✗</span>
                    <span className="line-through decoration-[#D1D5DB]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-3xl border-2 border-[#C6A04E]/40 p-8 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C6A04E] to-[#D4B574] rounded-t-3xl" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-xl bg-[#C6A04E]/10 flex items-center justify-center text-sm font-bold text-[#C6A04E]">✓</div>
                <h3 className="font-display text-xl font-bold text-[#1B2A4A]">With PillarBloom</h3>
              </div>
              <ul className="space-y-4">
                {[
                  'Course outline generated in 10 minutes',
                  'All platforms covered from one paste',
                  'One subscription replaces your entire toolkit',
                  'Brand voice AI makes output sound like YOU',
                  'Every piece of content becomes a sellable product',
                  'Paste. Generate. Publish. That\'s the whole workflow.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[#1B2A4A]">
                    <span className="text-[#C6A04E] mt-0.5 flex-shrink-0 font-bold">✓</span>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — ROI CALCULATOR */}
      <section className="py-24 md:py-32 bg-[#fafafa]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <SectionLabel>Show Your Numbers</SectionLabel>
            <SectionHeading>What could PillarBloom be worth to you?</SectionHeading>
            <p className="text-lg text-[#6B7280] mt-4 max-w-xl mx-auto">Move the sliders to see your estimated monthly ROI.</p>
          </div>
          <ROICalculator />
        </div>
      </section>

      {/* SECTION 7 — BRAND VOICE FEATURE */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <div>
              <SectionLabel>The Differentiator</SectionLabel>
              <SectionHeading>AI that sounds like you,<br />not like a robot.</SectionHeading>
              <p className="text-[#6B7280] mt-5 leading-relaxed text-lg max-w-lg">
                Paste 3 samples of your writing. PillarBloom learns your tone, sentence patterns,
                vocabulary level, and personality. Every output sounds authentically yours.
              </p>
              <div className="space-y-3 mt-7">
                {[
                  { icon: '🧠', title: 'Voice profile extraction', desc: 'Claude analyzes your style across tone, vocabulary, rhythm, and sentence structure.' },
                  { icon: '✍️', title: 'Applied to every output', desc: 'Both content repurposing and product generation use your profile automatically.' },
                  { icon: '🔄', title: 'Refine anytime', desc: 'Add more samples to improve your profile as your style evolves.' },
                ].map((feat) => (
                  <div key={feat.title} className="flex items-start gap-4 p-4 rounded-xl bg-[#fafafa] border border-[#e8eaed]">
                    <span className="text-xl flex-shrink-0 mt-0.5">{feat.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-[#1B2A4A] mb-0.5">{feat.title}</p>
                      <p className="text-xs text-[#6B7280] leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-[#9CA3AF] text-center mb-6">Same source. Different voices.</p>

              <div className="bg-[#fafafa] rounded-2xl border border-[#e8eaed] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#e8eaed]" />
                  <span className="text-xs font-bold uppercase tracking-widest text-[#9CA3AF]">Generic AI Output</span>
                </div>
                <p className="text-sm text-[#9CA3AF] italic leading-relaxed">
                  &ldquo;In today&apos;s fast-paced digital landscape, content creators face numerous challenges
                  when it comes to producing high-quality, engaging content on a consistent basis.
                  Leveraging artificial intelligence can provide significant advantages in streamlining
                  your content production workflow.&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-center py-1">
                <div className="flex items-center gap-3 w-full">
                  <div className="h-px flex-1 bg-[#e8eaed]" />
                  <span className="text-xs text-[#C6A04E] font-semibold bg-[#C6A04E]/8 border border-[#C6A04E]/20 px-3 py-1 rounded-full whitespace-nowrap">With your voice profile</span>
                  <div className="h-px flex-1 bg-[#e8eaed]" />
                </div>
              </div>

              <div className="bg-white rounded-2xl border-2 border-[#C6A04E]/40 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#C6A04E] animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest text-[#C6A04E]">PillarBloom — Your Voice</span>
                </div>
                <p className="text-sm text-[#1B2A4A] leading-relaxed">
                  &ldquo;Here&apos;s the honest truth most people don&apos;t want to hear:
                  You&apos;re not bad at content. You&apos;re just doing it the hard way.
                  One piece → 30 posts → zero extra hours. That&apos;s the whole system.
                  Let me show you how it actually works.&rdquo;
                </p>
              </div>

              <div className="text-center pt-2">
                <Link href="/signup" className="inline-flex items-center gap-2 bg-[#C6A04E] hover:bg-[#D4B574] text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-[#C6A04E]/25 hover:-translate-y-0.5">
                  Train PillarBloom on your voice →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 — PRICING */}
      <section id="pricing" className="py-24 md:py-32 bg-[#fafafa]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <SectionLabel>Simple Pricing</SectionLabel>
            <SectionHeading>Start free. Scale when you&apos;re ready.</SectionHeading>
            <p className="text-lg text-[#6B7280] mt-4 max-w-xl mx-auto">
              Every paid plan includes brand voice learning, all output formats, and export tools.
            </p>
          </div>
          <PricingSection />
        </div>
      </section>

      {/* SECTION 9 — TESTIMONIALS (placeholder) */}
      {/* TODO: Replace with real testimonials after first 5 users */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <SectionLabel>Early Access</SectionLabel>
            <SectionHeading>Be one of our first creators.</SectionHeading>
            <p className="text-lg text-[#6B7280] mt-4 max-w-xl mx-auto">
              PillarBloom is in early access. The first 100 creators who join will be featured
              here — and get 50% off for life.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mb-10">
            {[
              { emoji: '🌟', quote: 'Early access — this spot will feature your story and results.', metric: 'e.g. "$847 in product sales — week one"', name: 'Your Name', title: 'Content Creator' },
              { emoji: '✨', quote: 'Join now and get featured as one of our founding creators.', metric: '"Generated 30 days of content from one 2,000-word post"', name: 'Your Name', title: 'Course Creator' },
              { emoji: '🚀', quote: 'First 100 users get 50% off for life and a featured testimonial slot.', metric: '"Built an ebook in 15 minutes. Sold it the same day."', name: 'Your Name', title: 'Digital Product Creator' },
            ].map((t, i) => (
              <div key={i} className="bg-[#fafafa] border border-dashed border-[#e8eaed] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#e8eaed] flex items-center justify-center text-lg">{t.emoji}</div>
                  <div>
                    <p className="text-xs font-semibold text-[#1B2A4A]">{t.name}</p>
                    <p className="text-xs text-[#9CA3AF]">{t.title}</p>
                  </div>
                </div>
                <p className="text-sm text-[#9CA3AF] italic mb-3 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <p className="text-xs font-semibold text-[#C6A04E]">{t.metric}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/signup" className="inline-flex items-center gap-2 border-2 border-[#C6A04E] text-[#C6A04E] hover:bg-[#C6A04E] hover:text-white font-semibold px-8 py-4 rounded-xl text-base transition-all">
              Claim your founding creator spot →
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 10 — FINAL CTA */}
      <section className="py-24 md:py-32 bg-navy-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-10 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[#C6A04E]/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C6A04E] mb-4">Get Started</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-5">
            Your content is already valuable.
            <span className="block italic text-[#C6A04E]">Start getting paid for it.</span>
          </h2>
          <p className="text-white/70 text-lg mb-10 leading-relaxed">
            Free to start. No credit card required. First product in under 5 minutes.
          </p>

          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 bg-[#C6A04E] hover:bg-[#D4B574] text-white font-bold px-10 py-5 rounded-xl text-lg transition-all shadow-xl shadow-[#C6A04E]/30 hover:-translate-y-0.5 animate-glow-pulse"
          >
            Create Your Free Account
          </Link>

          <p className="text-white/40 text-sm mt-5">Join early adopters already using PillarBloom</p>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-white/50">
            <span className="flex items-center gap-2"><span className="text-[#C6A04E]">✓</span> No credit card required</span>
            <span className="flex items-center gap-2"><span className="text-[#C6A04E]">✓</span> Cancel anytime</span>
            <span className="flex items-center gap-2"><span className="text-[#C6A04E]">✓</span> Free trial included</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0f1e38] border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
              <Logo variant="light" width={140} />
              <p className="text-white/50 text-sm mt-3 leading-relaxed max-w-xs">
                Turn one piece of content into 30 days of posts and sellable digital products. All in your voice.
              </p>
              <p className="text-white/30 text-xs mt-4">Built with love in Chicago 🌆</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Product</p>
              <ul className="space-y-2.5">
                {[
                  { label: 'Content Engine', href: '#how-it-works' },
                  { label: 'Product Engine', href: '#how-it-works' },
                  { label: 'Brand Voice AI', href: '#' },
                  { label: 'Pricing', href: '#pricing' },
                ].map((l) => (
                  <li key={l.label}><a href={l.href} className="text-white/50 hover:text-white/80 text-sm transition-colors">{l.label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Account</p>
              <ul className="space-y-2.5">
                {[
                  { label: 'Sign up free', href: '/signup' },
                  { label: 'Log in', href: '/login' },
                  { label: 'Dashboard', href: '/dashboard' },
                ].map((l) => (
                  <li key={l.label}><Link href={l.href} className="text-white/50 hover:text-white/80 text-sm transition-colors">{l.label}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-xs">© 2026 PillarBloom. All rights reserved.</p>
            <div className="flex items-center gap-6 text-xs text-white/30">
              <a href="#" className="hover:text-white/60 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white/60 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
