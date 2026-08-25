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
import { PostSidebar } from '@/components/PostSidebar'
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
  const otherHighlights = await queryRecentPosts({ excludeId: post.id })

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

      <div className="container pt-8">
        {/* Content + sidebar side by side from lg up — the sidebar (share,
            categories, blog highlights) sticks alongside the article instead
            of trailing it as a footer. Below lg it drops beneath the content
            in normal flow.

            max-w-[72rem] mx-auto: 48rem content + 4rem gap + 320px (20rem)
            sidebar = 72rem — centered the same way, and at the same width,
            as PostHero's image, so the 1fr content column always lands
            flush with the image's left edge instead of the two computing
            independent centering offsets. */}
        <div className="lg:mx-auto lg:grid lg:max-w-[72rem] lg:grid-cols-[1fr_320px] lg:gap-16 lg:items-start">
          <div className="max-w-[48rem] mx-auto lg:mx-0">
            {/* On mobile, the TOC still leads the article — the sidebar
                column below only exists from lg up. */}
            {headings.length > 1 && (
              <div className="mb-10 lg:hidden">
                <TableOfContents headings={headings} />
              </div>
            )}

            <RichText data={post.content} enableGutter={false} />
          </div>

          <aside className="mt-10 max-w-[48rem] mx-auto lg:mx-0 lg:mt-0 lg:sticky lg:top-32 space-y-6">
            {headings.length > 1 && <TableOfContents headings={headings} />}
            <PostSidebar
              categories={postCategories.map((category) => ({
                id: String(category.id),
                title: category.title || 'Untitled category',
                slug: category.slug,
              }))}
              highlights={[
                // The article being read appears in its own highlights list —
                // marked active, the same "you are here" role the TOC plays
                // for headings — followed by other recent posts.
                { slug: post.slug, title: post.title },
                ...otherHighlights.map((highlight) => ({
                  slug: highlight.slug,
                  title: highlight.title,
                })),
              ]}
              activeHighlightSlug={post.slug}
              title={post.title}
              url={`${getServerSideURL()}${url}`}
            />
          </aside>
        </div>

        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <RelatedPosts
            className="mt-12 max-w-[52rem] mx-auto lg:max-w-none lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
            docs={post.relatedPosts.filter((post) => typeof post === 'object')}
          />
        )}
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

// "Blog Highlights" in the sidebar — most recent posts other than this one.
const queryRecentPosts = cache(async ({ excludeId }: { excludeId: number }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 3,
    overrideAccess: false,
    pagination: false,
    sort: '-publishedAt',
    where: {
      id: {
        not_equals: excludeId,
      },
    },
    select: {
      title: true,
      slug: true,
    },
  })

  return result.docs
})
