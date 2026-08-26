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
    // not a centered max-w container — fastflowpe.com's own header has no
    // max-width cap, just a constant gutter at any viewport width. The
    // bg-white/70 + backdrop-blur-sm tint stays legible over any hero
    // behind it, so this no longer needs to swap to a dark variant —
    // setHeaderTheme('dark'/'light') calls elsewhere are harmless no-ops.
    <header className="fixed top-3 md:top-6 left-2 md:left-8 right-2 md:right-8 z-50 rounded-[10px] bg-white/70 shadow-sm backdrop-blur-sm">
      {/* relative: MobileNav's dropdown panel is `absolute inset-x-0
          top-full` and needs this as its positioned ancestor to span the
          full header width. */}
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
