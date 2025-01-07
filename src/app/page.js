'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const browserLang = navigator.language.slice(0, 2)
    const supportedLanguages = ['en', 'tr']
    const language = supportedLanguages.includes(browserLang) ? browserLang : 'en'
    router.replace(`/${language}/dashboard`)
  }, [router])

  return null
}
