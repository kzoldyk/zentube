import { redirect } from "next/navigation";
import { count, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { userInterests } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { OnboardingClient } from "./onboarding-client";

export default async function OnboardingPage() {
  const user = await requireUser();
  const db = await getDb()
  const interests = await db
    .select({ value: count() })
    .from(userInterests)
    .where(eq(userInterests.userId, user.id))

  if ((interests[0]?.value ?? 0) >= 3) {
    redirect("/feed");
  }

  return <OnboardingClient />;
}
