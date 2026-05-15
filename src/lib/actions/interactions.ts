"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function toggleBookmark(videoId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true }
  })
  if (!user) throw new Error("User not found")

  const existing = await prisma.bookmark.findUnique({
    where: { userId_videoId: { userId: user.id, videoId } }
  })

  if (existing) {
    await prisma.bookmark.delete({
      where: { id: existing.id }
    })
  } else {
    await prisma.bookmark.create({
      data: { userId: user.id, videoId }
    })
  }

  revalidatePath("/bookmarks")
  revalidatePath("/feed")
}

export async function updateProgress(videoId: string, progress: number) {
  const { userId } = await auth()
  if (!userId) return

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true }
  })
  if (!user) return

  await prisma.watchProgress.upsert({
    where: { userId_videoId: { userId: user.id, videoId } },
    update: { progress },
    create: { userId: user.id, videoId, progress }
  })
}
