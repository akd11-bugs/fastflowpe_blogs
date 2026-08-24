'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect } from 'react'

import { useLenis } from '@/providers/SmoothScroll'

/**
 * The single bridge between Lenis and GSAP ScrollTrigger.
 *
 * ScrollTrigger samples scroll position on its own schedule; Lenis animates an
 * interpolated position. Without forwarding Lenis's scroll events, triggers
 * fire against a stale position and scroll-linked animation visibly lags.
 *
 * What this deliberately does NOT do is drive Lenis. `SmoothScrollProvider`
 * already owns the instance and ticks it from its own rAF loop, so the
 * `gsap.ticker.add((t) => lenis.raf(t * 1000))` line that every Lenis+GSAP
 * snippet includes would make a second driver — feeding Lenis gsap.ticker's
 * time origin interleaved with the provider's rAF timestamps — and every
 * further GSAP consumer on the page would add another.
 *
 * `gsap.ticker.lagSmoothing()` is skipped for the same reason: it is global
 * state, and per-consumer set/restore means whichever component unmounts first
 * clobbers the setting the others still rely on. It only matters when the
 * ticker drives Lenis, which here it does not.
 *
 * Consumers use this hook instead of wiring their own bridge, so there is
 * exactly one subscription pattern no matter how many scroll-linked components
 * a page mounts.
 */
export function useScrollTriggerLenis(): void {
  const lenis = useLenis()

  useEffect(() => {
    // No Lenis on this route (article pages, reduced motion, coarse pointers).
    // ScrollTrigger then reads native scroll, which needs no bridge at all.
    if (!lenis) return

    gsap.registerPlugin(ScrollTrigger)

    const onScroll = () => ScrollTrigger.update()
    lenis.on('scroll', onScroll)

    // Lenis takes over scrolling after mount, which can change measurable
    // scroll height; re-measure so pinned/scrubbed triggers start correct.
    ScrollTrigger.refresh()

    return () => {
      lenis.off('scroll', onScroll)
    }
  }, [lenis])
}
