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
import { ParallaxImage } from '@/heros/PostHero/ParallaxImage'
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

      {/* Heading only — the image now lives in the grid below, in the same
          column as the article content. */}
      <PostHero post={post} readingTime={readingTime} />

      <div className="container-wide">
        {/* Image (row 1) and content (row 2) share grid column 1; the
            sidebar spans both rows in column 2. Explicit col/row placement
            (not DOM order) so mobile keeps a natural reading order — image,
            article, sidebar — while desktop rearranges into the 2-row grid.
            Sharing one grid, rather than three independently max-width'd
            elements, is what guarantees the image and the content column
            are always exactly the same width: the grid computes column 1's
            width once, for both rows, at every viewport — nothing to keep
            in sync by hand. */}
        <div className="lg:grid lg:max-w-[96rem] lg:grid-cols-[1fr_320px] lg:gap-16 lg:items-start">
          {/* No w-full at lg: an explicit width:100% computes against the
              grid cell BEFORE margins are applied, so lg:mx-4 would add 32px
              on top instead of shrinking the box to fit — exactly the
              overflow that caused this to stop matching the content column's
              width. Grid's own default stretch (width:auto) already fills
              the cell and correctly accounts for margins. */}
          {post.heroImage && typeof post.heroImage === 'object' && (
            <div className="relative mt-10 aspect-[21/9] w-full overflow-hidden rounded-2xl lg:col-start-1 lg:row-start-1 lg:mx-4 lg:mt-0 lg:w-auto">
              <ParallaxImage imgClassName="object-cover" resource={post.heroImage} />
            </div>
          )}

          {/* lg:mx-4 on both the image (above) and this content div — the
              same inset on both is what keeps them the same width and
              aligned; changing just one without the other reintroduces the
              mismatch this layout was built to avoid. */}
          <div className="mt-10 max-w-[48rem] mx-auto lg:col-start-1 lg:row-start-2 lg:mx-4 lg:mt-10 lg:max-w-none">
            {/* On mobile, the TOC still leads the article — the sidebar
                column below only exists from lg up. */}
            {headings.length > 1 && (
              <div className="mb-10 lg:hidden">
                <TableOfContents headings={headings} />
              </div>
            )}

            <RichText data={post.content} enableGutter={false} />
          </div>

          <aside className="mt-10 max-w-[48rem] mx-auto lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:mx-0 lg:mt-0 lg:sticky lg:top-32 space-y-6">
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
