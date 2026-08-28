import Link from 'next/link'
import React from 'react'

import type { FeaturedPostsBlock as FeaturedPostsBlockProps, Post } from '@/payload-types'

import { Card } from '@/components/Card'
import { Media } from '@/components/Media'

/**
 * The page's H1 (always renders — see config.ts) plus the homepage's
 * "hero": admin-picked posts, not auto-selected. The first pick renders
 * large in a wider left column (`Card size="featured"`, a gentle 3:2 crop —
 * cropped enough to fill the frame cleanly, not so tight it reads as
 * square-forced). The rest stack in a narrower right column, image on top
 * and the date/title below it — not side-by-side — matching an editorial
 * "story card" list rather than a compact row.
 */
export const FeaturedPostsBlock: React.FC<FeaturedPostsBlockProps> = ({ subheading, posts }) => {
  const validPosts = (posts || []).filter(
    (post): post is Post => typeof post === 'object' && post !== null,
  )

  const [featured, ...secondary] = validPosts

  return (
    <div className="flex flex-col gap-10">
      <div className="container">
        <p className="mb-2 text-sm font-semibold text-muted-foreground">Blog</p>
        <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          FastFlowPe <span className="text-[#028DD0]">Insights</span>: Smarter Payments for
          Growing Indian Businesses
        </h1>
        {subheading && (
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{subheading}</p>
        )}
      </div>

      {featured && (
        <div className="container mt-4">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[3fr_2fr]">
            <Card doc={featured} relationTo="posts" showCategories size="featured" />

            {secondary.length > 0 && (
              <div className="flex flex-col gap-8">
                {secondary.map((post, i) => (
                  <SecondaryPostRow key={i} post={post} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const SecondaryPostRow: React.FC<{ post: Post }> = ({ post }) => {
  const { slug, categories, title, heroImage, meta } = post
  const imageToUse = heroImage || meta?.image
  const validCategories = (categories || []).filter(
    (category): category is Exclude<typeof category, number> =>
      typeof category === 'object' && category !== null,
  )
  const categoryTitle = validCategories[0]?.title

  return (
    <Link href={`/posts/${slug}`} className="group flex flex-col">
      {/* TechCrunch-style overlaid heading — category+title sit directly
          on the photo (dark gradient scrim for legibility) instead of
          below it. */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-border bg-muted p-px">
        {imageToUse && typeof imageToUse !== 'string' && (
          <Media fill resource={imageToUse} size="33vw" imgClassName="object-cover object-top" />
        )}
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-white/95 via-white/60 to-transparent dark:from-black/90 dark:via-black/50 dark:to-transparent p-4 pt-10">
          {categoryTitle && (
            <div className="flex flex-wrap">
              <span className="inline-flex items-center rounded-full bg-white/85 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#028DD0] backdrop-blur-md border border-white/30 shadow-xs dark:bg-white/20">
                {categoryTitle}
              </span>
            </div>
          )}
          <h3 className="font-bold leading-snug line-clamp-2 text-black dark:text-white transition-colors group-hover:text-black/80 dark:group-hover:text-white/80">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  )
}
