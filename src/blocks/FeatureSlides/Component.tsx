'use client'

import React, { useEffect, useRef, useState } from 'react'

import type { FeatureSlidesBlock as FeatureSlidesBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'

// Scoped, deliberate reintroduction of the original FastFlowPe brand blue —
// used here only as a text accent (headline, counter, active row), never as
// a background. Confined to this one block, not added to the global theme.
const FASTFLOWPE_BLUE = '#028DD0'

/**
 * Scrollspy-style feature index (aha.com.au's "Our services" pattern):
 * a pinned left column shows a "0X OF 0Y" counter and a large headline that
 * tracks whichever row in the right-hand list is currently centered in the
 * viewport. The right column is a plain list of item titles separated by
 * hairlines — no colored slide backgrounds, no full-bleed takeover.
 */
export const FeatureSlidesBlock: React.FC<FeatureSlidesBlockProps> = ({
  heading,
  description,
  items,
}) => {
  const itemList = items || []
  const total = itemList.length
  const [activeIndex, setActiveIndex] = useState(0)
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = rowRefs.current.findIndex((el) => el === entry.target)
            if (index !== -1) setActiveIndex(index)
          }
        })
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    rowRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [itemList.length])

  const active = itemList[activeIndex]

  return (
    <div className="my-16">
      <div className="container mb-10 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">{heading}</h2>
        {description && <p className="text-muted-foreground max-w-[65ch]">{description}</p>}
      </div>

      <div className="container grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20">
        <div className="hidden lg:block lg:sticky lg:top-32 lg:self-start">
          {active && (
            <div>
              <span
                className="block text-sm font-bold tracking-[0.2em] uppercase mb-4"
                style={{ color: FASTFLOWPE_BLUE }}
              >
                {String(activeIndex + 1).padStart(2, '0')} OF {String(total).padStart(2, '0')}
              </span>
              <p
                className="text-3xl md:text-5xl font-bold tracking-tight leading-tight"
                style={{ color: FASTFLOWPE_BLUE }}
              >
                {active.description}
              </p>
            </div>
          )}
        </div>

        <div>
          {itemList.map((item, index) => {
            const isActive = index === activeIndex
            return (
              <div
                key={item.id || index}
                ref={(el) => {
                  rowRefs.current[index] = el
                }}
                onMouseEnter={() => setActiveIndex(index)}
                className="border-b-2 border-border py-8 md:py-10 lg:py-12"
              >
                <div className="hidden lg:flex items-center justify-between gap-6 cursor-default">
                  <span
                    className={cn(
                      'text-2xl md:text-3xl font-bold tracking-tight transition-colors',
                      isActive ? 'underline underline-offset-4' : 'text-muted-foreground',
                    )}
                    style={isActive ? { color: FASTFLOWPE_BLUE } : undefined}
                  >
                    {item.title}
                  </span>
                  <span
                    className={cn('text-2xl shrink-0', !isActive && 'text-muted-foreground')}
                    style={isActive ? { color: FASTFLOWPE_BLUE } : undefined}
                  >
                    {isActive ? '→' : '↗'}
                  </span>
                </div>

                {/* Mobile: no sticky sidebar — show each item's full content inline */}
                <div className="lg:hidden">
                  <span
                    className="block text-xs font-bold tracking-[0.2em] uppercase mb-2"
                    style={{ color: FASTFLOWPE_BLUE }}
                  >
                    {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                  </span>
                  <h3 className="text-xl font-bold tracking-tight mb-2">{item.title}</h3>
                  {item.description && (
                    <p className="text-muted-foreground">{item.description}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
