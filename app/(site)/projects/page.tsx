import { getCachedContent } from '@/lib/data'
import { PageHeader, ProjectsGrid } from '@/components/sections'

export default async function ProjectsPage() {
  const content = await getCachedContent()
  return (
    <>
      <PageHeader which="projects" />
      <ProjectsGrid projects={content.projects} />
    </>
  )
}
