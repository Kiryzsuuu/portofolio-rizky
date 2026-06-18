import { NextResponse } from 'next/server'
import { COLLECTIONS, type CollectionName } from '@/lib/types'
import { createItem, listItems } from '@/lib/content'
import { isAuthenticated } from '@/lib/auth'

export const runtime = 'nodejs'

function valid(name: string): name is CollectionName {
  return (COLLECTIONS as readonly string[]).includes(name)
}

export async function GET(_req: Request, { params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params
  if (!valid(collection)) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const items = await listItems(collection)
  return NextResponse.json(items)
}

export async function POST(req: Request, { params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params
  if (!valid(collection)) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const data = await req.json()
  const item = await createItem(collection, data)
  return NextResponse.json(item, { status: 201 })
}
