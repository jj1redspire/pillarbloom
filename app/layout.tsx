import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import CookieConsent from '@/components/CookieConsent'
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

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://pillarbloom.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'PillarBloom — Turn Your Expertise Into Content AND Income',
    template: '%s',
  },
  description: 'Paste once. Get 30 days of social media content AND sellable digital products. Ebooks, courses, workbooks, email sequences — all in your voice.',
  keywords: [
    'content repurposing', 'digital products', 'ebook generator', 'AI content creation',
    'course creator', 'content marketing', 'repurpose content', 'digital product creator',
  ],
  authors: [{ name: 'PillarBloom' }],
  creator: 'PillarBloom',
  publisher: 'PillarBloom',
  openGraph: {
    type: 'website',
    siteName: 'PillarBloom',
    title: 'PillarBloom — Turn Your Expertise Into Content AND Income',
    description: 'Paste once. Get 30 days of social content AND sellable digital products. All in your voice.',
    url: BASE_URL,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'PillarBloom — Turn Your Expertise Into Content AND Income' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PillarBloom — Turn Your Expertise Into Content AND Income',
    description: 'Paste once. Get 30 days of content AND sellable digital products. All in your voice.',
    images: ['/opengraph-image'],
    creator: '@pillarbloom',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: { icon: '/favicon.svg' },
  alternates: {
    canonical: BASE_URL,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} h-full`}>
      <body className="antialiased min-h-full flex flex-col">
        <GoogleAnalytics />
        {children}
        <CookieConsent />
      </body>
    </html>
  )
}
