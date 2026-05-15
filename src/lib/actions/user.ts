"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function saveUserInterests(topics: string[]) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  // Create or update user and their interests
  await prisma.user.upsert({
    where: { clerkId: userId },
    update: {
      interests: {
        deleteMany: {},
        create: topics.map(topic => ({ topic }))
      }
    },
    create: {
      clerkId: userId,
      interests: {
        create: topics.map(topic => ({ topic }))
      }
    }
  })

  revalidatePath("/")
}
