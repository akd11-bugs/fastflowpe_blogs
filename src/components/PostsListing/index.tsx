import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { Where } from 'payload'

import { TopicTabs } from '@/components/TopicTabs'
import { CollectionArchive } from '@/components/CollectionArchive'
import type { CardPostData } from '@/components/Card'
import { FeaturedCarousel } from '@/components/FeaturedCarousel'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { getReadingTime } from '@/utilities/getReadingTime'

export const POSTS_PER_PAGE = 12

export const PostsListing: React.FC<{
  page: number
  categorySlug?: string
}> = async ({ page, categorySlug }) => {
  const payload = await getPayload({ config: configPromise })

  const categoriesResult = await payload.find({
    collection: 'categories',
    sort: 'title',
    limit: 100,
    overrideAccess: false,
  })

  let where: Where | undefined
  const matchedCategory = categorySlug
    ? categoriesResult.docs.find((category) => category.slug === categorySlug)
    : undefined

  if (categorySlug) {
    where = {
      categories: {
        in: matchedCategory ? [matchedCategory.id] : [],
      },
    }
  }

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: POSTS_PER_PAGE,
    page,
    overrideAccess: false,
    where,
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

  const cardDocs: CardPostData[] = posts.docs.map((post) => {
    const { content, ...rest } = post
    return {
      ...rest,
      readingTime: getReadingTime(content),
    }
  })

  const showFeatured = page === 1 && !categorySlug

  return (
    <div className="pt-24 pb-24">
      <Breadcrumbs
        items={[
          { label: 'Blog', href: '/posts' },
          ...(matchedCategory ? [{ label: matchedCategory.title || 'Untitled category' }] : []),
        ]}
      />

      {showFeatured && <FeaturedCarousel />}

      <TopicTabs categories={categoriesResult.docs} activeSlug={categorySlug} />

      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={POSTS_PER_PAGE}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={cardDocs} />

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} categorySlug={categorySlug} />
        )}
      </div>
    </div>
  )
}
