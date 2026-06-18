import { getCachedContent } from '@/lib/data'
import { ContactView, PageHeader } from '@/components/sections'

export default async function ContactPage() {
  const content = await getCachedContent()
  return (
    <>
      <PageHeader which="contact" />
      <ContactView settings={content.settings} />
    </>
  )
}
