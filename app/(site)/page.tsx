import { getCachedContent } from '@/lib/data'
import { Hero } from '@/components/sections'

export default async function HomePage() {
  const content = await getCachedContent()
  return <Hero settings={content.settings} projects={content.projects} />
}
