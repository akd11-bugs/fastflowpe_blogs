import React from 'react'

import type { FeaturedPostsBlock as FeaturedPostsBlockProps, Post } from '@/payload-types'

import { Card } from '@/components/Card'

/**
 * The homepage's "hero" — admin-picked posts, not auto-selected (see the
 * field description in config.ts). The first pick renders large
 * (size="featured": bigger image, headline, excerpt — Card already
 * supports this), the rest render at default size alongside it. Reuses
 * Card as-is (already borderless with its own hover lift, from the
 * cards/buttons cleanup earlier this session) rather than introducing a
 * second card treatment.
 */
export const FeaturedPostsBlock: React.FC<FeaturedPostsBlockProps> = ({ posts }) => {
  const validPosts = (posts || []).filter(
    (post): post is Post => typeof post === 'object' && post !== null,
  )

  if (validPosts.length === 0) return null

  const [featured, ...secondary] = validPosts

  return (
    <div className="container">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card doc={featured} relationTo="posts" showCategories size="featured" />

        {secondary.length > 0 && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-1">
            {secondary.map((post, i) => (
              <Card key={i} doc={post} relationTo="posts" showCategories />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
