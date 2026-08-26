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
              'Only relevant if this item has no dropdown groups below — shows a small static chevron next to the label with no menu behind it. If dropdown groups ARE added, the chevron shows automatically and this is ignored.',
          },
        },
        {
          name: 'dropdownGroups',
          type: 'array',
          maxRows: 4,
          admin: {
            initCollapsed: true,
            description:
              'Optional. If any groups are added here, this nav item renders as a hover/tap dropdown (like "Products" or "Industry" on fastflowpe.com) instead of a plain link — its own Link field above still needs a label, but its URL is then unused.',
          },
          fields: [
            {
              name: 'heading',
              type: 'text',
              admin: {
                description:
                  'Optional small heading above this group\'s links (e.g. "Collections"). Leave blank for a plain list — like the "Industry" dropdown, which has none.',
              },
            },
            {
              name: 'links',
              type: 'array',
              maxRows: 8,
              admin: { initCollapsed: true },
              fields: [link({ appearances: false })],
            },
          ],
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
        label: 'Login Button',
        admin: { description: 'Rendered as an outline button (e.g. "Login").' },
      },
    }),
    link({
      appearances: ['default'],
      overrides: {
        name: 'signupLink',
        label: 'Sign Up Button',
        admin: {
          description:
            'Rendered as the filled brand-gradient button with a trailing arrow (e.g. "Sign Up").',
        },
      },
    }),
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
