import type { Metadata } from 'next'
import { Oxanium, Source_Code_Pro } from 'next/font/google'
import '../src/styles/globals.css'

const oxanium = Oxanium({ 
  subsets: ['latin'],
  variable: '--font-sans',
})

const sourceCodePro = Source_Code_Pro({ 
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: '💹 TechStocks Pro',
  description: 'Professional stock tracking dashboard for tech companies',
  keywords: ['stocks', 'finance', 'tech', 'dashboard', 'investments'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${oxanium.variable} ${sourceCodePro.variable} font-sans`}>{children}</body>
    </html>
  )
} 