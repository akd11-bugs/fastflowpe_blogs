import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'

import type { CardPostData } from '@/components/Card'
import { getReadingTime } from '@/utilities/getReadingTime'
import { FeaturedCarouselScroller } from './Scroller'

export const FeaturedCarousel: React.FC = async () => {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 6,
    sort: '-publishedAt',
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
      heroImage: true,
      publishedAt: true,
      populatedAuthors: true,
      content: true,
    },
  })

  if (posts.docs.length === 0) return null

  const cardDocs: CardPostData[] = posts.docs.map((post) => {
    const { content, ...rest } = post
    return {
      ...rest,
      readingTime: getReadingTime(content),
    }
  })

  return (
    <div className="container mb-16">
      <div className="grid grid-cols-1 lg:grid-cols-[18rem_minmax(0,1fr)] gap-10 items-start">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold mb-4">Latest Articles</h1>
          <p className="text-muted-foreground mb-6">
            Fresh perspectives and stories, updated as we publish.
          </p>
          <Link href="/posts" className="underline underline-offset-4 font-medium">
            Read more
          </Link>
        </div>

        <FeaturedCarouselScroller posts={cardDocs} />
      </div>
    </div>
  )
}
