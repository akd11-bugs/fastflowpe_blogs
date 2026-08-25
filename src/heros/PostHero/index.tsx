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
      {/* space-y/margin, not flex `gap` — see the note in Footer/Component.tsx.

          lg:mx-8, not centered: the image and content below (in
          posts/[slug]/page.tsx) are flush-left with lg:mx-8 inside their
          own copy of this same container-wide, not centered — so this
          heading needs the identical margin, not just the identical
          max-width, to actually share their left edge. Two independently
          centered/margined blocks at different widths only look aligned
          by coincidence at one specific viewport. */}
      <div className="mx-auto flex max-w-[48rem] flex-col space-y-6 lg:mx-8">
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
  )
}
