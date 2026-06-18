'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Lang } from '@/lib/i18n'

type Ctx = { lang: Lang; setLang: (lang: Lang) => void }

const LanguageContext = createContext<Ctx | null>(null)

export function LanguageProvider({
  defaultLang = 'en',
  children,
}: {
  defaultLang?: Lang
  children: React.ReactNode
}) {
  const [lang, setLang] = useState<Lang>(defaultLang)

  useEffect(() => {
    const saved = window.localStorage.getItem('lang') as Lang | null
    if (saved === 'en' || saved === 'id') setLang(saved)
  }, [])

  useEffect(() => {
    window.localStorage.setItem('lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo(() => ({ lang, setLang }), [lang])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
