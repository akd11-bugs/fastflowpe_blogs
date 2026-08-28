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
      name: 'heading',
      type: 'text',
      admin: {
        description:
          'The page\'s H1, shown above the featured posts. Always renders, even if no posts are picked below.',
      },
    },
    {
      name: 'subheading',
      type: 'text',
      admin: {
        description:
          'A one-line H2 shown directly below the H1, before the featured posts — a short subtitle for the page.',
      },
    },
    {
      name: 'blogsIntro',
      type: 'textarea',
      admin: {
        description:
          'Short blurb shown beside the "Blogs" heading, next to the featured posts.',
      },
    },
    {
      name: 'posts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      maxRows: 3,
      admin: {
        description:
          'Pick up to 3 posts to feature at the top of the page — the first one shown here renders larger (the "featured" spot), the rest render smaller alongside it in a compact list. Not automatic; this is what visitors see first, so choose deliberately. Leave empty and the block simply won\'t render.',
      },
    },
    gridPosition(),
  ],
}
