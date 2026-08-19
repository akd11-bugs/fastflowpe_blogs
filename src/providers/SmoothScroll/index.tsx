'use client'

import Lenis from 'lenis'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

// Single-post article pages (e.g. /posts/my-post) are read, not browsed —
// smooth-scroll hijacking interferes with find-in-page, screen readers, and
// text selection, so those routes deliberately keep native scrolling. The
// /posts listing itself is fine, since it's a browsing/discovery surface.
const isReadingRoute = (pathname: string) => /^\/posts\/[^/]+$/.test(pathname)

export const SmoothScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname()

  useEffect(() => {
    if (isReadingRoute(pathname)) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches
    if (prefersReducedMotion || isCoarsePointer) return

    const lenis = new Lenis()
    let rafId: number

    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [pathname])

  return <>{children}</>
}
