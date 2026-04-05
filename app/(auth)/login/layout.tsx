import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In — PillarBloom',
  description: 'Log in to your PillarBloom account to access your content projects and digital products.',
  robots: { index: false, follow: false },
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
