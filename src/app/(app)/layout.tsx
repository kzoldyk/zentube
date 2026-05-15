import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SidebarNav } from "@/components/sidebar-nav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="flex flex-1">
      <SidebarNav />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
