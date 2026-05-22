"use server"

import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getDb } from "@/db"
import { userInterests } from "@/db/schema"
import { createId, requireUser } from "@/lib/auth"

export async function saveUserInterests(topics: string[]) {
  const user = await requireUser()
  const db = await getDb()
  const uniqueTopics = Array.from(new Set(topics))

  await db.delete(userInterests).where(eq(userInterests.userId, user.id))

  if (uniqueTopics.length > 0) {
    await db.insert(userInterests).values(
      uniqueTopics.map((topic) => ({
        id: createId(),
        userId: user.id,
        topic,
        createdAt: new Date(),
      }))
    )
  }

  revalidatePath("/", "layout")
  revalidatePath("/feed")
  revalidatePath("/settings")
}
