import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Post } from '@/payload-types'

import { formatAuthors } from '@/utilities/formatAuthors'
import { stringToColor } from '@/utilities/stringToColor'
import { cn } from '@/utilities/ui'

/**
 * Heading only — categories, title, byline/date/reading-time. The hero
 * image used to render here too, but it needs to live inside the same CSS
 * grid as the article content and sidebar (see posts/[slug]/page.tsx) so
 * the grid itself guarantees matching widths at every viewport, rather
 * than three independently-tuned max-width values drifting out of sync.
 */
export const PostHero: React.FC<{
  post: Post
  readingTime?: number
}> = ({ post, readingTime }) => {
  const { categories, populatedAuthors, publishedAt, title } = post

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  return (
    <div className="container-wide">
      {/* Mirrors the grid in posts/[slug]/page.tsx exactly (same
          lg:max-w-[96rem] lg:mx-auto lg:grid-cols-[1fr_320px]) so column 1
          resolves to the identical left edge and width in both places —
          the heading sits in that same column instead of being centered
          independently at its own max-width, which only lined up with the
          image/content by coincidence at one specific viewport. */}
      <div className="lg:grid lg:max-w-[96rem] lg:mx-auto lg:grid-cols-[1fr_320px] lg:gap-16">
        <div className="mx-auto flex max-w-[48rem] flex-col space-y-6 lg:col-start-1 lg:mx-0 lg:max-w-none">
          <div
            className="flex flex-wrap reveal-up"
            style={{ '--stagger-index': 0 } as React.CSSProperties}
          >
            {categories?.map((category, index) => {
              if (typeof category !== 'object' || category === null) return null

              const categoryTitle = category.title || 'Untitled category'
              const color = stringToColor(categoryTitle)

              return (
                <span
                  key={index}
                  className={cn(
                    'mr-2 mb-2 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
                    color.bg,
                    color.text,
                  )}
                >
                  {categoryTitle}
                </span>
              )
            })}
          </div>

          <h1
            className={cn(
              'text-3xl font-bold tracking-tight md:text-5xl reveal-up',
            )}
            style={{ '--stagger-index': 1 } as React.CSSProperties}
          >
            {title}
          </h1>

          <div
            className="flex flex-col space-y-3 text-sm text-muted-foreground reveal-up md:flex-row md:items-center md:space-y-0 md:space-x-6"
            style={{ '--stagger-index': 2 } as React.CSSProperties}
          >
            {hasAuthors && <span className="font-medium text-foreground">{formatAuthors(populatedAuthors)}</span>}
            {publishedAt && <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>}
            {readingTime && <span>{readingTime} min read</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
