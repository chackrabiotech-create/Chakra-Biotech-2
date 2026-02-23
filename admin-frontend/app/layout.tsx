import './globals.css'
import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Saffron Dashboard - Admin Panel',
  description: 'Comprehensive admin dashboard for managing saffron e-commerce website',
  keywords: 'saffron, dashboard, admin, management, e-commerce',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans bg-admin-50">
        <AuthProvider>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#333',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}