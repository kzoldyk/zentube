"use server"

import { redirect } from "next/navigation"
import { count, eq } from "drizzle-orm"
import { getDb } from "@/db"
import { userInterests } from "@/db/schema"
import {
  clearSession,
  createUser,
  findUserByEmail,
  setSession,
  verifyPassword,
} from "@/lib/auth"

async function getPostAuthRedirect(userId: string) {
  const db = await getDb()
  const result = await db
    .select({ value: count() })
    .from(userInterests)
    .where(eq(userInterests.userId, userId))

  return (result[0]?.value ?? 0) >= 3 ? "/feed" : "/onboarding"
}

export async function signUp(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const password = String(formData.get("password") ?? "")
  const confirmPassword = String(formData.get("confirmPassword") ?? "")

  if (!email || !password) {
    redirect("/sign-up?error=missing_fields")
  }

  if (password.length < 8) {
    redirect("/sign-up?error=password_too_short")
  }

  if (password !== confirmPassword) {
    redirect("/sign-up?error=password_mismatch")
  }

  const existingUser = await findUserByEmail(email)
  if (existingUser) {
    redirect("/sign-up?error=email_exists")
  }

  const user = await createUser(email, password)
  await setSession(user.id)
  redirect("/onboarding")
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const password = String(formData.get("password") ?? "")

  if (!email || !password) {
    redirect("/sign-in?error=missing_fields")
  }

  const user = await findUserByEmail(email)
  if (!user) {
    redirect("/sign-in?error=invalid_credentials")
  }

  const validPassword = await verifyPassword(password, user.passwordHash)
  if (!validPassword) {
    redirect("/sign-in?error=invalid_credentials")
  }

  await setSession(user.id)
  redirect(await getPostAuthRedirect(user.id))
}

export async function signOut() {
  await clearSession()
  redirect("/")
}
