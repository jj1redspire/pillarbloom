import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Start Free Trial — PillarBloom',
  description: 'Create your PillarBloom account. Free to start — turn your content into 30 days of posts and sellable digital products, all in your voice.',
  openGraph: {
    title: 'Start Free Trial — PillarBloom',
    description: 'Turn your expertise into content AND income. Free to start, no credit card required.',
    type: 'website',
  },
}

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
