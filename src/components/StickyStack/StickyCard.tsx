'use client'

import React, { useEffect, useRef, useState } from 'react'

import { cn } from '@/utilities/ui'

/**
 * Wraps one item in a sticky-stacking sequence (used by both
 * src/blocks/ProcessSteps and src/blocks/FeatureSlides). A 1px sentinel
 * sits immediately before the sticky element in normal flow; once that
 * sentinel scrolls above the viewport, the element below it must have
 * caught its pinned position, so we flag it "active." Same sentinel +
 * IntersectionObserver technique already used by
 * src/components/ScrollReveal, applied here to detect *stuck* state
 * rather than *in-view* state. Active state is exposed via a render-prop
 * (so the item can swap its own styling) and reported up via
 * onActiveChange (so a parent tracker/counter can show which item is
 * current).
 */
export const StickyCard: React.FC<{
  children: (isActive: boolean) => React.ReactNode
  onActiveChange?: (isActive: boolean) => void
  /** Tailwind sticky-offset classes, e.g. "lg:sticky lg:top-32". */
  stickyClassName?: string
}> = ({ children, onActiveChange, stickyClassName = 'lg:sticky lg:top-32' }) => {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const active = !entry.isIntersecting && entry.boundingClientRect.top < 0
        setIsActive(active)
        onActiveChange?.(active)
      },
      { threshold: 0 },
    )
    observer.observe(el)

    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div ref={sentinelRef} className="h-px" aria-hidden="true" />
      <div className={cn(stickyClassName)}>{children(isActive)}</div>
    </>
  )
}
