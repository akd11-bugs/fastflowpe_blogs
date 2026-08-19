import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Post } from '@/payload-types'

import { formatAuthors } from '@/utilities/formatAuthors'
import { stringToColor } from '@/utilities/stringToColor'
import { cn } from '@/utilities/ui'

import { ParallaxImage } from './ParallaxImage'

export const PostHero: React.FC<{
  post: Post
  readingTime?: number
}> = ({ post, readingTime }) => {
  const { categories, heroImage, populatedAuthors, publishedAt, title } = post

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  return (
    <div className="relative -mt-16 flex items-end">
      <div className="container z-10 relative lg:grid lg:grid-cols-[1fr_48rem_1fr] text-white pb-8">
        <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2">
          <div
            className="flex flex-wrap gap-2 mb-6 reveal-up"
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
                    'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
                    color.bg,
                    color.text,
                  )}
                >
                  {categoryTitle}
                </span>
              )
            })}
          </div>

          <div className="reveal-up" style={{ '--stagger-index': 1 } as React.CSSProperties}>
            <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl">{title}</h1>
          </div>

          <div
            className="flex flex-col md:flex-row gap-4 md:gap-16 reveal-up"
            style={{ '--stagger-index': 2 } as React.CSSProperties}
          >
            {hasAuthors && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-sm">Author</p>

                  <p>{formatAuthors(populatedAuthors)}</p>
                </div>
              </div>
            )}
            {publishedAt && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">Date Published</p>

                <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
              </div>
            )}
            {readingTime && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">Reading Time</p>

                <p>{readingTime} min read</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="min-h-[80vh] select-none">
        {heroImage && typeof heroImage === 'object' && (
          <ParallaxImage
            imgClassName="-z-10 object-cover hero-image-reveal"
            resource={heroImage}
          />
        )}
        <div className="absolute pointer-events-none left-0 bottom-0 w-full h-1/2 bg-linear-to-t from-black to-transparent" />
      </div>
    </div>
  )
}
