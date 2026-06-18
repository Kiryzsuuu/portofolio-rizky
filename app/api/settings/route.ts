import { NextResponse } from 'next/server'
import { getContent, updateSettings } from '@/lib/content'
import { isAuthenticated } from '@/lib/auth'

export const runtime = 'nodejs'

export async function GET() {
  const content = await getContent()
  return NextResponse.json(content.settings)
}

export async function PUT(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const data = await req.json()
  const settings = await updateSettings(data)
  return NextResponse.json(settings)
}
