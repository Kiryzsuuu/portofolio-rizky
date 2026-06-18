import { NextResponse } from 'next/server'
import { COLLECTIONS, type CollectionName } from '@/lib/types'
import { deleteItem, updateItem } from '@/lib/content'
import { isAuthenticated } from '@/lib/auth'

export const runtime = 'nodejs'

function valid(name: string): name is CollectionName {
  return (COLLECTIONS as readonly string[]).includes(name)
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ collection: string; id: string }> },
) {
  const { collection, id } = await params
  if (!valid(collection)) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const data = await req.json()
  const item = await updateItem(collection, id, data)
  return NextResponse.json(item)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ collection: string; id: string }> },
) {
  const { collection, id } = await params
  if (!valid(collection)) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const result = await deleteItem(collection, id)
  return NextResponse.json(result)
}
