import type { Metadata } from 'next'
import DemoClient from './DemoClient'

export const metadata: Metadata = {
  title: 'Interactive Demo — See PillarBloom in Action',
  description: 'See how PillarBloom turns one blog post into an ebook outline and email course — no signup required.',
  robots: { index: true, follow: true },
}

export default function DemoPage() {
  return <DemoClient />
}
