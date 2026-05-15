import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-black">
      <main className="flex flex-1 w-full max-w-4xl flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          A calmer way to watch{" "}
          <span className="text-red-500">YouTube</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          Curate your feed by interest. Watch without distractions.
          Save and organize what matters.
        </p>
        <div className="mt-10 flex items-center gap-4">
          <Link
            href="/feed"
            className="inline-flex h-12 items-center justify-center rounded-full bg-zinc-900 px-8 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Get started
          </Link>
          <Link
            href="/about"
            className="inline-flex h-12 items-center justify-center rounded-full border-hairline px-8 text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            Learn more
          </Link>
        </div>
      </main>
    </div>
  );
}
