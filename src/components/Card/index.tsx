'use client'
import { cn } from '@/utilities/ui'
import { stringToColor } from '@/utilities/stringToColor'
import { stringToIcon } from '@/utilities/stringToIcon'
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

  const primaryCategoryTitle = validCategories[0]?.title || undefined
  const accentColor = stringToColor(primaryCategoryTitle || titleToUse || 'post')

  return (
    <article
      className={cn(
        'group relative h-full flex flex-col border-2 border-border rounded-2xl overflow-hidden bg-card hover:cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300',
        accentColor.accentBorder,
        className,
      )}
      ref={card.ref}
    >
      {/* Bold color-block reveal — a solid accent bar grows in on hover instead of
          a subtle fade, matching brand.dropbox.com's graphic/immediate hover language. */}
      <div
        className={cn(
          'absolute inset-x-0 top-0 h-0 group-hover:h-2 transition-[height] duration-300 ease-out z-10',
          accentColor.solidBg,
        )}
      />

      <div
        className={cn(
          'relative w-full overflow-hidden bg-muted',
          featured ? 'aspect-[16/9]' : 'aspect-[16/10]',
        )}
      >
        {!imageToUse && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-secondary text-muted-foreground text-sm">
            No image
          </div>
        )}
        {imageToUse && typeof imageToUse !== 'string' && (
          <Media
            resource={imageToUse}
            size={featured ? '66vw' : '33vw'}
            imgClassName="object-cover w-full h-full"
          />
        )}
      </div>
      <div className={cn('flex flex-col gap-3 flex-1', featured ? 'p-6 md:p-8' : 'p-5')}>
        {hasCategories && (
          <div className="flex flex-wrap gap-2">
            {validCategories.map((category, index) => {
              const categoryTitle = category.title || 'Untitled category'
              const color = stringToColor(categoryTitle)
              const Icon = stringToIcon(categoryTitle)

              return (
                <span
                  key={index}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide',
                    color.solidBg,
                    color.solidText,
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {categoryTitle}
                </span>
              )
            })}
          </div>
        )}

        {titleToUse && (
          <h3
            className={cn(
              'font-bold leading-snug line-clamp-2 tracking-tight',
              featured ? 'text-2xl md:text-3xl' : 'text-xl',
            )}
          >
            <Link className="not-prose text-foreground transition-colors" href={href} ref={link.ref}>
              {titleToUse}
            </Link>
          </h3>
        )}

        {description && (
          <p
            className={cn(
              'text-muted-foreground',
              featured ? 'text-base line-clamp-3' : 'text-sm line-clamp-2',
            )}
          >
            {sanitizedDescription}
          </p>
        )}

        <div className="flex items-center gap-2 pt-2 mt-auto border-t border-border text-xs text-muted-foreground">
          {authorName && (
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
          {authorName && <span className="font-medium text-foreground">{authorName}</span>}
          {authorName && (publishedAt || readingTime) && <span aria-hidden>&middot;</span>}
          {publishedAt && <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>}
          {publishedAt && readingTime && <span aria-hidden>&middot;</span>}
          {readingTime && <span>{readingTime} min read</span>}
        </div>
      </div>
    </article>
  )
}
