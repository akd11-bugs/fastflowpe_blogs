import type { Block } from 'payload'

import { gridPosition } from '../../fields/gridPosition'

export const ProcessSteps: Block = {
  slug: 'processSteps',
  interfaceName: 'ProcessStepsBlock',
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'Our Process',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'How it works',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'steps',
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
    plural: 'Process Steps Sections',
    singular: 'Process Steps',
  },
}
