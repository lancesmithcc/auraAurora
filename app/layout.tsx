import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aura Aurora - Emotion Visualization',
  description: 'Experience your emotions as a beautiful aurora of colors and patterns',
  viewport: 'width=device-width, initial-scale=1',
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&family=Space+Grotesk:wght@300;400;500;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#000020" />
      </head>
      <body>
        <div className="min-h-screen flex flex-col">
          <main className="flex-grow">{children}</main>
        </div>
      </body>
    </html>
  )
} 