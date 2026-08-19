import type { Field, GroupField } from 'payload'

import deepMerge from '@/utilities/deepMerge'

type GridPositionType = (options?: { overrides?: Partial<GroupField> }) => Field

/**
 * Manual grid placement for a block within a page's 12-column layout grid.
 * Defaults to full-width, single-row placement so existing content with no
 * value set here renders exactly as it did before this field existed.
 */
export const gridPosition: GridPositionType = ({ overrides = {} } = {}) => {
  const generatedGridPosition: GroupField = {
    name: 'gridPosition',
    type: 'group',
    label: 'Layout Position (advanced)',
    admin: {
      description:
        'Manually place this block within the 12-column page grid. Leave defaults for normal full-width stacking.',
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'colStart',
            type: 'number',
            defaultValue: 1,
            min: 1,
            max: 12,
            admin: { width: '25%' },
            label: 'Column Start',
          },
          {
            name: 'colSpan',
            type: 'number',
            defaultValue: 12,
            min: 1,
            max: 12,
            admin: { width: '25%' },
            label: 'Column Span',
          },
          {
            name: 'rowStart',
            type: 'number',
            defaultValue: 1,
            min: 1,
            admin: { width: '25%' },
            label: 'Row Start',
          },
          {
            name: 'rowSpan',
            type: 'number',
            defaultValue: 1,
            min: 1,
            admin: { width: '25%' },
            label: 'Row Span',
          },
        ],
      },
    ],
  }

  return deepMerge(generatedGridPosition, overrides)
}
