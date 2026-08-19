'use client'

import React from 'react'

import { cn } from '@/utilities/ui'

/**
 * A vertical stepper between the intro column and the cards — doubles as
 * the visual partition between them, and shows which step is currently
 * active as the user scrolls (dots fill in as you pass each step, the
 * current one is highlighted).
 */
export const ProcessTracker: React.FC<{ count: number; activeIndex: number }> = ({
  count,
  activeIndex,
}) => {
  return (
    <div className="hidden lg:flex flex-col items-center lg:sticky lg:top-32 lg:self-start lg:h-[calc(100vh-12rem)]">
      {Array.from({ length: count }, (_, i) => (
        <React.Fragment key={i}>
          <div
            className={cn(
              'h-3 w-3 shrink-0 rounded-full border-2 transition-all duration-300',
              i === activeIndex
                ? 'scale-125 border-foreground bg-foreground'
                : i < activeIndex
                  ? 'border-foreground bg-foreground'
                  : 'border-border bg-transparent',
            )}
          />
          {i < count - 1 && (
            <div
              className={cn(
                'w-0.5 flex-1 my-1 transition-colors duration-300',
                i < activeIndex ? 'bg-foreground' : 'bg-border',
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
