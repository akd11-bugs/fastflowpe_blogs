'use client'

import dynamic from 'next/dynamic'
import React, { useEffect, useRef, useState } from 'react'

import { useParallax } from '@/utilities/useParallax'
import { canUseMotionEffects } from '@/utilities/canUseMotionEffects'

const HeroScene = dynamic(
  () => import('@/components/webgl/HeroScene').then((mod) => mod.HeroScene),
  { ssr: false },
)

/**
 * Layers a cursor-reactive WebGL plane on top of the hero's static <Media>
 * image (rendered by the caller, which stays the actual LCP element and the
 * only thing SSR'd). This mounts client-side only, after hydration, and is
 * skipped entirely on touch devices or when the user prefers reduced motion
 * — the static image underneath is the fallback in both cases, not a
 * loading state.
 *
 * This canvas fully (and opaquely) covers the underlying <Media> image, so
 * it needs its own copy of the same parallax motion (matching the factor
 * applied to the image in HighImpactHero) — otherwise the image parallaxes
 * invisibly underneath a canvas that never moves.
 */
export const HeroCanvas: React.FC<{
  textureUrl: string
  imageAspect: number
  parallaxFactor?: number
}> = ({ textureUrl, imageAspect, parallaxFactor = 0.15 }) => {
  const [shouldRender, setShouldRender] = useState(false)
  const [inView, setInView] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  useParallax(containerRef, parallaxFactor)

  useEffect(() => {
    if (canUseMotionEffects()) setShouldRender(true)
  }, [])

  useEffect(() => {
    if (!shouldRender || !containerRef.current) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0,
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [shouldRender])

  if (!shouldRender) return null

  return (
    <div ref={containerRef} className="absolute inset-0" aria-hidden="true">
      {inView && <HeroScene textureUrl={textureUrl} imageAspect={imageAspect} />}
    </div>
  )
}
