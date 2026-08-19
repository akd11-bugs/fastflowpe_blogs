'use client'

import { usePathname } from 'next/navigation'
import React from 'react'
import { ViewTransition } from 'react'

/**
 * Wraps route content (not the layout itself — layouts persist across
 * navigations, so mount/unmount-driven enter/exit never fires there) in a
 * single ViewTransition keyed by pathname. A pathname change gives the
 * wrapper a new React key, so React treats the old content as exiting and
 * the new content as entering — the same mechanism the View Transitions
 * guide uses for same-route crossfades, generalized here to real route
 * changes. Header/Footer are siblings outside this boundary in the root
 * layout, so they never participate in the transition.
 */
export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname()

  return (
    <ViewTransition key={pathname} enter="page-enter" exit="page-exit">
      {children}
    </ViewTransition>
  )
}
