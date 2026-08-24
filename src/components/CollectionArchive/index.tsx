import { cn } from '@/utilities/ui'
import React from 'react'

import { Card, CardPostData } from '@/components/Card'

export type Props = {
  posts: CardPostData[]
}

/**
 * Bento layout: the first post is a large lead tile, and one "wide" band
 * repeats every 6 posts after it, with plain 1x1 cards filling the rest.
 * Spans apply from `lg` up only — below that every tile collapses to
 * `col-span-1`, since a spanning tile needs at least 3 columns to read as
 * deliberate rather than as a layout accident on a narrow screen.
 */
const spanFor = (index: number): 'feature' | 'wide' | 'default' => {
  if (index === 0) return 'feature'
  if (index % 6 === 0) return 'wide'
  return 'default'
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts } = props

  return (
    <div className={cn('container')}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts?.map((result, index) => {
          if (typeof result !== 'object' || result === null) return null

          const span = spanFor(index)

          return (
            <Card
              className={cn(
                'h-full',
                span === 'feature' && 'lg:col-span-2 lg:row-span-2',
                span === 'wide' && 'sm:col-span-2',
              )}
              doc={result}
              key={index}
              relationTo="posts"
              showCategories
              size={span === 'feature' ? 'featured' : 'default'}
            />
          )
        })}
      </div>
    </div>
  )
}
