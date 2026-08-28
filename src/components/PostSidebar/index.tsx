'use client'

import Link from 'next/link'
import React from 'react'

import { cn } from '@/utilities/ui'

type HighlightPost = {
  slug: string
  title: string
}

const sectionLabel = 'text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4'
const sectionBox = 'border-2 border-border rounded-2xl bg-card p-6'

export const PostSidebar: React.FC<{
  highlights: HighlightPost[]
  activeHighlightSlug?: string
}> = ({ highlights, activeHighlightSlug }) => {
  return (
    // space-y, not flex `gap` — see the note in Footer/Component.tsx.
    <div className="flex flex-col space-y-6">
      {highlights.length > 0 && (
        <div className={sectionBox}>
          <p className={sectionLabel}>Blog Highlights</p>
          {/* space-y, not flex `gap` — see the note in Footer/Component.tsx. */}
          <ul className="flex flex-col space-y-3">
            {highlights.map((post) => {
              const isActive = post.slug === activeHighlightSlug
              return (
                <li key={post.slug}>
                  {/* Left bar + indent marks "you are here" the same way the
                      TOC's rail bolds the current section — always reserving
                      the same space so inactive items don't shift when this
                      one changes. */}
                  <div
                    className={cn(
                      'border-l-2 pl-3',
                      isActive ? 'border-[#028DD0]' : 'border-transparent',
                    )}
                  >
                    {isActive ? (
                      <span className="text-sm font-bold text-foreground">{post.title}</span>
                    ) : (
                      <Link
                        href={`/posts/${post.slug}`}
                        className="text-sm font-medium text-foreground hover:text-primary underline-offset-4 hover:underline transition-colors"
                      >
                        {post.title}
                      </Link>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
