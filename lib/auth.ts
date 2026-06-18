import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { getDb } from './mongodb'

export const SESSION_COOKIE = 'session'

function secret() {
  const value = process.env.AUTH_SECRET || 'dev-insecure-secret-change-me'
  return new TextEncoder().encode(value)
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function createToken(username: string) {
  return new SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret())
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret())
    return payload as { username: string }
  } catch {
    return null
  }
}

export async function getSessionUser() {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) return null
  return verifyToken(token)
}

export async function isAuthenticated() {
  return Boolean(await getSessionUser())
}

type AdminUser = { username: string; passwordHash: string }

// Verifies credentials. Bootstraps the first admin from env vars
// (ADMIN_USERNAME / ADMIN_PASSWORD) when the users collection is empty.
export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  const db = await getDb()
  const users = db.collection<AdminUser>('users')
  const count = await users.countDocuments()

  if (count === 0) {
    const envUser = process.env.ADMIN_USERNAME
    const envPass = process.env.ADMIN_PASSWORD
    if (envUser && envPass && username === envUser && password === envPass) {
      await users.insertOne({ username: envUser, passwordHash: await hashPassword(envPass) })
      return true
    }
    return false
  }

  const user = await users.findOne({ username })
  if (!user) return false
  return bcrypt.compare(password, user.passwordHash)
}
