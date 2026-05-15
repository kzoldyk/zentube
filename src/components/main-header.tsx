"use client"

import * as React from "react"
import Link from "next/link"
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"

export function MainHeader() {
  const { scrollY } = useScroll()
  
  // Interpolate values based on scroll position
  // The header starts transparent and becomes solid/blurred over 20px of scroll
  const headerOpacity = useTransform(scrollY, [0, 20], [0, 1])
  const blurValue = useTransform(scrollY, [0, 20], [0, 12])
  const backdropFilter = useTransform(blurValue, (v) => `blur(${v}px)`)

  return (
    <header className="sticky top-0 z-50 h-16 flex items-center justify-between px-6 py-3 transition-colors">
      {/* 
        Animated background layer. 
        We use an absolute div to allow for independent opacity/blur 
        without affecting the content's opacity.
      */}
      <motion.div 
        className="absolute inset-0 -z-10 bg-background/80 border-b-hairline pointer-events-none"
        style={{ 
          opacity: headerOpacity,
          backdropFilter,
        }}
      />
      
      <Link href="/" className="text-lg font-semibold tracking-tight">
        Zentube
      </Link>
      
      <div className="flex items-center gap-4">
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button size="sm">
              Sign up
            </Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  )
}
