import type { Metadata } from 'next'
import LeadMagnetClient from './LeadMagnetClient'

export const metadata: Metadata = {
  title: 'Free Download — The Content-to-Product Playbook',
  description: 'Get the free guide: 5 Digital Products You Can Create From One Blog Post. No fluff, no filler — just the exact framework.',
  robots: { index: true, follow: true },
}

export default function LeadMagnetPage() {
  return <LeadMagnetClient />
}
