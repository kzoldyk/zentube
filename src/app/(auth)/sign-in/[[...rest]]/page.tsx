import Link from "next/link"
import { redirect } from "next/navigation"
import { AlertCircle } from "lucide-react"
import { signIn } from "@/lib/actions/auth"
import { getCurrentUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const errorMessages: Record<string, string> = {
  missing_fields: "Enter both email and password.",
  invalid_credentials: "Email or password is incorrect.",
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const currentUser = await getCurrentUser()
  if (currentUser) {
    redirect("/feed")
  }

  const { error } = await searchParams

  return (
    <Card className="w-full max-w-md border border-border/80 bg-card/95 shadow-sm">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl">Sign in</CardTitle>
        <CardDescription>
          Continue with your saved interests, bookmarks, and watch progress.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {error ? (
          <div className="flex items-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <span>{errorMessages[error] ?? "Unable to sign in."}</span>
          </div>
        ) : null}

        <form action={signIn} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input id="email" name="email" type="email" required className="h-10 rounded-xl" />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              className="h-10 rounded-xl"
            />
          </div>
          <Button type="submit" className="h-10 w-full rounded-xl">
            Sign in
          </Button>
        </form>

        <p className="text-sm text-muted-foreground">
          No account yet?{" "}
          <Link href="/sign-up" className="text-foreground underline underline-offset-4">
            Create one
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
