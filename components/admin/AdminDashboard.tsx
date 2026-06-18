'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { CollectionName, Content, Settings } from '@/lib/types'

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(' ')
}

type FieldType = 'text' | 'textarea' | 'localized' | 'localizedArea' | 'list' | 'number' | 'image'
type FieldDef = { key: string; label: string; type: FieldType }

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024 // 4 MB

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

type Item = Record<string, unknown> & { _id?: string }

const SCHEMAS: Record<CollectionName, FieldDef[]> = {
  projects: [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'description', label: 'Description', type: 'localizedArea' },
    { key: 'tech', label: 'Tech (one per line)', type: 'list' },
    { key: 'link', label: 'Link', type: 'text' },
    { key: 'image', label: 'Image (upload or URL)', type: 'image' },
    { key: 'order', label: 'Order', type: 'number' },
  ],
  experience: [
    { key: 'role', label: 'Role', type: 'text' },
    { key: 'company', label: 'Company', type: 'text' },
    { key: 'period', label: 'Period', type: 'text' },
    { key: 'highlights', label: 'Highlights (one per line)', type: 'list' },
    { key: 'order', label: 'Order', type: 'number' },
  ],
  education: [
    { key: 'school', label: 'School', type: 'text' },
    { key: 'period', label: 'Period', type: 'text' },
    { key: 'order', label: 'Order', type: 'number' },
  ],
  skills: [
    { key: 'title', label: 'Group title', type: 'text' },
    { key: 'items', label: 'Items (one per line)', type: 'list' },
    { key: 'order', label: 'Order', type: 'number' },
  ],
}

const INPUT =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base outline-none transition-colors focus:border-sky-400 focus:ring-2 focus:ring-sky-200'
const LABEL = 'mb-1 block text-sm font-medium text-slate-600'

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className={LABEL}>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className={INPUT} />
    </div>
  )
}

function LocField({
  label,
  area,
  value,
  onChange,
}: {
  label: string
  area?: boolean
  value: { en: string; id: string }
  onChange: (v: { en: string; id: string }) => void
}) {
  const v = value || { en: '', id: '' }
  return (
    <div>
      <label className={LABEL}>{label}</label>
      <div className="grid gap-2 sm:grid-cols-2">
        {(['en', 'id'] as const).map((loc) =>
          area ? (
            <textarea
              key={loc}
              rows={3}
              placeholder={loc.toUpperCase()}
              value={v[loc]}
              onChange={(e) => onChange({ ...v, [loc]: e.target.value })}
              className={INPUT}
            />
          ) : (
            <input
              key={loc}
              placeholder={loc.toUpperCase()}
              value={v[loc]}
              onChange={(e) => onChange({ ...v, [loc]: e.target.value })}
              className={INPUT}
            />
          ),
        )}
      </div>
    </div>
  )
}

function ImageField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  const [error, setError] = useState('')

  const onPick = async (file?: File | null) => {
    if (!file) return
    setError('')
    if (file.size > MAX_UPLOAD_BYTES) {
      setError('Image too large (max 4 MB).')
      return
    }
    onChange(await fileToDataUrl(file))
  }

  return (
    <div>
      <label className={LABEL}>{label}</label>
      <div className="flex items-start gap-3">
        <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-400">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="preview" className="h-full w-full object-cover" />
          ) : (
            'none'
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onPick(e.target.files?.[0])}
            className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-sm file:text-white hover:file:bg-slate-800"
          />
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="…or paste an image URL"
            className={INPUT}
          />
          {value ? (
            <button type="button" onClick={() => onChange('')} className="text-sm text-red-600 hover:underline">
              Remove image
            </button>
          ) : null}
        </div>
      </div>
      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  )
}

function FileField({
  label,
  accept,
  value,
  onChange,
  hint,
}: {
  label: string
  accept: string
  value: string
  onChange: (v: string) => void
  hint?: string
}) {
  const [error, setError] = useState('')
  const isData = value.startsWith('data:')

  const onPick = async (file?: File | null) => {
    if (!file) return
    setError('')
    if (file.size > MAX_UPLOAD_BYTES) {
      setError('File too large (max 4 MB).')
      return
    }
    onChange(await fileToDataUrl(file))
  }

  return (
    <div>
      <label className={LABEL}>{label}</label>
      <input
        type="file"
        accept={accept}
        onChange={(e) => onPick(e.target.files?.[0])}
        className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-sm file:text-white hover:file:bg-slate-800"
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="…or paste a URL"
        className={cx(INPUT, 'mt-2')}
      />
      <div className="mt-1 flex items-center gap-3 text-sm">
        {isData ? <span className="text-emerald-600">Uploaded file ✓</span> : null}
        {value ? (
          <a href={value} target="_blank" rel="noreferrer" className="text-sky-600 hover:underline">
            Open current
          </a>
        ) : null}
        {value ? (
          <button type="button" onClick={() => onChange('')} className="text-red-600 hover:underline">
            Remove
          </button>
        ) : null}
      </div>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  )
}

function emptyItem(fields: FieldDef[]): Item {
  const item: Item = {}
  for (const f of fields) {
    if (f.type === 'localized' || f.type === 'localizedArea') item[f.key] = { en: '', id: '' }
    else if (f.type === 'list') item[f.key] = []
    else if (f.type === 'number') item[f.key] = 0
    else item[f.key] = ''
  }
  return item
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldDef
  value: unknown
  onChange: (v: unknown) => void
}) {
  if (field.type === 'localized' || field.type === 'localizedArea') {
    const v = (value as { en: string; id: string }) || { en: '', id: '' }
    const Tag = field.type === 'localizedArea' ? 'textarea' : 'input'
    return (
      <div>
        <label className={LABEL}>{field.label}</label>
        <div className="grid gap-2 sm:grid-cols-2">
          {(['en', 'id'] as const).map((loc) => (
            <Tag
              key={loc}
              rows={field.type === 'localizedArea' ? 3 : undefined}
              placeholder={loc.toUpperCase()}
              value={v[loc]}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                onChange({ ...v, [loc]: e.target.value })
              }
              className={INPUT}
            />
          ))}
        </div>
      </div>
    )
  }

  if (field.type === 'image') {
    return <ImageField label={field.label} value={(value as string) || ''} onChange={onChange} />
  }

  if (field.type === 'list') {
    const v = (value as string[]) || []
    return (
      <div>
        <label className={LABEL}>{field.label}</label>
        <textarea
          rows={4}
          value={v.join('\n')}
          onChange={(e) => onChange(e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))}
          className={INPUT}
        />
      </div>
    )
  }

  if (field.type === 'textarea') {
    return (
      <div>
        <label className={LABEL}>{field.label}</label>
        <textarea rows={3} value={(value as string) || ''} onChange={(e) => onChange(e.target.value)} className={INPUT} />
      </div>
    )
  }

  if (field.type === 'number') {
    return (
      <div>
        <label className={LABEL}>{field.label}</label>
        <input
          type="number"
          value={(value as number) ?? 0}
          onChange={(e) => onChange(Number(e.target.value))}
          className={INPUT}
        />
      </div>
    )
  }

  return (
    <div>
      <label className={LABEL}>{field.label}</label>
      <input value={(value as string) || ''} onChange={(e) => onChange(e.target.value)} className={INPUT} />
    </div>
  )
}

function CollectionEditor({
  collection,
  initialItems,
}: {
  collection: CollectionName
  initialItems: Item[]
}) {
  const fields = SCHEMAS[collection]
  const [items, setItems] = useState<Item[]>(initialItems)
  const [draft, setDraft] = useState<Item | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const titleOf = (item: Item) =>
    (item.name as string) || (item.role as string) || (item.school as string) || (item.title as string) || '(untitled)'

  const startAdd = () => {
    setEditingId('new')
    setDraft(emptyItem(fields))
  }
  const startEdit = (item: Item) => {
    setEditingId(item._id || null)
    setDraft({ ...item })
  }
  const cancel = () => {
    setEditingId(null)
    setDraft(null)
    setError('')
  }

  const save = async () => {
    if (!draft) return
    setBusy(true)
    setError('')
    try {
      const isNew = editingId === 'new'
      const url = isNew ? `/api/${collection}` : `/api/${collection}/${editingId}`
      const res = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      })
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Save failed')
      const saved = (await res.json()) as Item
      setItems((prev) => (isNew ? [...prev, saved] : prev.map((i) => (i._id === saved._id ? saved : i))))
      cancel()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const remove = async (id?: string) => {
    if (!id || !window.confirm('Delete this item?')) return
    setBusy(true)
    try {
      const res = await fetch(`/api/${collection}/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setItems((prev) => prev.filter((i) => i._id !== id))
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold capitalize text-slate-900">{collection}</h2>
        <button
          onClick={startAdd}
          className="rounded-lg bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-500"
        >
          + Add
        </button>
      </div>

      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
          >
            <div className="min-w-0">
              <div className="truncate font-medium text-slate-900">{titleOf(item)}</div>
              <div className="text-xs text-slate-500">order: {String(item.order ?? '-')}</div>
            </div>
            <div className="flex shrink-0 gap-2">
              <button onClick={() => startEdit(item)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50">
                Edit
              </button>
              <button onClick={() => remove(item._id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50">
                Delete
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 ? <p className="text-sm text-slate-500">No items yet.</p> : null}
      </div>

      {draft ? (
        <div className="fixed inset-0 z-40 grid place-items-center bg-slate-900/40 p-4" onClick={cancel}>
          <div
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-lg font-semibold capitalize text-slate-900">
              {editingId === 'new' ? `New ${collection}` : `Edit ${collection}`}
            </h3>
            <div className="space-y-4">
              {fields.map((field) => (
                <FieldInput
                  key={field.key}
                  field={field}
                  value={draft[field.key]}
                  onChange={(v) => setDraft((d) => (d ? { ...d, [field.key]: v } : d))}
                />
              ))}
            </div>
            {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={cancel} className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">
                Cancel
              </button>
              <button
                onClick={save}
                disabled={busy}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
              >
                {busy ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function SettingsEditor({ initial }: { initial: Settings }) {
  const [s, setS] = useState<Settings>(initial)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  const set = (patch: Partial<Settings>) => setS((prev) => ({ ...prev, ...patch }))

  const save = async () => {
    setBusy(true)
    setMsg('')
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(s),
      })
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Save failed')
      setMsg('Saved!')
    } catch (err) {
      setMsg((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-slate-900">Site Settings</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Name" value={s.name} onChange={(v) => set({ name: v })} />
        <TextField label="Location" value={s.location} onChange={(v) => set({ location: v })} />
        <TextField label="Email" value={s.email} onChange={(v) => set({ email: v })} />
        <TextField label="Phone" value={s.phone} onChange={(v) => set({ phone: v })} />
      </div>

      <ImageField label="Profile photo" value={s.photo} onChange={(v) => set({ photo: v })} />

      <LocField label="Headline" value={s.headline} onChange={(v) => set({ headline: v })} />
      <LocField label="Summary" area value={s.summary} onChange={(v) => set({ summary: v })} />
      <LocField label="About" area value={s.about} onChange={(v) => set({ about: v })} />

      <div>
        <label className={LABEL}>Stack highlights (one per line)</label>
        <textarea
          rows={4}
          value={s.stackHighlights.join('\n')}
          onChange={(e) => set({ stackHighlights: e.target.value.split('\n').map((x) => x.trim()).filter(Boolean) })}
          className={INPUT}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Birth" value={s.personalData.placeAndDateOfBirth} onChange={(v) => set({ personalData: { ...s.personalData, placeAndDateOfBirth: v } })} />
        <TextField label="Gender" value={s.personalData.gender} onChange={(v) => set({ personalData: { ...s.personalData, gender: v } })} />
        <TextField label="Status" value={s.personalData.status} onChange={(v) => set({ personalData: { ...s.personalData, status: v } })} />
        <TextField label="Citizenship" value={s.personalData.citizenship} onChange={(v) => set({ personalData: { ...s.personalData, citizenship: v } })} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="GitHub URL" value={s.links.github} onChange={(v) => set({ links: { ...s.links, github: v } })} />
        <TextField label="LinkedIn URL" value={s.links.linkedin} onChange={(v) => set({ links: { ...s.links, linkedin: v } })} />
        <TextField label="Instagram URL" value={s.links.instagram} onChange={(v) => set({ links: { ...s.links, instagram: v } })} />
      </div>

      <FileField
        label="CV (PDF) — upload to replace"
        accept="application/pdf"
        value={s.links.cvPdf}
        onChange={(v) => set({ links: { ...s.links, cvPdf: v } })}
        hint="Uploaded PDF is stored in the database (max 4 MB). You can also paste a URL."
      />

      <div>
        <label className={LABEL}>Default language</label>
        <select
          value={s.site.defaultLang}
          onChange={(e) => set({ site: { ...s.site, defaultLang: e.target.value as 'en' | 'id' } })}
          className={INPUT}
        >
          <option value="en">English</option>
          <option value="id">Indonesia</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={save} disabled={busy} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60">
          {busy ? 'Saving…' : 'Save settings'}
        </button>
        {msg ? <span className="text-sm text-slate-600">{msg}</span> : null}
      </div>
    </div>
  )
}

const TABS: Array<{ key: string; label: string }> = [
  { key: 'settings', label: 'Settings' },
  { key: 'projects', label: 'Projects' },
  { key: 'experience', label: 'Experience' },
  { key: 'education', label: 'Education' },
  { key: 'skills', label: 'Skills' },
]

export function AdminDashboard({ content, username }: { content: Content; username: string }) {
  const router = useRouter()
  const [tab, setTab] = useState('settings')

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.replace('/admin/login')
    router.refresh()
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Admin Dashboard</h1>
          <p className="text-sm text-slate-500">Signed in as {username}</p>
        </div>
        <div className="flex gap-2">
          <a href="/" target="_blank" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50">
            View site
          </a>
          <button onClick={logout} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50">
            Logout
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cx(
              'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              tab === t.key ? 'bg-slate-900 text-white' : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {tab === 'settings' ? <SettingsEditor initial={content.settings} /> : null}
        {tab === 'projects' ? <CollectionEditor collection="projects" initialItems={content.projects as unknown as Item[]} /> : null}
        {tab === 'experience' ? <CollectionEditor collection="experience" initialItems={content.experience as unknown as Item[]} /> : null}
        {tab === 'education' ? <CollectionEditor collection="education" initialItems={content.education as unknown as Item[]} /> : null}
        {tab === 'skills' ? <CollectionEditor collection="skills" initialItems={content.skills as unknown as Item[]} /> : null}
      </div>
    </div>
  )
}
