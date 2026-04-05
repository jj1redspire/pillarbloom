import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'PillarBloom — Turn Your Expertise Into Content AND Income',
  description: 'One paste. 30 days of social content. Sellable digital products. All in your voice. PillarBloom replaces Repurpose.io, Designrr, and ChatGPT in one subscription.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'PillarBloom — Turn Your Expertise Into Content AND Income',
    description: 'AI-powered content repurposing AND digital product creation. One input. Everything you need to publish and sell.',
    type: 'website',
    siteName: 'PillarBloom',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} h-full`}>
      <body className="antialiased min-h-full flex flex-col">
        {children}
      </body>
    </html>
  )
}
