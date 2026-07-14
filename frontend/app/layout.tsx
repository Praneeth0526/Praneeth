import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Praneeth G — Software Engineer',
  description: 'Software engineer building AI systems, search engines, and NLP pipelines.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
