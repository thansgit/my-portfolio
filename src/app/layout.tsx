import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { inter, roboto_mono } from './fonts'
import './globals.css'
import ClientLayout from '@/components/layout/ClientLayout'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' className={`w-full ${inter.variable} ${roboto_mono.variable}`} suppressHydrationWarning>
      <body className='m-0 min-h-screen w-full p-0 antialiased'>
        <ClientLayout>{children}</ClientLayout>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
