import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PillarBloom — Turn One Piece of Content Into 30+ Outputs',
  description: 'PillarBloom uses AI to repurpose your best content into LinkedIn posts, email campaigns, tweet threads, lead magnets, and more — in minutes.',
  openGraph: {
    title: 'PillarBloom — Turn One Piece of Content Into 30+ Outputs',
    description: 'AI-powered content repurposing. One input. 30+ outputs. Minutes, not hours.',
    type: 'website',
    siteName: 'PillarBloom',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full`}>
      <body className={`${inter.className} antialiased min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  )
}
