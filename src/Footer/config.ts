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
      name: 'companyName',
      type: 'text',
      admin: {
        description: 'Shown bold under "Connect with Us" in the footer, e.g. the legal entity name.',
      },
    },
    {
      name: 'companyAddress',
      type: 'textarea',
      admin: {
        description: 'Multi-line registered address, shown under the company name in the footer.',
      },
    },
    {
      name: 'cin',
      type: 'text',
      label: 'CIN',
      admin: {
        description: 'Corporate Identification Number, shown under the address in the footer.',
      },
    },
    {
      name: 'socialLinks',
      type: 'array',
      maxRows: 6,
      admin: {
        initCollapsed: true,
        description: 'Rendered as the "Follow Us" icon row in the footer.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'platform',
              type: 'select',
              required: true,
              admin: { width: '50%' },
              options: [
                { label: 'LinkedIn', value: 'linkedin' },
                { label: 'Instagram', value: 'instagram' },
                { label: 'X (Twitter)', value: 'x' },
                { label: 'Facebook', value: 'facebook' },
                { label: 'YouTube', value: 'youtube' },
              ],
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
    {
      name: 'columns',
      type: 'array',
      maxRows: 5,
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
