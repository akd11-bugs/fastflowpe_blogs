import { cn } from '@/utilities/ui'
import React from 'react'

import { Card, CardPostData } from '@/components/Card'

export type Props = {
  posts: CardPostData[]
}

/**
 * Plain, uniform 3-column grid, matching the approved wireframe: image +
 * category + title + a short excerpt on every card.
 */
export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts } = props

  return (
    <div className={cn('container')}>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3">
        {posts?.map((result, index) => {
          if (typeof result !== 'object' || result === null) return null

          return (
            <Card className="h-full" doc={result} key={index} relationTo="posts" showCategories />
          )
        })}
      </div>
    </div>
  )
}
