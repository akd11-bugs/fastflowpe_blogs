'use client'

import React, { useRef } from 'react'

import type { Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'
import { useParallax } from '@/utilities/useParallax'

/**
 * Small client leaf so the rest of PostHero can stay a Server Component —
 * only the image itself needs the scroll-linked parallax, kept subtle here
 * since this is a reading page, not a landing showcase.
 */
export const ParallaxImage: React.FC<{ resource: MediaType; imgClassName?: string }> = ({
  resource,
  imgClassName,
}) => {
  const imageRef = useRef<HTMLImageElement>(null)
  useParallax(imageRef, 0.08)

  return <Media ref={imageRef} fill priority imgClassName={imgClassName} resource={resource} />
}
