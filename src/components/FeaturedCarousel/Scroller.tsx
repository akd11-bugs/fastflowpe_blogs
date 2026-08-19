'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

import { Card, type CardPostData } from '@/components/Card'
import { cn } from '@/utilities/ui'

export const FeaturedCarouselScroller: React.FC<{ posts: CardPostData[] }> = ({ posts }) => {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const updateEdges = () => {
    const el = scrollerRef.current
    if (!el) return
    setAtStart(el.scrollLeft <= 4)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4)
  }

  useEffect(() => {
    updateEdges()
    const el = scrollerRef.current
    if (!el) return
    el.addEventListener('scroll', updateEdges, { passive: true })
    window.addEventListener('resize', updateEdges)
    return () => {
      el.removeEventListener('scroll', updateEdges)
      window.removeEventListener('resize', updateEdges)
    }
  }, [])

  const scrollByCard = (direction: 1 | -1) => {
    const el = scrollerRef.current
    if (!el) return
    const card = el.firstElementChild as HTMLElement | null
    const amount = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * 0.8
    el.scrollBy({ left: direction * amount, behavior: 'smooth' })
  }

  return (
    <div>
      <div
        ref={scrollerRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2"
      >
        {posts.map((post, index) => (
          <div
            key={index}
            className="snap-start shrink-0 w-[85%] sm:w-[55%] lg:w-[70%]"
          >
            <Card className="h-full" doc={post} relationTo="posts" showCategories />
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-4">
        <button
          type="button"
          aria-label="Previous"
          disabled={atStart}
          onClick={() => scrollByCard(-1)}
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full border transition-colors',
            atStart
              ? 'border-border text-muted-foreground cursor-not-allowed'
              : 'border-border hover:bg-secondary',
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Next"
          disabled={atEnd}
          onClick={() => scrollByCard(1)}
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full border transition-colors',
            atEnd
              ? 'border-border text-muted-foreground cursor-not-allowed'
              : 'bg-primary text-primary-foreground border-primary hover:opacity-90',
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
