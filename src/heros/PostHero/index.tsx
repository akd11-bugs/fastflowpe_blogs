import React from 'react'

import type { Post } from '@/payload-types'

import { ShareLinks } from '@/components/ShareLinks'
import { cn } from '@/utilities/ui'

/**
 * Heading only — categories, title, and share links. The byline/date/
 * reading-time used to render here too, but it now sits under the hero
 * image instead (see posts/[slug]/page.tsx), so it renders after the image
 * in document order. The hero image itself lives in the same CSS grid as
 * the article content and sidebar (see posts/[slug]/page.tsx) so the grid
 * itself guarantees matching widths at every viewport, rather than three
 * independently-tuned max-width values drifting out of sync.
 */
export const PostHero: React.FC<{
  post: Post
  url: string
}> = ({ post, url }) => {
  const { categories, title } = post

  return (
    <div className="container-wide">
      {/* Mirrors the grid in posts/[slug]/page.tsx exactly (same
          lg:ml-[168px] lg:mr-[168px] lg:grid-cols-[1fr_320px]) so column 1
          resolves to the identical left edge and width in both places —
          the heading sits in that same column instead of being centered
          independently at its own max-width, which only lined up with the
          image/content by coincidence at one specific viewport. Equal
          left/right margins so the content's left inset matches the
          sidebar's right inset. */}
      <div className="lg:grid lg:ml-[168px] lg:mr-[168px] lg:grid-cols-[1fr_320px] lg:gap-16">
        <div className="mx-auto flex max-w-[48rem] flex-col space-y-6 lg:col-start-1 lg:mx-0 lg:w-[calc(100%+9rem)] lg:max-w-[calc(100%+9rem)]">
          <div
            className="flex flex-wrap gap-x-3 gap-y-1 reveal-up"
            style={{ '--stagger-index': 0 } as React.CSSProperties}
          >
            {categories?.map((category, index) => {
              if (typeof category !== 'object' || category === null) return null

              const categoryTitle = category.title || 'Untitled category'

              return (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#028DD0] backdrop-blur-md border border-black/5 shadow-xs dark:bg-white/20 dark:border-white/10"
                >
                  {categoryTitle}
                </span>
              )
            })}
          </div>

          <h1
            className={cn(
              'text-3xl font-bold tracking-tight md:text-4xl lg:text-[2.5rem] leading-tight md:leading-tight reveal-up',
            )}
            style={{ '--stagger-index': 1 } as React.CSSProperties}
          >
            {title}
          </h1>

          <div className="reveal-up" style={{ '--stagger-index': 2 } as React.CSSProperties}>
            <ShareLinks url={url} title={title} />
          </div>
        </div>
      </div>
    </div>
  )
}
