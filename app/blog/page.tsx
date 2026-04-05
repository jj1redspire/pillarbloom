import type { Metadata } from 'next'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { BLOG_POSTS } from '@/lib/blog-posts'

export const metadata: Metadata = {
  title: 'Blog — PillarBloom',
  description: 'Practical guides on content repurposing, digital product creation, and building revenue from your expertise. Written for creators who want to work smarter.',
  openGraph: {
    title: 'Blog — PillarBloom',
    description: 'Practical guides on content repurposing, digital products, and creator monetization.',
    type: 'website',
  },
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#e8eaed]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <Logo variant="dark" width={140} />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-[#6B7280] hover:text-[#1B2A4A] transition-colors">Home</Link>
            <Link
              href="/signup"
              className="bg-[#C6A04E] hover:bg-[#D4B574] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              Start Free →
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-[#fafafa] border-b border-[#e8eaed] py-16">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C6A04E] mb-3">The PillarBloom Blog</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[#1B2A4A] tracking-tight mb-4">
            Guides for creators who build.
          </h1>
          <p className="text-lg text-[#6B7280] max-w-xl leading-relaxed">
            Practical writing on content repurposing, digital product creation, and turning your expertise into income.
          </p>
        </div>
      </div>

      {/* Posts grid */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid gap-6">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white border border-[#e8eaed] rounded-2xl p-8 hover:border-[#C6A04E]/40 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#C6A04E] bg-[#C6A04E]/8 border border-[#C6A04E]/20 px-2.5 py-1 rounded-full">
                  {post.category}
                </span>
                <span className="text-xs text-[#9CA3AF]">
                  {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  {' · '}{post.readTime}
                </span>
              </div>
              <h2 className="font-display text-2xl font-bold text-[#1B2A4A] mb-3 tracking-tight group-hover:text-[#C6A04E] transition-colors leading-tight">
                {post.title}
              </h2>
              <p className="text-[#6B7280] leading-relaxed text-sm mb-4">{post.excerpt}</p>
              <span className="text-sm font-semibold text-[#C6A04E] group-hover:underline">
                Read article →
              </span>
            </Link>
          ))}
        </div>

        {/* CTA after posts */}
        <div className="mt-16 bg-[#1B2A4A] rounded-3xl p-10 text-center text-white">
          <p className="text-xs font-bold uppercase tracking-widest text-[#C6A04E] mb-3">Try It Free</p>
          <h2 className="font-display text-3xl font-bold mb-3 tracking-tight">Ready to put this into practice?</h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto leading-relaxed">
            PillarBloom turns one piece of content into 30 days of posts and sellable digital products — all in your voice.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-[#C6A04E] hover:bg-[#D4B574] text-white font-semibold px-8 py-4 rounded-xl transition-colors text-base"
          >
            Start free — no credit card needed →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0f1e38] border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo variant="light" width={120} />
          <div className="flex items-center gap-6 text-xs text-white/40">
            <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
            <Link href="/blog" className="hover:text-white/70 transition-colors">Blog</Link>
            <Link href="/signup" className="hover:text-white/70 transition-colors">Sign up free</Link>
          </div>
          <p className="text-white/30 text-xs">© 2026 PillarBloom</p>
        </div>
      </footer>
    </div>
  )
}
