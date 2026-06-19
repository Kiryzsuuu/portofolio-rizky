import { NextResponse } from 'next/server'
import { SESSION_COOKIE, createToken, verifyCredentials } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()
    if (!username || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
    }
    const ok = await verifyCredentials(username, password)
    if (!ok) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
    }
    const token = await createToken(username)
    const res = NextResponse.json({ ok: true })
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
    return res
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
