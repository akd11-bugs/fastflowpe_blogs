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
      <div className="border-y border-border bg-muted/40">
        <div className="container flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
          <nav aria-label="Filter posts by topic" className="flex flex-wrap gap-x-6 gap-y-2">
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className={cn(
                'text-sm font-medium pb-1 border-b-2 transition-colors',
                activeCategory === null
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
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
                  'text-sm font-medium pb-1 border-b-2 transition-colors',
                  activeCategory === title
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground',
                )}
              >
                {title}
              </button>
            ))}
          </nav>

          <div className="relative w-full md:w-64">
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
      </div>

      {filtered.length > 0 ? (
        <div className="pt-10">
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
