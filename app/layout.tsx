import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rizky Fadhillah — Portfolio',
  description: 'Portfolio of Rizky Fadhillah — AI Engineer, Web Developer, Cloud & DevOps Enthusiast.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
