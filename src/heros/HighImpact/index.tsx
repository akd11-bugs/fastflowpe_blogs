'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useState } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { ParallaxScrolling, type ParallaxLayer } from '@/components/ui/parallax-scrolling'
import { cn } from '@/utilities/ui'
import { getMediaUrl } from '@/utilities/getMediaUrl'

import { HeroCanvas } from './HeroCanvas'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()
  const [revealed, setRevealed] = useState(false)

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

  const hasMedia = Boolean(media && typeof media === 'object')

  // Back-to-front. The scrim is a real layer rather than a static overlay so it
  // drifts with the image behind it instead of shearing away from it — a fixed
  // scrim over a moving image is the tell that gives cheap parallax away.
  //
  // Only two visual layers exist because the hero schema has exactly one image
  // field. Osmo's four-layer depth needs four separate cut-out PNGs; see the
  // note in the component for how to supply them.
  const layers: ParallaxLayer[] = hasMedia
    ? [
        {
          yPercent: 55,
          content: (
            <>
              {/* `pictureClassName` positions the <picture> that Media wraps
                  the img in. next/image with `fill` resolves against its
                  immediate parent, and a static <picture> makes it fall through
                  to this layer — which warns and leaves the sizing to luck. */}
              <Media
                fill
                pictureClassName="absolute inset-0"
                imgClassName="object-cover"
                priority
                resource={media!}
              />
              {/* The canvas is opaque and covers the image completely, so it has
                  to travel in the SAME layer — left outside, it would keep its
                  own slower parallax and hide the image's entirely. Its internal
                  useParallax is switched off for that reason. */}
              {media && typeof media === 'object' && media.width && media.height && (
                <HeroCanvas
                  textureUrl={getMediaUrl(media.url, media.updatedAt)}
                  imageAspect={media.width / media.height}
                  parallaxFactor={0}
                />
              )}
            </>
          ),
        },
        {
          yPercent: 22,
          content: (
            <div className="h-full w-full bg-gradient-to-b from-black/45 via-black/25 to-black/60" />
          ),
        },
      ]
    : []

  const copy = (
    <div className="container relative z-20 flex items-center justify-center">
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
  )

  // Without media there is nothing to parallax, and the old markup forced dark
  // styling regardless — which put white copy on a light ground at ~1.5:1.
  if (!hasMedia) {
    return (
      <div className="relative -mt-16 flex min-h-[80vh] items-center justify-center">{copy}</div>
    )
  }

  return (
    <div className="relative -mt-16 flex items-center justify-center text-white" data-theme="dark">
      <ParallaxScrolling
        layers={layers}
        heightClassName="min-h-[80vh] w-full"
        className="flex items-center justify-center"
      >
        {copy}
      </ParallaxScrolling>
    </div>
  )
}
