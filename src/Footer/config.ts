import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'newsletterHeading',
      type: 'text',
      defaultValue: "Don't miss out",
    },
    {
      name: 'newsletterDescription',
      type: 'text',
      defaultValue: 'Enter your email for news and updates',
    },
    {
      name: 'newsletterForm',
      type: 'relationship',
      relationTo: 'forms',
      admin: {
        description:
          'A Form (from Forms) with a single email field — rendered as a compact signup, not the full form layout.',
      },
    },
    {
      name: 'columns',
      type: 'array',
      maxRows: 4,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/ColumnRowLabel#ColumnRowLabel',
        },
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'navItems',
          type: 'array',
          maxRows: 8,
          admin: {
            initCollapsed: true,
            components: {
              RowLabel: '@/Footer/RowLabel#RowLabel',
            },
          },
          fields: [
            link({
              appearances: false,
            }),
          ],
        },
      ],
    },
    {
      name: 'legalLinks',
      type: 'array',
      maxRows: 4,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
      fields: [
        link({
          appearances: false,
        }),
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
