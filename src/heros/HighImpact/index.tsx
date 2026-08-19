'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useRef, useState } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { useParallax } from '@/utilities/useParallax'

import { HeroCanvas } from './HeroCanvas'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()
  const [revealed, setRevealed] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  useParallax(imageRef, 0.15)

  useEffect(() => {
    setHeaderTheme('dark')
  })

  useEffect(() => {
    // Flip to the visible state on the next frame rather than immediately —
    // starting and ending in the same state within one render would skip
    // the CSS transition entirely.
    const frame = requestAnimationFrame(() => setRevealed(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div
      className="relative -mt-16 flex items-center justify-center text-white"
      data-theme="dark"
    >
      <div className="container mb-8 z-10 relative flex items-center justify-center">
        <div className="max-w-[36.5rem] md:text-center">
          {richText && (
            <div
              className={cn('stagger-item', revealed && 'stagger-visible')}
              style={{ '--stagger-index': 0 } as React.CSSProperties}
            >
              <RichText className="mb-6" data={richText} enableGutter={false} />
            </div>
          )}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex md:justify-center gap-4">
              {links.map(({ link }, i) => {
                return (
                  <li
                    key={i}
                    className={cn('stagger-item', revealed && 'stagger-visible')}
                    style={{ '--stagger-index': i + 1 } as React.CSSProperties}
                  >
                    <CMSLink {...link} />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
      <div className="min-h-[80vh] select-none">
        {media && typeof media === 'object' && (
          <>
            <Media ref={imageRef} fill imgClassName="-z-10 object-cover" priority resource={media} />
            {media.width && media.height && (
              <HeroCanvas
                textureUrl={getMediaUrl(media.url, media.updatedAt)}
                imageAspect={media.width / media.height}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
