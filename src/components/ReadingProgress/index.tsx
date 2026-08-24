'use client'

import React from 'react'

import { ScrollProgress } from '@/components/core/scroll-progress'

/**
 * Read-progress bar for article pages.
 *
 * The unlit track matters as much as the fill: without it the bar reads as a
 * stray coloured edge rather than as progress along a known length. Both track
 * tones are literal per theme on purpose — a single translucent blue would be
 * invisible against near-black.
 *
 * The fill is FastFlowPe blue (#028DD0), not `--primary`, which is a near-black
 * in light and a near-white in dark and reads as a UI seam rather than a brand cue.
 */
export const ReadingProgress: React.FC = () => {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <div className="absolute inset-x-0 top-0 h-1 bg-[#E6F4FE] dark:bg-[#111927]" />
      <ScrollProgress className="absolute bg-[#028DD0]" />
    </div>
  )
}
