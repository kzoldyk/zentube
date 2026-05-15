import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OnboardingClient } from "./onboarding-client";

export default async function OnboardingPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Check if user already has 3+ interests
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      interests: true,
    },
  });

  if (user && user.interests.length >= 3) {
    redirect("/feed");
  }

  return <OnboardingClient />;
}
