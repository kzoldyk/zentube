import "server-only"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { and, eq, gt } from "drizzle-orm"
import { getDb } from "@/db"
import { sessions, users } from "@/db/schema"

const SESSION_COOKIE_NAME = "zentube_session"
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30
const PASSWORD_ITERATIONS = 100_000

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")
}

function hexToBytes(hex: string) {
  const bytes = new Uint8Array(hex.length / 2)

  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  }

  return bytes
}

async function derivePasswordHash(password: string, saltHex: string, iterations: number) {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  )

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: hexToBytes(saltHex),
      iterations,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  )

  return bytesToHex(new Uint8Array(derivedBits))
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value))
  return bytesToHex(new Uint8Array(digest))
}

export function createId() {
  return crypto.randomUUID()
}

export async function hashPassword(password: string) {
  const salt = bytesToHex(crypto.getRandomValues(new Uint8Array(16)))
  const hash = await derivePasswordHash(password, salt, PASSWORD_ITERATIONS)
  return `${PASSWORD_ITERATIONS}:${salt}:${hash}`
}

export async function verifyPassword(password: string, storedHash: string) {
  const [iterations, salt, hash] = storedHash.split(":")
  if (!iterations || !salt || !hash) return false
  const parsedIterations = Number(iterations)
  if (!Number.isInteger(parsedIterations) || parsedIterations <= 0) return false

  const candidateHash = await derivePasswordHash(password, salt, parsedIterations)
  return candidateHash === hash
}

export async function setSession(userId: string) {
  const db = await getDb()
  const token = bytesToHex(crypto.getRandomValues(new Uint8Array(24)))
  const tokenHash = await sha256(token)
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)

  await db.insert(sessions).values({
    id: createId(),
    userId,
    tokenHash,
    expiresAt,
    createdAt: new Date(),
  })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  })
}

export async function clearSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (token) {
    const db = await getDb()
    const tokenHash = await sha256(token)
    await db.delete(sessions).where(eq(sessions.tokenHash, tokenHash))
  }

  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!token) return null

  const db = await getDb()
  const tokenHash = await sha256(token)
  const now = new Date()

  const result = await db
    .select({
      id: users.id,
      email: users.email,
      createdAt: users.createdAt,
    })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(and(eq(sessions.tokenHash, tokenHash), gt(sessions.expiresAt, now)))
    .limit(1)

  return result[0] ?? null
}

export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/sign-in")
  }
  return user
}

export async function findUserByEmail(email: string) {
  const db = await getDb()
  const normalizedEmail = normalizeEmail(email)

  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1)

  return result[0] ?? null
}

export async function createUser(email: string, password: string) {
  const db = await getDb()
  const normalizedEmail = normalizeEmail(email)
  const passwordHash = await hashPassword(password)
  const userId = createId()

  await db.insert(users).values({
    id: userId,
    email: normalizedEmail,
    passwordHash,
    createdAt: new Date(),
  })

  return { id: userId, email: normalizedEmail }
}
