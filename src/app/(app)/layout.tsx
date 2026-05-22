import { redirect } from "next/navigation";
import { count, eq } from "drizzle-orm";
import { SidebarNav } from "@/components/sidebar-nav";
import { MainHeader } from "@/components/main-header";
import { getDb } from "@/db";
import { userInterests } from "@/db/schema";
import { requireUser } from "@/lib/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const viewer = await requireUser();
  const db = await getDb()
  const interestCount = await db
    .select({ value: count() })
    .from(userInterests)
    .where(eq(userInterests.userId, viewer.id))

  if ((interestCount[0]?.value ?? 0) < 3) {
    redirect("/onboarding");
  }

  return (
    <div className="flex flex-col flex-1">
      <MainHeader viewerEmail={viewer.email} />
      <div className="flex flex-1 overflow-hidden">
        <SidebarNav />
        <main className="flex min-w-0 flex-1 flex-col">{children}</main>
      </div>
    </div>
  );
}
