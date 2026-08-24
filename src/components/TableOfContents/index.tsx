import React from 'react'

import type { HeadingEntry } from '@/utilities/extractHeadings'

/**
 * Jump-link list built from the post's own h2/h3 headings — see
 * utilities/extractHeadings.ts. Plain anchor hrefs, no JS: RichText's heading
 * converter stamps the matching `id` on each rendered heading from the exact
 * same slug sequence, so `#anchor` navigation works with zero client code.
 */
export const TableOfContents: React.FC<{ headings: HeadingEntry[] }> = ({ headings }) => {
  if (headings.length < 2) return null

  return (
    <nav aria-label="On this page" className="border-2 border-border rounded-2xl bg-card p-6">
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
        On this page
      </p>
      {/* space-y, not flex `gap` — see the note in Footer/Component.tsx. */}
      <ol className="flex flex-col space-y-2.5">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.level === 3 ? 'ml-5' : undefined}>
            <a
              href={`#${heading.id}`}
              className="text-sm text-foreground hover:text-primary underline-offset-4 hover:underline transition-colors"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
