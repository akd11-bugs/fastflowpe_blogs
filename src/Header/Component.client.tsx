'use client'
import Link from 'next/link'
import React from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { HeaderCTA } from './Nav/CTA'
import { MobileNav } from './MobileNav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  return (
    // Fixed insets from the viewport edges (left-2/right-2, wider at md),
    // not a centered max-w container — matches fastflowpe.com exactly,
    // confirmed via direct inspection of the live site rather than a
    // screenshot: this bar has no max-width cap, it just keeps a constant
    // gutter on either side at any viewport width. bg-white/70 +
    // backdrop-blur-sm (not solid, not the old heavier blur-xl glass) is a
    // fixed style now — the live site doesn't swap it for a dark variant
    // over hero imagery, it relies on the blur/tint to stay legible over
    // anything behind it, so the old per-page setHeaderTheme('dark'/'light')
    // calls elsewhere are now harmless no-ops rather than something this
    // component reads.
    <header className="fixed top-3 md:top-6 left-2 md:left-8 right-2 md:right-8 z-50 rounded-[10px] bg-white/70 shadow-sm backdrop-blur-sm">
      {/* relative: MobileNav's dropdown panel is `absolute inset-x-0
          top-full` and needs THIS element as its positioned ancestor so it
          spans the full header width, not just whatever narrow element it
          happens to render next to. */}
      <div className="relative flex flex-wrap items-center justify-between pl-4 pr-2 py-4 md:px-4">
        <Link href="/" className="flex items-center shrink-0 space-x-3">
          <Logo loading="eager" priority="high" className="h-8 w-auto md:h-10" />
        </Link>
        <HeaderNav data={data} />
        <HeaderCTA data={data} />
        <MobileNav data={data} />
      </div>
    </header>
  )
}
