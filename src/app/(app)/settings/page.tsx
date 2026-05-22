import { count, eq } from "drizzle-orm"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Layers3, Sparkles, SlidersHorizontal } from "lucide-react"
import { requireUser } from "@/lib/auth"
import { getDb } from "@/db"
import { bookmarks, userInterests, watchProgress } from "@/db/schema"

export default async function SettingsPage() {
  const user = await requireUser()
  const db = await getDb()
  const [interestRows, bookmarkCount, progressCount] = await Promise.all([
    db.select().from(userInterests).where(eq(userInterests.userId, user.id)),
    db.select({ value: count() }).from(bookmarks).where(eq(bookmarks.userId, user.id)),
    db.select({ value: count() }).from(watchProgress).where(eq(watchProgress.userId, user.id)),
  ])

  const interests = interestRows.map((interest) => interest.topic)

  return (
    <div className="flex flex-1 flex-col p-4 sm:p-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <Card className="border border-border/80 bg-card/95 shadow-sm">
          <CardHeader className="gap-3">
            <Badge variant="outline" className="w-fit rounded-full px-2.5 py-1">
              <SlidersHorizontal className="size-3" />
              Settings
            </Badge>
            <div className="space-y-1">
              <CardTitle className="text-2xl">Feed preferences</CardTitle>
              <CardDescription>
                This is where the app explains how your curated feed is shaped.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <Card className="border border-border/80 bg-card/95 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Layers3 className="size-4 text-muted-foreground" />
                <CardTitle className="text-base">Selected interests</CardTitle>
              </div>
              <CardDescription>
                Your feed is currently sourced from these topics. Update onboarding later if you want a different mix.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {interests.length ? (
                interests.map((interest) => (
                  <Badge key={interest} variant="secondary" className="rounded-full px-3 py-1.5">
                    {interest}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No interests saved yet.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border border-border/80 bg-card/95 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-muted-foreground" />
                <CardTitle className="text-base">Curated feed details</CardTitle>
              </div>
              <CardDescription>
                Simple visibility into what the app uses and stores for you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-2xl border bg-background px-4 py-3">
                <p className="text-sm font-medium">Interest sources</p>
                <p className="text-sm text-muted-foreground">{interests.length} selected topics</p>
              </div>
              <div className="rounded-2xl border bg-background px-4 py-3">
                <p className="text-sm font-medium">Bookmarks</p>
                <p className="text-sm text-muted-foreground">{bookmarkCount[0]?.value ?? 0} saved videos</p>
              </div>
              <div className="rounded-2xl border bg-background px-4 py-3">
                <p className="text-sm font-medium">Watch history signals</p>
                <p className="text-sm text-muted-foreground">
                  {progressCount[0]?.value ?? 0} videos with saved progress
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
