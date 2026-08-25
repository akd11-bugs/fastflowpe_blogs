import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import { getReadingTime } from '@/utilities/getReadingTime'
import { getServerSideURL } from '@/utilities/getURL'
import { extractHeadings } from '@/utilities/extractHeadings'
import { ReadingProgress } from '@/components/ReadingProgress'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { TableOfContents } from '@/components/TableOfContents'
import { PostShareTags } from '@/components/PostShareTags'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { BlogPostingSchema } from '@/components/StructuredData/BlogPosting'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = posts.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/posts/' + decodedSlug
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return <PayloadRedirects url={url} />

  const readingTime = getReadingTime(post.content)
  const headings = extractHeadings(post.content)
  const postCategories = (post.categories || []).filter(
    (category): category is Exclude<typeof category, number> => typeof category === 'object',
  )

  return (
    <article className="pt-16 pb-16">
      <PageClient />
      <BlogPostingSchema post={post} />

      <ReadingProgress />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      {/* No separate posts listing page — the blog IS the homepage now, so
          "Blog" points there instead of the removed /posts index. Category
          isn't a link: there's no per-category filtered view to send it to. */}
      <Breadcrumbs
        className="mx-auto max-w-[48rem]"
        items={[
          { label: 'Blog', href: '/' },
          ...postCategories.slice(0, 1).map((category) => ({
            label: category.title || 'Untitled category',
          })),
          { label: post.title },
        ]}
      />

      {/* Heading, then image — PostHero owns both, in that order — then the
          rest of the article content below. */}
      <PostHero post={post} readingTime={readingTime} />

      {/* gap-4 removed: this flex container has exactly one child (the
          `.container` div below), so it was always a no-op. */}
      <div className="flex flex-col items-center pt-8">
        <div className="container">
          {headings.length > 1 && (
            <div className="mx-auto mb-10 max-w-[48rem]">
              <TableOfContents headings={headings} />
            </div>
          )}

          <RichText className="max-w-[48rem] mx-auto" data={post.content} enableGutter={false} />

          <div className="mx-auto mt-10 max-w-[48rem]">
            <PostShareTags
              categories={postCategories.map((category) => ({
                id: String(category.id),
                title: category.title || 'Untitled category',
                slug: category.slug,
              }))}
              title={post.title}
              url={`${getServerSideURL()}${url}`}
            />
          </div>

          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <RelatedPosts
              className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={post.relatedPosts.filter((post) => typeof post === 'object')}
            />
          )}
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug })

  return generateMeta({ doc: post, collection: 'posts' })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
