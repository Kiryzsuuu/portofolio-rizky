import { notFound } from 'next/navigation'
import { getCachedContent } from '@/lib/data'
import { ProjectDetail } from '@/components/sections'

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const content = await getCachedContent()
  const project =
    content.projects.find((p) => p._id === id) || content.projects[Number(id)]
  if (!project) notFound()
  return <ProjectDetail project={project} />
}
