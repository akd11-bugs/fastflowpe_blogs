'use client'

import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'

import { canUseMotionEffects } from '@/utilities/canUseMotionEffects'

const HeroScene = dynamic(() => import('./HeroScene').then((mod) => mod.HeroScene), {
  ssr: false,
})

/**
 * Mounts the shader-driven wiggle plane only while actually hovered, and
 * unmounts on mouse-leave. WebGL contexts are a scarce browser resource
 * (~16 concurrent max) — a listing page can have a dozen+ cards, so keeping
 * every card's canvas mounted at once (even just "in viewport") risks
 * exhausting that budget. Hover-only mount keeps at most a couple of
 * canvases alive at any moment.
 */
export const HoverWiggle: React.FC<{
  textureUrl: string
  imageAspect: number
}> = ({ textureUrl, imageAspect }) => {
  const [capable, setCapable] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    setCapable(canUseMotionEffects())
  }, [])

  if (!capable) return null

  return (
    <div
      className="absolute inset-0 z-10"
      aria-hidden="true"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && <HeroScene textureUrl={textureUrl} imageAspect={imageAspect} />}
    </div>
  )
}
