import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { PostHero } from '@/heros/PostHero'
import { Media } from '@/components/Media'
import { formatAuthors } from '@/utilities/formatAuthors'
import { formatDateTime } from '@/utilities/formatDateTime'
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
  const hasAuthors =
    post.populatedAuthors &&
    post.populatedAuthors.length > 0 &&
    formatAuthors(post.populatedAuthors) !== ''

  return (
    <article className="pt-28 pb-16">
      <PageClient />
      <BlogPostingSchema post={post} />

      <ReadingProgress />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      {/* No separate posts listing page — the blog IS the homepage now, so
          "Blog" points there instead of the removed /posts index. Category
          isn't a link: there's no per-category filtered view to send it to. */}
      <div className="container-wide">
        <Breadcrumbs
          className="lg:ml-[168px] lg:mr-[168px]"
          items={[
            { label: 'Blog', href: '/' },
            ...postCategories.slice(0, 1).map((category) => ({
              label: category.title || 'Untitled category',
            })),
            { label: post.title },
          ]}
        />
      </div>

      {/* Heading only — the image now lives in the grid below, in the same
          column as the article content. */}
      <PostHero post={post} url={`${getServerSideURL()}${url}`} />

      <div className="container-wide">
        {/* Image (row 1) and content (row 2) share grid column 1; the
            sidebar sits in column 2, row 2 — beside the content, not
            stretched up beside the image. Explicit col/row placement (not
            DOM order) so mobile keeps a natural reading order — image,
            article, sidebar — while desktop rearranges into the 2-row grid.
            Sharing one grid, rather than three independently max-width'd
            elements, is what guarantees the image and the content column
            are always exactly the same width: the grid computes column 1's
            width once, for both rows, at every viewport — nothing to keep
            in sync by hand. */}
        <div className="lg:grid lg:ml-[168px] lg:mr-[168px] lg:grid-cols-[1fr_320px] lg:gap-16 lg:items-start">
          {/* Fixed margins, not a percentage: a percentage kept growing the
              dead space on wide monitors. 168px here plus container-wide's
              own 32px padding = a 200px total inset from the viewport edge.
              Equal ml/mr on both sides keeps the content's left inset the
              same as the sidebar's right inset — no explicit max-w needed, since
              the grid's own width is just whatever's left after these
              margins, and the article column's
              actual reading width is separately capped by RichText's own
              `prose` class, not by this grid. The margin lives on the grid
              itself, not per-child, so column 1's left edge is set once and
              PostHero's heading grid (which mirrors this exact margin +
              grid-cols pairing) lines up with it automatically. No w-full at
              lg: an explicit width:100% would compute against the grid cell
              before the margins shrink it, causing overflow — grid's default
              stretch (width:auto) already fills the cell correctly. */}
          {post.heroImage && typeof post.heroImage === 'object' && (
            <div className="relative mt-10 w-full rounded-2xl border border-border/80 bg-muted/50 p-[0.5px] lg:col-start-1 lg:row-start-1 lg:mt-12 lg:w-[calc(100%+9rem)]">
              {/* Wider than the text column on purpose — sized to cover 80%
                  of the row (text column + gap-16 + part of the sidebar's
                  column width). Safe to overflow into column 2 here: this
                  image sits in row 1, and the sidebar only occupies row 2,
                  so there's nothing under it to collide with. */}
              {/* No fixed aspect-ratio box and no object-cover: those forced
                  every image into a crop (a 3:2 source into a 16:9 box always
                  loses its top or bottom). Rendering at the resource's own
                  intrinsic width/height instead (no `fill`) shows the whole
                  image, uncropped, at its natural ratio — width still fills
                  the column, height follows from that automatically. No
                  parallax here either — this is a reading page, not a
                  landing showcase. */}
              <Media
                priority
                imgClassName="w-full h-auto rounded-[calc(1rem-1px)]"
                resource={post.heroImage}
              />
            </div>
          )}

          <div className="mt-10 max-w-[48rem] mx-auto lg:col-start-1 lg:row-start-2 lg:mt-10 lg:max-w-none">
            {/* Byline/date/reading-time — sits under the hero image now,
                not above the title (see PostHero). */}
            <div className="mb-10 flex flex-col space-y-3 text-sm text-muted-foreground md:flex-row md:items-center md:space-y-0 md:space-x-6">
              {hasAuthors && (
                <span className="font-medium text-foreground">
                  {formatAuthors(post.populatedAuthors ?? [])}
                </span>
              )}
              {post.publishedAt && (
                <time dateTime={post.publishedAt}>{formatDateTime(post.publishedAt)}</time>
              )}
              {readingTime && <span>{readingTime} min read</span>}
            </div>

            {/* On mobile, the TOC still leads the article — the sidebar
                column below only exists from lg up. */}
            {headings.length > 1 && (
              <div className="mb-10 lg:hidden">
                <TableOfContents headings={headings} />
              </div>
            )}

            <RichText data={post.content} enableGutter={false} />
          </div>

          {/* row-start-2, not row-span-2 from row 1 — the sidebar (including
              the TOC) sits beside the article content, not stretched up
              beside the image too. Same lg:mt-10 as the content div so the
              sidebar's top (and the TOC inside it) lines up with the
              article's first line, not with row 2's raw top edge. */}
          <aside className="mt-10 max-w-[48rem] mx-auto lg:col-start-2 lg:row-start-2 lg:mx-0 lg:mt-10 lg:sticky lg:top-32 space-y-6">
            {headings.length > 1 && <TableOfContents headings={headings} />}
            <PostSidebar
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
            />
          </aside>
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
