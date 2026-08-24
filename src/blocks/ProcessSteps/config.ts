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
        {
          // Deliberately optional: existing rows have no image, and each panel
          // renders a placeholder in its place, so the section never breaks
          // while the images are still being produced.
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Panel image',
          admin: {
            description:
              'Shown beside the description on large screens, below it on small. Leave empty for a placeholder.',
          },
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
