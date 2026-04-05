import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { BLOG_POSTS, getBlogPost } from '@/lib/blog-posts'

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return {}

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://pillarbloom.com'

  return {
    title: `${post.title} — PillarBloom Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${baseUrl}/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      siteName: 'PillarBloom',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://pillarbloom.com'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: 'PillarBloom',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'PillarBloom',
      url: baseUrl,
      logo: { '@type': 'ImageObject', url: `${baseUrl}/favicon.svg` },
    },
    url: `${baseUrl}/blog/${post.slug}`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${baseUrl}/blog/${post.slug}` },
  }

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#e8eaed]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <Logo variant="dark" width={140} />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="text-sm text-[#6B7280] hover:text-[#1B2A4A] transition-colors">← Blog</Link>
            <Link
              href="/signup"
              className="bg-[#C6A04E] hover:bg-[#D4B574] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              Start Free →
            </Link>
          </div>
        </div>
      </nav>

      {/* Article header */}
      <div className="bg-[#fafafa] border-b border-[#e8eaed] py-16">
        <div className="max-w-2xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C6A04E] bg-[#C6A04E]/8 border border-[#C6A04E]/20 px-2.5 py-1 rounded-full">
              {post.category}
            </span>
            <span className="text-xs text-[#9CA3AF]">
              {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              {' · '}{post.readTime}
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[#1B2A4A] tracking-tight leading-tight mb-5">
            {post.title}
          </h1>
          <p className="text-lg text-[#6B7280] leading-relaxed">{post.excerpt}</p>
        </div>
      </div>

      {/* Article body */}
      <div className="max-w-2xl mx-auto px-6 py-14">
        <div
          className="prose-pillarbloom"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Divider */}
        <div className="border-t border-[#e8eaed] my-14" />

        {/* CTA */}
        <div className="bg-[#1B2A4A] rounded-3xl p-10 text-center text-white">
          <p className="text-xs font-bold uppercase tracking-widest text-[#C6A04E] mb-3">
            Try It Free
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3 tracking-tight">
            Stop leaving your content value on the table.
          </h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto leading-relaxed text-sm">
            PillarBloom turns one piece of content into 30 days of posts and sellable digital
            products — all in your voice, in minutes.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-[#C6A04E] hover:bg-[#D4B574] text-white font-semibold px-8 py-4 rounded-xl transition-colors"
          >
            Create your free account →
          </Link>
          <p className="text-white/40 text-xs mt-3">No credit card required. Cancel anytime.</p>
        </div>

        {/* Related posts */}
        <div className="mt-14">
          <p className="text-xs font-bold uppercase tracking-widest text-[#9CA3AF] mb-5">More from the blog</p>
          <div className="grid gap-4">
            {BLOG_POSTS.filter((p) => p.slug !== post.slug).map((related) => (
              <Link
                key={related.slug}
                href={`/blog/${related.slug}`}
                className="group flex items-start gap-4 p-5 bg-[#fafafa] border border-[#e8eaed] rounded-xl hover:border-[#C6A04E]/40 transition-all"
              >
                <div>
                  <p className="text-xs text-[#9CA3AF] mb-1">{related.category}</p>
                  <p className="text-sm font-semibold text-[#1B2A4A] group-hover:text-[#C6A04E] transition-colors leading-snug">
                    {related.title}
                  </p>
                </div>
                <svg className="w-4 h-4 text-[#D1D5DB] group-hover:text-[#C6A04E] transition-colors flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
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
