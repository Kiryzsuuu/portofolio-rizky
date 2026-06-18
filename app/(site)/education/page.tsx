import { getCachedContent } from '@/lib/data'
import { EducationList, PageHeader } from '@/components/sections'

export default async function EducationPage() {
  const content = await getCachedContent()
  return (
    <>
      <PageHeader which="education" />
      <EducationList education={content.education} />
    </>
  )
}
