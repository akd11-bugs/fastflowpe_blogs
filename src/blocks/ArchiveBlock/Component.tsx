import type { Post, ArchiveBlock as ArchiveBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'

import { PostsExplorer } from '@/components/PostsExplorer'
import { BlogSchema } from '@/components/StructuredData/Blog'

export const ArchiveBlock: React.FC<ArchiveBlockProps & { id?: string }> = async (props) => {
  const {
    id,
    categories,
    description,
    heading,
    introContent,
    limit: limitFromProps,
    populateBy,
    selectedDocs,
  } = props

  const limit = limitFromProps || 3

  let posts: Post[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const flattenedCategories = categories?.map((category) => {
      if (typeof category === 'object') return category.id
      else return category
    })

    const fetchedPosts = await payload.find({
      collection: 'posts',
      depth: 1,
      limit,
      where: {
        ...(flattenedCategories && flattenedCategories.length > 0
          ? { categories: { in: flattenedCategories } }
          : {}),
      },
    })

    posts = fetchedPosts.docs
  } else {
    if (selectedDocs?.length) {
      const filteredSelectedPosts = selectedDocs.map((post) => {
        if (typeof post.value === 'object') return post.value
      }) as Post[]

      posts = filteredSelectedPosts
    }
  }

  return (
    // No margin here — RenderBlocks.tsx already wraps every block in its
    // own `my-16`. A second one here doesn't collapse with it (the
    // ScrollReveal wrapper in between blocks that), so it used to just add
    // an extra ~64px dead gap above this section.
    <div id={`block-${id}`}>
      <BlogSchema name={heading || 'FastFlowPe Blog'} description={description} posts={posts} />
      {/* Left-aligned and modestly sized on purpose — the hero above this
          block already carries the page's one big centered statement.
          Repeating that scale here read as a second, competing hero rather
          than a section intro, which is most of what made this feel crowded. */}
      {heading && (
        <div className="container mb-8">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{heading}</h2>
          {description && (
            <p className="mt-2 max-w-[42rem] text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {introContent && (
        <div className="container mb-16">
          <RichText className="ms-0 max-w-[48rem]" data={introContent} enableGutter={false} />
        </div>
      )}
      <PostsExplorer posts={posts} />
    </div>
  )
}
