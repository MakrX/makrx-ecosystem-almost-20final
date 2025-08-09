import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import ToastNotifications from '@/components/ToastNotifications'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MakrX Store - 3D Printing Materials & Services',
  description: 'Premium 3D printing materials, equipment, and professional printing services for makers and professionals.',
  keywords: '3D printing, filament, PLA, ABS, PETG, 3D printer, maker, prototyping',
  authors: [{ name: 'MakrX' }],
  openGraph: {
    title: 'MakrX Store - 3D Printing Materials & Services',
    description: 'Premium 3D printing materials, equipment, and professional printing services',
    url: 'https://makrx.store',
    siteName: 'MakrX Store',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MakrX Store - 3D Printing Materials & Services',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MakrX Store - 3D Printing Materials & Services',
    description: 'Premium 3D printing materials, equipment, and professional printing services',
    images: ['/og-image.jpg'],
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
