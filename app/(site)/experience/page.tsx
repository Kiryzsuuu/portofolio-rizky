import { getCachedContent } from '@/lib/data'
import { ExperienceList, PageHeader } from '@/components/sections'

export default async function ExperiencePage() {
  const content = await getCachedContent()
  return (
    <>
      <PageHeader which="experience" />
      <ExperienceList experience={content.experience} />
    </>
  )
}
