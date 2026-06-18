'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { FaBars, FaXmark } from 'react-icons/fa6'
import { tr, ui, type Lang } from '@/lib/i18n'
import type { Settings } from '@/lib/types'
import { useLang } from './LanguageProvider'

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(' ')
}

export function SiteHeader({ settings }: { settings: Settings }) {
  const { lang, setLang } = useLang()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const initials = settings.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')

  const links = [
    { href: '/', label: tr(ui.nav.home, lang) },
    { href: '/about', label: tr(ui.nav.about, lang) },
    { href: '/projects', label: tr(ui.nav.projects, lang) },
    { href: '/experience', label: tr(ui.nav.experience, lang) },
    { href: '/education', label: tr(ui.nav.education, lang) },
    { href: '/contact', label: tr(ui.nav.contact, lang) },
  ]

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className="sticky top-3 z-30 rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur sm:top-4">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-sm font-bold text-white shadow-sm">
            {initials}
          </span>
          <span className="hidden sm:inline">{settings.name}</span>
        </Link>

        <nav className="hidden gap-1 text-base text-slate-700 lg:flex">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cx(
                'rounded-lg px-3 py-1.5 transition-colors',
                isActive(item.href)
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LangToggle lang={lang} onChange={setLang} />
          <a
            className="hidden rounded-lg bg-sky-600 px-3 py-2 text-base font-medium text-white shadow-sm transition-colors hover:bg-sky-500 sm:inline-block"
            href={settings.links.cvPdf}
            target="_blank"
            rel="noreferrer"
          >
            {tr(ui.actions.downloadCv, lang)}
          </a>
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white/60 text-slate-700 lg:hidden"
          >
            {open ? <FaXmark className="h-4 w-4" /> : <FaBars className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="flex flex-col gap-1 border-t border-slate-200/80 px-4 py-3 text-base lg:hidden">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cx(
                'rounded-lg px-3 py-2 transition-colors',
                isActive(item.href)
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-100',
              )}
            >
              {item.label}
            </Link>
          ))}
          <a
            className="mt-1 rounded-lg bg-sky-600 px-3 py-2 text-center font-medium text-white"
            href={settings.links.cvPdf}
            target="_blank"
            rel="noreferrer"
          >
            {tr(ui.actions.downloadCv, lang)}
          </a>
        </nav>
      ) : null}
    </header>
  )
}

function LangToggle({ lang, onChange }: { lang: Lang; onChange: (lang: Lang) => void }) {
  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-white/60 p-0.5 text-sm font-medium">
      {(['en', 'id'] as const).map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          aria-pressed={lang === value}
          className={cx(
            'rounded-md px-2.5 py-1.5 transition-colors',
            lang === value ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900',
          )}
        >
          {value.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
