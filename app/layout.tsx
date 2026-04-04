import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PillarBloom — Turn One Piece of Content Into 30+ Outputs',
  description: 'PillarBloom uses AI to repurpose your best content into LinkedIn posts, email campaigns, tweet threads, lead magnets, and more — in minutes.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'PillarBloom — Turn One Piece of Content Into 30+ Outputs',
    description: 'AI-powered content repurposing. One input. 30+ outputs. Minutes, not hours.',
    type: 'website',
    siteName: 'PillarBloom',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="antialiased min-h-full flex flex-col">
        {children}
      </body>
    </html>
  )
}
