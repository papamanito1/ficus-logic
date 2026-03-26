import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Ficus Logic | Leadership & Niche Executive Search',
  description:
    'Premium leadership hiring and niche executive search firm. We connect organisations with transformative talent across industries worldwide.',
  openGraph: {
    title: 'Ficus Logic | Leadership & Niche Executive Search',
    description:
      'Premium leadership hiring and niche executive search firm. We connect organisations with transformative talent across industries worldwide.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Ficus Logic',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
