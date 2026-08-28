'use client'
import { cn } from '@/utilities/ui'
import { stringToColor } from '@/utilities/stringToColor'
import { formatDateTime } from '@/utilities/formatDateTime'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'

export type CardPostData = Pick<
  Post,
  'slug' | 'categories' | 'meta' | 'title' | 'heroImage' | 'publishedAt' | 'populatedAuthors'
> & {
  readingTime?: number
}

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
  /** 'featured' gives a bigger image, headline, and excerpt — for a bento
   *  grid's lead tile, which otherwise gets a stretched default card with a
   *  fixed-aspect image and a lot of dead space below a two-line excerpt. */
  size?: 'default' | 'featured'
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps, size = 'default' } = props
  const featured = size === 'featured'

  const {
    slug,
    categories,
    meta,
    title,
    heroImage,
    publishedAt,
    populatedAuthors,
    readingTime,
  } = doc || {}
  const { description, image: metaImage } = meta || {}

  const imageToUse = heroImage || metaImage

  const validCategories = (categories || []).filter(
    (category): category is Exclude<typeof category, number> =>
      typeof category === 'object' && category !== null,
  )
  const hasCategories = showCategories && validCategories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`

  const authorName = populatedAuthors?.map((author) => author?.name).filter(Boolean)[0]
  const avatarColor = stringToColor(authorName || titleToUse || 'post')

  return (
    <article
      className={cn(
        'group relative h-full flex flex-col rounded-2xl overflow-hidden bg-background cursor-pointer transition-all duration-300',
        !featured && 'hover:shadow-xl hover:-translate-y-1',
        className,
      )}
      ref={card.ref}
    >
      <div
        className={cn(
          'relative w-full overflow-hidden bg-muted',
          featured ? 'aspect-[3/2] rounded-2xl border border-border p-px' : 'aspect-[16/10]',
        )}
      >
        {!imageToUse && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-secondary text-muted-foreground text-sm">
            No image
          </div>
        )}
        {imageToUse && typeof imageToUse !== 'string' && (
          <Media
            fill
            resource={imageToUse}
            size={featured ? '66vw' : '33vw'}
            imgClassName="object-cover"
          />
        )}

        {/* TechCrunch-style overlaid heading — the featured card's
            category+title sit directly on the photo (dark gradient scrim
            for legibility) instead of below it in the white body. */}
        {featured && (hasCategories || titleToUse) && (
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t from-white/95 via-white/60 to-transparent dark:from-black/90 dark:via-black/50 dark:to-transparent p-6 pt-16 md:p-8 md:pt-20">
            {hasCategories && (
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {validCategories.map((category, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-white/85 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#028DD0] backdrop-blur-md border border-white/30 shadow-xs dark:bg-white/20"
                  >
                    {category.title || 'Untitled category'}
                  </span>
                ))}
              </div>
            )}

            {titleToUse && (
              <h3 className="font-bold leading-snug line-clamp-2 tracking-tight text-2xl md:text-3xl text-black dark:text-white">
                <Link className="not-prose transition-colors" href={href} ref={link.ref}>
                  {titleToUse}
                </Link>
              </h3>
            )}
          </div>
        )}
      </div>
      {/* space-y/margin, not flex `gap` — see the note in Footer/Component.tsx. */}
      <div className={cn('flex flex-col space-y-3 flex-1', featured ? 'p-6 md:p-8' : 'p-5 pt-6')}>
        {!featured && hasCategories && (
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {validCategories.map((category, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#028DD0] backdrop-blur-md border border-border/60 shadow-xs dark:bg-white/10"
              >
                {category.title || 'Untitled category'}
              </span>
            ))}
          </div>
        )}

        {!featured && titleToUse && (
          <h3 className="font-bold leading-snug line-clamp-2 tracking-tight text-xl">
            <Link className="not-prose text-foreground transition-colors" href={href} ref={link.ref}>
              {titleToUse}
            </Link>
          </h3>
        )}

        {!featured && description && (
          <p
            className={cn(
              'text-muted-foreground',
              featured ? 'text-base line-clamp-3' : 'text-sm line-clamp-2',
            )}
          >
            {sanitizedDescription}
          </p>
        )}

        <div className="flex items-center space-x-2 pt-2 mt-auto text-xs text-muted-foreground">
          {featured && authorName && (
            <div
              className={cn(
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold uppercase',
                avatarColor.bg,
                avatarColor.text,
              )}
            >
              {authorName.charAt(0)}
            </div>
          )}
          {featured && authorName && <span className="font-medium text-foreground">{authorName}</span>}
          {featured && authorName && (publishedAt || readingTime) && <span aria-hidden>&middot;</span>}
          {publishedAt && <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>}
          {publishedAt && readingTime && <span aria-hidden>&middot;</span>}
          {readingTime && <span>{readingTime} min read</span>}
        </div>
      </div>
    </article>
  )
}
