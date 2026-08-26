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
        admin: { description: 'Rendered as an outline button, e.g. linking to a login page.' },
      },
    }),
    link({
      appearances: ['default'],
      overrides: {
        name: 'signupLink',
        label: 'Sign Up Button',
        admin: { description: 'Rendered as a filled button with a trailing arrow.' },
      },
    }),
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
