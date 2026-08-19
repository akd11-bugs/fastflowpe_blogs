import type { Block } from 'payload'

import { gridPosition } from '../../fields/gridPosition'

export const FeatureSlides: Block = {
  slug: 'featureSlides',
  interfaceName: 'FeatureSlidesBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'What FastFlowPe Does',
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
    plural: 'Feature Slides Sections',
    singular: 'Feature Slides',
  },
}
