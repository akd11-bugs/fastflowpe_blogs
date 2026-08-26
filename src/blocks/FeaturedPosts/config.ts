import type { Block } from 'payload'

import { gridPosition } from '@/fields/gridPosition'

export const FeaturedPosts: Block = {
  slug: 'featuredPosts',
  interfaceName: 'FeaturedPostsBlock',
  labels: {
    plural: 'Featured Posts',
    singular: 'Featured Posts',
  },
  fields: [
    {
      name: 'posts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      maxRows: 3,
      admin: {
        description:
          'Pick up to 3 posts to feature at the top of the page — the first one shown here renders larger (the "featured" spot), the rest render smaller alongside it. Not automatic; this is what visitors see first, so choose deliberately. Leave empty and the block simply won\'t render.',
      },
    },
    gridPosition(),
  ],
}
