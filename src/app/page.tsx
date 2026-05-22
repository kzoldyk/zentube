import Link from "next/link";
import { ArrowRight, Bookmark, PlayCircle, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center gap-12 px-6 py-16 lg:grid lg:grid-cols-[minmax(0,1fr)_460px] lg:items-center lg:gap-16 lg:py-24">
        <div className="space-y-8">
          <Badge variant="outline" className="rounded-full px-3 py-1">
            <Sparkles className="size-3" />
            Intentional video watching
          </Badge>

          <div className="space-y-5">
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
              A calmer way to watch YouTube.
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Curate your feed by interest, remove the usual clutter, and keep the videos
              that matter in one clean library.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/feed"
              className={buttonVariants({
                size: "lg",
                className: "rounded-full px-5",
              })}
            >
              Get started
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/about"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "rounded-full px-5",
              })}
            >
              Learn more
            </Link>
          </div>
        </div>

        <Card className="border border-border/80 bg-card/95 py-0 shadow-sm">
          <CardContent className="space-y-4 p-4">
            <div className="aspect-[4/3] rounded-[28px] border bg-muted/50 p-4">
              <div className="flex h-full flex-col gap-4 rounded-[24px] border bg-background p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Focused feed</p>
                    <p className="text-sm text-muted-foreground">No noisy recommendations</p>
                  </div>
                  <Badge variant="secondary" className="rounded-full">
                    Demo
                  </Badge>
                </div>

                <div className="grid flex-1 gap-3">
                  <div className="rounded-[22px] border bg-muted/50 p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="h-2.5 w-20 rounded-full bg-foreground/15" />
                        <div className="h-2.5 w-32 rounded-full bg-foreground/10" />
                      </div>
                      <div className="rounded-full border bg-background p-2">
                        <PlayCircle className="size-4" />
                      </div>
                    </div>
                    <div className="mt-6 aspect-video rounded-[18px] border bg-background" />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[22px] border bg-background p-4">
                      <Bookmark className="size-4 text-muted-foreground" />
                      <p className="mt-4 text-sm font-medium">Save what matters</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Keep useful videos close.
                      </p>
                    </div>
                    <div className="rounded-[22px] border bg-background p-4">
                      <Sparkles className="size-4 text-muted-foreground" />
                      <p className="mt-4 text-sm font-medium">Curated by interest</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Built around your topics.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
