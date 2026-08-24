import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Post } from '@/payload-types'

import { formatAuthors } from '@/utilities/formatAuthors'
import { stringToColor } from '@/utilities/stringToColor'
import { cn } from '@/utilities/ui'

import { ParallaxImage } from './ParallaxImage'

/**
 * Heading, then image, then (from the page template) body content — a plain
 * editorial layout rather than the previous full-bleed hero with the title
 * overlaid on the image. That overlay treatment needed a dark gradient scrim
 * for the white text to read, which this layout has no use for: the title
 * is now ordinary page text, so it just uses the page's own foreground colour.
 */
export const PostHero: React.FC<{
  post: Post
  readingTime?: number
}> = ({ post, readingTime }) => {
  const { categories, heroImage, populatedAuthors, publishedAt, title } = post

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  return (
    <div className="container">
      {/* space-y/margin, not flex `gap` — see the note in Footer/Component.tsx. */}
      <div className="mx-auto flex max-w-[48rem] flex-col space-y-6">
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

      {heroImage && typeof heroImage === 'object' && (
        <div className="relative mx-auto mt-10 aspect-[21/9] w-full max-w-[64rem] overflow-hidden rounded-2xl">
          <ParallaxImage imgClassName="object-cover" resource={heroImage} />
        </div>
      )}
    </div>
  )
}
