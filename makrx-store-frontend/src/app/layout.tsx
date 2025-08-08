import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MakrX.Store - E-commerce & Service Hub for Makers',
  description: 'Your one-stop shop for tools, components, and manufacturing services. Built for makers, by makers. Get instant 3D printing quotes, browse premium maker tools, and connect with verified service providers.',
  keywords: [
    'maker tools',
    '3D printing',
    'CNC machining',
    'electronics',
    'Arduino',
    'manufacturing services',
    'maker store',
    'DIY',
    'prototyping',
    'STL files'
  ],
  authors: [{ name: 'MakrX Team' }],
  creator: 'MakrX',
  publisher: 'MakrX.Store',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://makrx.store',
    siteName: 'MakrX.Store',
    title: 'MakrX.Store - E-commerce & Service Hub for Makers',
    description: 'Your one-stop shop for tools, components, and manufacturing services. Built for makers, by makers.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MakrX.Store - E-commerce & Service Hub for Makers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MakrX.Store - E-commerce & Service Hub for Makers',
    description: 'Your one-stop shop for tools, components, and manufacturing services. Built for makers, by makers.',
    images: ['/og-image.jpg'],
    creator: '@makrx',
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#6366f1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
