import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/auth'
import { getContent } from '@/lib/content'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const user = await getSessionUser()
  if (!user) redirect('/admin/login')

  const content = await getContent()
  return <AdminDashboard content={content} username={user.username} />
}
