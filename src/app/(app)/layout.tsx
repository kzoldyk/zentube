import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SidebarNav } from "@/components/sidebar-nav";
import { MainHeader } from "@/components/main-header";
import { prisma } from "@/lib/prisma";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Check if user has completed onboarding (has at least 3 interests)
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      _count: {
        select: { interests: true }
      }
    }
  });

  if (!user || user._count.interests < 3) {
    redirect("/onboarding");
  }

  return (
    <div className="flex flex-col flex-1">
      <MainHeader />
      <div className="flex flex-1">
        <SidebarNav />
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </div>
  );
}
