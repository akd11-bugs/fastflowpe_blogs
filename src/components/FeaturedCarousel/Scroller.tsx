'use client'

import React from 'react'

import { Card, type CardPostData } from '@/components/Card'

/**
 * Continuously auto-scrolling marquee, not a manually-paged carousel — the
 * post list renders twice back-to-back so the CSS animation (`.animate-marquee`,
 * globals.css) can loop seamlessly at -50% translateX. Pauses on hover/focus
 * so a visitor can actually read or click a card; respects
 * prefers-reduced-motion via the same class (see globals.css).
 */
export const FeaturedCarouselScroller: React.FC<{ posts: CardPostData[] }> = ({ posts }) => {
  const looped = [...posts, ...posts]

  return (
    <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_2rem,black_calc(100%-2rem),transparent)]">
      <div className="flex w-max gap-6 px-4 animate-marquee hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
        {looped.map((post, index) => (
          <div key={index} className="w-[85vw] shrink-0 sm:w-[26rem]">
            <Card className="h-full" doc={post} relationTo="posts" showCategories />
          </div>
        ))}
      </div>
    </div>
  )
}
