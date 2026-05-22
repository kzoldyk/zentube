import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { AppShellProvider } from "@/components/app-shell-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zentube — A calmer way to watch YouTube",
  description:
    "Curate your feed, watch without distractions, and save what matters.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (() => {
                const savedTheme = localStorage.getItem("zentube-theme");
                const theme = savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark";
                document.documentElement.classList.toggle("dark", theme === "dark");
                document.documentElement.style.colorScheme = theme;
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased tracking-tight">
        <ClerkProvider>
          <AppShellProvider>{children}</AppShellProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
