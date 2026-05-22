import Link from "next/link"
import { redirect } from "next/navigation"
import { AlertCircle } from "lucide-react"
import { signUp } from "@/lib/actions/auth"
import { getCurrentUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const errorMessages: Record<string, string> = {
  missing_fields: "Fill in every required field.",
  password_too_short: "Password must be at least 8 characters.",
  password_mismatch: "Passwords do not match.",
  email_exists: "That email is already registered.",
}

export default async function SignUpPage({
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
        <CardTitle className="text-2xl">Create account</CardTitle>
        <CardDescription>
          Use email and password for v1. You can add your interests right after signup.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {error ? (
          <div className="flex items-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <span>{errorMessages[error] ?? "Unable to create account."}</span>
          </div>
        ) : null}

        <form action={signUp} className="space-y-4">
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
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm password
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              className="h-10 rounded-xl"
            />
          </div>
          <Button type="submit" className="h-10 w-full rounded-xl">
            Create account
          </Button>
        </form>

        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-foreground underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
