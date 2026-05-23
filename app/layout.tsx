import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import ChatBot from '@/components/chat/ChatBot'

export const metadata: Metadata = {
  title: 'Aman Kumar Yadav | AI & ML Engineer',
  description: 'B.Tech IT student specializing in AI, Machine Learning, Computer Vision & Robotics. Building intelligent systems.',
  keywords: ['AI', 'Machine Learning', 'Computer Vision', 'Robotics', 'Python', 'Next.js', 'Portfolio'],
  authors: [{ name: 'Aman Kumar Yadav' }],
  openGraph: {
    title: 'Aman Kumar Yadav | AI & ML Engineer',
    description: 'Building Intelligent Systems — AI, ML, Computer Vision & Robotics',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
        <ChatBot />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--surface-elevated)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '14px',
            },
          }}
        />
      </body>
    </html>
  )
}
