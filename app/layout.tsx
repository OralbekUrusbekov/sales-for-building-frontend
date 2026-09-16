import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'
import { Chrome } from '@/components/chrome'
import { SiteSettingsProvider } from '@/lib/site-settings'
import { AuthProvider } from '@/lib/auth'

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'RemontHub — материалы, мастера и ремонт под ключ в Астане',
  description:
    'Стройматериалы с доставкой, проверенные мастера, услуги под ключ и калькулятор сметы — всё для ремонта в одном месте.',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f7f4ef',
  userScalable: true,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`bg-background ${manrope.variable}`}>
      <body>
        <AuthProvider>
          <SiteSettingsProvider>
            {children}
            <Chrome />
          </SiteSettingsProvider>
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
