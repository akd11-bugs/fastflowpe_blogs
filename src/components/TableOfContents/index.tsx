'use client'

import { AlignLeft } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

import type { HeadingEntry } from '@/utilities/extractHeadings'
import { cn } from '@/utilities/ui'

/**
 * Jump-link list built from the post's own h2 headings — see
 * utilities/extractHeadings.ts. Plain anchor hrefs, no JS required for
 * navigation itself: RichText's heading converter stamps the matching `id`
 * on each rendered heading from the exact same slug sequence.
 *
 * Active-section tracking watches the top third of the viewport (rootMargin)
 * rather than a thin band — a thin band can end up with zero headings inside
 * it between two widely-spaced sections, which would leave the active state
 * stuck. Multiple headings can be inside the top third at once (short
 * sections), so the lowest one in document order — the one the reader most
 * recently scrolled past — wins. The active id is never reset to null once
 * set, so scrolling past the last heading keeps it active instead of losing
 * the bold state entirely.
 */
export const TableOfContents: React.FC<{ headings: HeadingEntry[] }> = ({ headings }) => {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null)
  const intersecting = useRef<Set<string>>(new Set())

  useEffect(() => {
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const idOrder = headings.map((h) => h.id)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            intersecting.current.add(entry.target.id)
          } else {
            intersecting.current.delete(entry.target.id)
          }
        }

        if (intersecting.current.size === 0) return

        const lowest = idOrder.reduce((best, id) =>
          intersecting.current.has(id) ? id : best,
        )
        setActiveId(lowest)
      },
      { rootMargin: '0px 0px -66% 0px', threshold: 0 },
    )

    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [headings])

  if (headings.length < 2) return null

  const activeIndex = Math.max(0, headings.findIndex((heading) => heading.id === activeId))
  const progress = ((activeIndex + 1) / headings.length) * 100

  return (
    <nav
      aria-label="On this page"
      className="border-2 border-border rounded-2xl bg-card p-6"
    >
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
        <AlignLeft className="h-3.5 w-3.5" />
        On this page
      </p>
      <div className="relative flex">
        {/* Progress rail: unlit track plus a lit segment that grows with the
            active heading's position in the list — same track/fill pairing
            as ReadingProgress, just vertical and per-section instead of
            continuous scroll percentage. */}
        <div className="relative mr-4 w-px shrink-0 bg-border">
          <div
            className="absolute inset-x-0 top-0 w-px bg-[#028DD0] transition-[height] duration-300"
            style={{ height: `${progress}%` }}
          />
        </div>
        <ol className="flex flex-col space-y-2.5">
          {headings.map((heading) => {
            const isActive = heading.id === activeId
            return (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  className={cn(
                    'text-sm underline-offset-4 hover:underline transition-colors',
                    isActive
                      ? 'font-bold text-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {heading.text}
                </a>
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}
