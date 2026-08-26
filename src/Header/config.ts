import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
        {
          name: 'showChevron',
          type: 'checkbox',
          label: 'Show dropdown chevron',
          admin: {
            description:
              'Visual only for now — shows a small chevron next to the label (e.g. "Products ⌄"). No dropdown menu behind it yet.',
          },
        },
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
    link({
      appearances: ['outline'],
      overrides: {
        name: 'loginLink',
        label: 'Secondary Nav Link',
        admin: {
          description:
            'Rendered as a plain text link at the right edge of the nav (e.g. "Sign Up"), not a button — despite the field name.',
        },
      },
    }),
    link({
      appearances: ['default'],
      overrides: {
        name: 'signupLink',
        label: 'Primary CTA Button',
        admin: {
          description: 'Rendered as the filled gradient button with a trailing arrow (e.g. "Book a demo").',
        },
      },
    }),
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
