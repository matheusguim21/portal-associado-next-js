import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { getTheme } from '@teispace/next-themes/server'
import './globals.css'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { QueryProvider } from '@/providers/query-provider'
import { AuthProvider } from '@/providers/auth-provider'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Portal do Associado — SOCINPRO',
  description:
    'Portal do Associado da Sociedade Civil Independente de Produtores Musicais e Audiovisuais do Brasil',
  icons: {
    icon: '/logos/logo.svg',
    apple: '/logos/logo.svg',
    other: {
      rel: 'icon',
      url: '/logos/logo.svg',
    },
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0e7490' },
    { media: '(prefers-color-scheme: dark)', color: '#09111f' },
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const initialTheme = await getTheme()

  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
          storage="hybrid"
          initialTheme={initialTheme ?? undefined}
        >
          <QueryProvider>
            <AuthProvider>{children}</AuthProvider>
          </QueryProvider>
          <Toaster richColors position='bottom-right' duration={2000} />
        </ThemeProvider>
      </body>
    </html>
  )
}
