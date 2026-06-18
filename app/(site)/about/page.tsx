import { getCachedContent } from '@/lib/data'
import { AboutView, PageHeader } from '@/components/sections'

export default async function AboutPage() {
  const content = await getCachedContent()
  return (
    <>
      <PageHeader which="about" />
      <AboutView settings={content.settings} skills={content.skills} />
    </>
  )
}
