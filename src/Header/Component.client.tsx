'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header
      className="fixed top-3 md:top-4 inset-x-0 z-50 flex justify-center px-4"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      {/* Solid card, not the previous frosted-glass pill: w-full (capped by
          max-w) so nav items and the Login/Sign Up buttons can spread to
          the far edges, matching the reference layout, instead of a
          content-hugging floating pill. Margin, not flex `gap` — see the
          note in Footer/Component.tsx. */}
      <div className="flex w-full max-w-6xl items-center rounded-2xl border border-border bg-background px-6 py-3 shadow-lg shadow-black/5">
        <Link href="/" className="flex items-center shrink-0 mr-8">
          <Logo loading="eager" priority="high" className="block h-7 w-auto" />
        </Link>
        <HeaderNav data={data} />
      </div>
    </header>
  )
}
