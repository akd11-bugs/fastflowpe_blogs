'use client'

import { Search } from 'lucide-react'
import React, { useMemo, useState } from 'react'

import type { CardPostData } from '@/components/Card'

import { CollectionArchive } from '@/components/CollectionArchive'
import { cn } from '@/utilities/ui'

/**
 * Category tabs + a search box, filtering the post grid client-side.
 *
 * Client-side rather than URL-searchParams-driven on purpose: the Archive
 * block already fetches its full pool server-side (limit 50 today), so
 * refiltering an array already in the browser is instant and needs no
 * server round-trip per keystroke or tab click. Tabs are derived from the
 * CATEGORIES ACTUALLY PRESENT in that fetched pool, not a separately
 * queried full category list — a tab for a category with zero posts in the
 * pool is a dead end, not a feature.
 */
export const PostsExplorer: React.FC<{ posts: CardPostData[] }> = ({ posts }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [query, setQuery] = useState('')

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
    const q = query.trim().toLowerCase()
    return posts.filter((post) => {
      const matchesCategory =
        !activeCategory ||
        (post.categories || []).some(
          (category) => typeof category === 'object' && category?.title === activeCategory,
        )
      const matchesQuery =
        !q ||
        post.title?.toLowerCase().includes(q) ||
        post.meta?.description?.toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [posts, activeCategory, query])

  return (
    <div>
      <div className="container py-8">
        {/* Pills, not underlined text — each tab carries its own background,
            so it reads as a distinct chip even if the margin between two
            pills ever renders thinner than intended (a WebView that drops
            unsupported CSS silently, a font substitution, anything). A run
            of plain underlined words has no such fallback: if the space
            between them collapses, "All posts" and "Design" fuse into one
            unreadable run. Pills can't do that — there's always a visible
            edge between two different button backgrounds.
            Padding, not margin, provides most of the breathing room here,
            which is also why this reads calmer than the previous text row. */}
        <nav aria-label="Filter posts by topic" className="flex flex-wrap">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={cn(
              'mr-2 mb-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              activeCategory === null
                ? 'bg-foreground text-background'
                : 'bg-muted text-muted-foreground hover:bg-muted/70',
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
                'mr-2 mb-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                activeCategory === title
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:bg-muted/70',
              )}
            >
              {title}
            </button>
          ))}
        </nav>

        <div className="relative mt-4 w-full md:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            aria-label="Search articles"
            className="w-full rounded-full border border-border bg-background py-2 pl-9 pr-4 text-sm outline-none transition-colors focus:border-foreground"
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="pt-6">
          <CollectionArchive posts={filtered} />
        </div>
      ) : (
        <p className="container py-16 text-center text-muted-foreground">
          No posts match &ldquo;{query || activeCategory}&rdquo; yet.
        </p>
      )}
    </div>
  )
}
