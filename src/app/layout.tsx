import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CodeTimeline — Visual Git History Storyteller',
  description: 'Turn any GitHub repo into a beautiful, AI-powered visual history timeline.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://codetimeline.vercel.app'),
  openGraph: {
    siteName: 'CodeTimeline',
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'CodeTimeline — Visual Git History Storyteller' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/api/og'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#050508] font-sans">{children}</body>
    </html>
  )
}
