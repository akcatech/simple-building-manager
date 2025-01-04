import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['tr', 'en'],
  defaultLocale: 'tr'
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
