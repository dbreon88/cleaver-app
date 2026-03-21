import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'

export const metadata: Metadata = {
  title: 'CLEAVER',
  description: 'The sharpest social network',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <AuthProvider>
          <div className="mx-auto max-w-[480px] min-h-screen">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
