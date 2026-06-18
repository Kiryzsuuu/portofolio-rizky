import { ObjectId } from 'mongodb'
import { getDb, isDbConfigured } from './mongodb'
import { defaultContent } from './defaults'
import type { CollectionName, Content, Settings } from './types'

const SETTINGS_ID = 'site'

type Doc = Record<string, unknown> & { _id?: unknown }

function serialize<T extends Doc>(doc: T): T {
  if (doc && doc._id) {
    return { ...doc, _id: String(doc._id) }
  }
  return doc
}

// Seed the database from defaults the first time it is used.
async function ensureSeeded() {
  const db = await getDb()
  const existing = await db.collection('settings').findOne({ _id: SETTINGS_ID as never })
  if (existing) return

  await db.collection('settings').insertOne({ _id: SETTINGS_ID as never, ...defaultContent.settings })
  for (const name of ['projects', 'experience', 'education', 'skills'] as const) {
    const items = defaultContent[name] as Doc[]
    if (items.length) {
      const docs = items.map((item) => {
        const copy = { ...item }
        delete copy._id
        return copy
      })
      await db.collection(name).insertMany(docs as never)
    }
  }
}

export async function getContent(): Promise<Content> {
  if (!isDbConfigured()) {
    return defaultContent
  }
  await ensureSeeded()
  const db = await getDb()

  const settingsDoc = (await db.collection('settings').findOne({ _id: SETTINGS_ID as never })) as Doc | null
  const settings = settingsDoc ? (settingsDoc as unknown as Settings) : defaultContent.settings

  const [projects, experience, education, skills] = await Promise.all([
    db.collection('projects').find().sort({ order: 1 }).toArray(),
    db.collection('experience').find().sort({ order: 1 }).toArray(),
    db.collection('education').find().sort({ order: 1 }).toArray(),
    db.collection('skills').find().sort({ order: 1 }).toArray(),
  ])

  return {
    settings: { ...settings, _id: undefined } as unknown as Settings,
    projects: projects.map((d) => serialize(d as Doc)) as unknown as Content['projects'],
    experience: experience.map((d) => serialize(d as Doc)) as unknown as Content['experience'],
    education: education.map((d) => serialize(d as Doc)) as unknown as Content['education'],
    skills: skills.map((d) => serialize(d as Doc)) as unknown as Content['skills'],
  }
}

export async function updateSettings(data: Partial<Settings>): Promise<Settings> {
  await ensureSeeded()
  const db = await getDb()
  const { ...rest } = data as Doc
  delete rest._id
  await db
    .collection('settings')
    .updateOne({ _id: SETTINGS_ID as never }, { $set: rest as never }, { upsert: true })
  const doc = (await db.collection('settings').findOne({ _id: SETTINGS_ID as never })) as Doc
  return { ...(doc as unknown as Settings), _id: undefined } as unknown as Settings
}

export async function listItems(collection: CollectionName) {
  await ensureSeeded()
  const db = await getDb()
  const items = await db.collection(collection).find().sort({ order: 1 }).toArray()
  return items.map((d) => serialize(d as Doc))
}

export async function createItem(collection: CollectionName, data: Doc) {
  const db = await getDb()
  const { ...rest } = data
  delete rest._id
  if (typeof rest.order !== 'number') {
    rest.order = await db.collection(collection).countDocuments()
  }
  const result = await db.collection(collection).insertOne(rest as never)
  return serialize({ ...rest, _id: result.insertedId })
}

export async function updateItem(collection: CollectionName, id: string, data: Doc) {
  const db = await getDb()
  const { ...rest } = data
  delete rest._id
  await db.collection(collection).updateOne({ _id: new ObjectId(id) }, { $set: rest as never })
  const doc = (await db.collection(collection).findOne({ _id: new ObjectId(id) })) as Doc
  return serialize(doc)
}

export async function deleteItem(collection: CollectionName, id: string) {
  const db = await getDb()
  await db.collection(collection).deleteOne({ _id: new ObjectId(id) })
  return { ok: true }
}
