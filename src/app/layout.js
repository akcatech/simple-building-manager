'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname, useParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import AdminLayout from './components/AdminLayout'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { NextIntlClientProvider } from 'next-intl'
import Spinner from './components/Spinner'
import { ToastContainer } from 'react-toastify'

const theme = createTheme()

async function getMessages(locale) {
  try {
    return (await import(`@/messages/${locale}.json`)).default
  } catch (error) {
    console.error('Failed to load messages:', error)
    return {}
  }
}

function RootLayout({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const lang = params?.lang || 'tr'

  const [messages, setMessages] = useState({})

  useEffect(() => {
    getMessages(lang).then(setMessages)
  }, [lang])

  useEffect(() => {
    if (loading) return
    if (!user && !pathname.includes('/login')) {
      router.push(`/${lang}/login`)
    }
  }, [user])

  return (
    <html lang={lang}>
      <body>
        <NextIntlClientProvider locale={lang} messages={messages}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <ToastContainer />
            {loading ? (
              <Spinner />
            ) : user && !pathname.includes('/login') ? (
              <AdminLayout>{children}</AdminLayout>
            ) : (
              children
            )}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

export default RootLayout
