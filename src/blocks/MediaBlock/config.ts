import type { Block } from 'payload'

import { gridPosition } from '@/fields/gridPosition'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    gridPosition(),
  ],
}
