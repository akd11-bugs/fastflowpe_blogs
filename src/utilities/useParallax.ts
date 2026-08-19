'use client'

import { useEffect } from 'react'

/**
 * Applies a scroll-linked translateY directly to the given element (a hero
 * image, typically) — deliberately NOT a wrapping div, because hero images
 * render via next/image's `fill` prop, which positions itself absolutely
 * against the nearest non-static ancestor. Introducing a new `relative`- or
 * `transform`-bearing wrapper between the image and that ancestor would
 * become the image's new containing block and break its sizing (this hero
 * layout intentionally relies on the image escaping to an ancestor several
 * levels up — see HighImpact/PostHero). Animating `transform` on the image
 * element itself sidesteps that entirely: transform never changes how an
 * element's own position/size is resolved, only how it's painted.
 */
export function useParallax(ref: React.RefObject<HTMLElement | null>, factor = 0.15) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    let rafId: number | null = null

    const update = () => {
      rafId = null
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      // Only animate while the element is anywhere near the viewport.
      if (rect.bottom < 0 || rect.top > window.innerHeight) return
      // rect.top goes more negative as the page scrolls past this element.
      // Counteracting a fraction of that (positive shift) makes the image
      // lag behind the normal scroll speed instead of matching it exactly.
      el.style.transform = `translate3d(0, ${-rect.top * factor}px, 0)`
    }

    const onScroll = () => {
      if (rafId === null) rafId = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update()

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [ref, factor])
}
