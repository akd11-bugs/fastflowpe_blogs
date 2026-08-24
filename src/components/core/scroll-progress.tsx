'use client'

import { motion, useReducedMotion, useScroll, useSpring, type SpringOptions } from 'motion/react'
import React from 'react'

import { cn } from '@/utilities/ui'

/**
 * A scroll-linked progress bar.
 *
 * Deliberately driven by `scaleX` on a motion value rather than a `width`
 * percentage in React state. The state approach re-renders the whole subtree on
 * every scroll event and animates a layout-triggering property; this one writes
 * a transform straight to the compositor and never re-renders at all.
 *
 * Omit `containerRef` to track the document (the normal case for an article).
 * Pass it to track an inner scrolling element instead.
 */
type ScrollProgressProps = {
  className?: string
  springOptions?: SpringOptions
  containerRef?: React.RefObject<HTMLElement | null>
}

const DEFAULT_SPRING_OPTIONS: SpringOptions = {
  stiffness: 200,
  damping: 50,
  restDelta: 0.001,
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({
  className,
  springOptions,
  containerRef,
}) => {
  // The snippet this came from also passed `layoutEffect`. That option was
  // removed from UseScrollOptions in motion v13 — measurement timing is handled
  // internally now — so passing it is a type error, not a no-op.
  const { scrollYProgress } = useScroll({ container: containerRef })

  const smoothed = useSpring(scrollYProgress, { ...DEFAULT_SPRING_OPTIONS, ...springOptions })

  // The bar reports position, so it stays — but the spring's easing is motion
  // for its own sake. Reduced motion gets the same bar, tracking scroll exactly.
  const prefersReducedMotion = useReducedMotion()
  const scaleX = prefersReducedMotion ? scrollYProgress : smoothed

  return (
    <motion.div className={cn('inset-x-0 top-0 h-1 origin-left', className)} style={{ scaleX }} />
  )
}
