import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aura Aurora - Emotion Analysis',
  description: 'Analyze emotions and display an aura around the person',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body>
        <div className="min-h-screen flex flex-col">
          <main className="flex-grow">{children}</main>
        </div>
      </body>
    </html>
  )
} 