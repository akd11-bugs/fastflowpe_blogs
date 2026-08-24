'use client'

import Lenis from 'lenis'
import { usePathname } from 'next/navigation'
import React, { createContext, useContext, useEffect, useState } from 'react'

// Single-post article pages (e.g. /posts/my-post) are read, not browsed —
// smooth-scroll hijacking interferes with find-in-page, screen readers, and
// text selection, so those routes deliberately keep native scrolling. The
// /posts listing itself is fine, since it's a browsing/discovery surface.
const isReadingRoute = (pathname: string) => /^\/posts\/[^/]+$/.test(pathname)

/**
 * The app's one and only Lenis instance, or null where smooth scroll is
 * deliberately off (article routes, reduced motion, coarse pointers).
 *
 * Exposed because scroll-linked animation libraries need to be driven by
 * whatever owns the scroll position. GSAP ScrollTrigger in particular reads
 * native scroll by default, which drifts against Lenis's interpolated
 * position — so it has to be ticked from Lenis instead. The alternative that
 * every copy-pasted GSAP snippet reaches for is `new Lenis()` inside the
 * component, which silently creates a SECOND instance; two of them both
 * hijacking window scroll fight for it and the page becomes unscrollable.
 * Consumers must read this instead of constructing their own.
 */
const LenisContext = createContext<Lenis | null>(null)

export const useLenis = () => useContext(LenisContext)

export const SmoothScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname()
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (isReadingRoute(pathname)) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches
    if (prefersReducedMotion || isCoarsePointer) return

    const instance = new Lenis()
    let rafId: number

    const raf = (time: number) => {
      instance.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)
    setLenis(instance)

    return () => {
      cancelAnimationFrame(rafId)
      instance.destroy()
      // Consumers hold this in a ref/effect dependency; leaving a destroyed
      // instance in context would let them tick a dead object on the next route.
      setLenis(null)
    }
  }, [pathname])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
