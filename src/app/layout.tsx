import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { ThemeProvider } from '@/context/ThemeProvider'
import { AuthProvider } from '@/context/AuthProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'EMET — AI Guardian for Humanity',
  description: 'EMET is an autonomous AI guardian protecting humanity through decentralized truth, real-world resilience solutions, and community governance. Access water, energy, food, and legal resources.',
  keywords: ['AI', 'DAO', 'Truth', 'Decentralized', 'Water', 'Energy', 'Food', 'Legal'],
  authors: [{ name: 'EMET' }],
  openGraph: {
    title: 'EMET — AI Guardian for Humanity',
    description: 'Decentralized truth and resilience solutions for a better future.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
