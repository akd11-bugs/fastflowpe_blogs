import type { Block } from 'payload'

import { gridPosition } from '../../fields/gridPosition'

export const IndustrySolutions: Block = {
  slug: 'industrySolutions',
  interfaceName: 'IndustrySolutionsBlock',
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'Industries',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Built for Every Industry',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'items',
      type: 'array',
      minRows: 2,
      required: true,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Industry',
        },
        {
          name: 'headline',
          type: 'text',
          required: true,
          label: 'Short headline',
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
      ],
    },
    gridPosition(),
  ],
  labels: {
    plural: 'Industry Solutions Sections',
    singular: 'Industry Solutions',
  },
}
