'use client'

import React, { useEffect, useRef, useState } from 'react'

/**
 * Slides + fades its children into place the first time they scroll into
 * the viewport (a classic AOS/ScrollTrigger-style reveal) — one-shot, so it
 * doesn't re-hide/re-trigger if the user scrolls back up past it. Disabled
 * entirely under prefers-reduced-motion, in which case children render
 * already visible.
 */
export const ScrollReveal: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setVisible(true)
      return
    }

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(el)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${visible ? 'is-visible' : ''} ${className || ''}`.trim()}
    >
      {children}
    </div>
  )
}
