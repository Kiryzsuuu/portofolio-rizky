import { getCachedContent } from '@/lib/data'
import { LanguageProvider } from '@/components/LanguageProvider'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/sections'

export const dynamic = 'force-dynamic'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const content = await getCachedContent()

  return (
    <LanguageProvider defaultLang={content.settings.site.defaultLang}>
      <div className="relative min-h-dvh overflow-hidden px-3 py-3 sm:px-4 sm:py-4">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
        <div className="pointer-events-none absolute inset-0 mask-fade">
          <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-sky-500/15 blur-3xl" />
          <div className="absolute top-24 -left-24 h-[440px] w-[440px] rounded-full bg-fuchsia-500/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[520px] w-[520px] rounded-full bg-emerald-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <SiteHeader settings={content.settings} />
          <main className="mt-4 rounded-3xl border border-slate-200/80 bg-white/55 px-4 py-8 shadow-xl shadow-slate-900/5 sm:px-6 md:py-12">
            {children}
          </main>
          <SiteFooter content={content} />
        </div>
      </div>
    </LanguageProvider>
  )
}
