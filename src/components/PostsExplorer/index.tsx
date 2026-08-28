'use client'

import React, { useMemo, useState } from 'react'

import type { CardPostData } from '@/components/Card'

import { CollectionArchive } from '@/components/CollectionArchive'
import { cn } from '@/utilities/ui'

/**
 * Category tabs, filtering the post grid client-side.
 *
 * Client-side rather than URL-searchParams-driven on purpose: the Archive
 * block already fetches its full pool server-side (limit 50 today), so
 * refiltering an array already in the browser is instant and needs no
 * server round-trip per tab click. Tabs are derived from the CATEGORIES
 * ACTUALLY PRESENT in that fetched pool, not a separately queried full
 * category list — a tab for a category with zero posts in the pool is a
 * dead end, not a feature.
 */
export const PostsExplorer: React.FC<{ posts: CardPostData[] }> = ({ posts }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categories = useMemo(() => {
    const seen = new Map<string, string>()
    for (const post of posts) {
      for (const category of post.categories || []) {
        if (typeof category === 'object' && category !== null && category.title) {
          seen.set(category.title, category.title)
        }
      }
    }
    return [...seen.keys()].sort()
  }, [posts])

  const filtered = useMemo(() => {
    return posts.filter(
      (post) =>
        !activeCategory ||
        (post.categories || []).some(
          (category) => typeof category === 'object' && category?.title === activeCategory,
        ),
    )
  }, [posts, activeCategory])

  return (
    <div>
      <div className="container py-12">
        <h1 className="mb-8 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Read More Articles
        </h1>

        {/* Label and pills on one line. Plain text, not a heading — the
            page's only H2 ("Blogs") lives up in the hero; this is a label
            for the filter control beside it, not a new document section.
            The whole row sits inside one glass card so it reads as a single
            unified block rather than two independently-placed elements. */}
        <div className="flex flex-wrap items-center gap-x-16 gap-y-2 rounded-2xl border border-border/60 bg-muted/30 px-6 py-4 shadow-sm backdrop-blur-md">
          <span className="shrink-0 font-sans text-lg font-normal leading-none text-foreground">
            Browse by category
          </span>

          {/* Pills, not underlined text — each tab carries its own background,
              so it reads as a distinct chip even if the margin between two
              pills ever renders thinner than intended (a WebView that drops
              unsupported CSS silently, a font substitution, anything). A run
              of plain underlined words has no such fallback: if the space
              between them collapses, "All posts" and "Design" fuse into one
              unreadable run. Pills can't do that — there's always a visible
              edge between two different button backgrounds. */}
          <nav
            aria-label="Filter posts by topic"
            className="flex flex-wrap items-center gap-1 rounded-full border border-border/60 bg-muted/50 p-1"
          >
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                activeCategory === null
                  ? 'bg-background text-[#028DD0] shadow-sm'
                  : 'text-muted-foreground hover:text-[#028DD0]',
              )}
            >
              All posts
            </button>
            {categories.map((title) => (
              <button
                key={title}
                type="button"
                onClick={() => setActiveCategory(title)}
                className={cn(
                  'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                  activeCategory === title
                    ? 'bg-background text-[#028DD0] shadow-sm'
                    : 'text-muted-foreground hover:text-[#028DD0]',
                )}
              >
                {title}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="pt-12">
          <CollectionArchive posts={filtered} />
        </div>
      ) : (
        <p className="container py-16 text-center text-muted-foreground">
          No posts match &ldquo;{activeCategory}&rdquo; yet.
        </p>
      )}
    </div>
  )
}
