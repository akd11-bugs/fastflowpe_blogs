import { cn } from '@/utilities/ui'
import { stringToColor } from '@/utilities/stringToColor'
import { stringToIcon } from '@/utilities/stringToIcon'
import { LayoutGrid } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export type TopicCategory = {
  id: string | number
  slug?: string | null
  title?: string | null
}

export const TopicTabs: React.FC<{
  categories: TopicCategory[]
  activeSlug?: string
}> = ({ categories, activeSlug }) => {
  return (
    <div className="container mb-10">
      <h2 className="text-2xl font-semibold mb-2">Articles by topic</h2>
      <p className="text-muted-foreground mb-6">
        Browse posts by the topics that interest you most.
      </p>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
        <Link
          href="/posts"
          className={cn(
            'shrink-0 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors',
            !activeSlug
              ? 'border-primary bg-secondary'
              : 'border-border hover:bg-secondary/60',
          )}
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
            <LayoutGrid className="h-3.5 w-3.5" />
          </span>
          All
        </Link>
        {categories.map((category) => {
          if (!category.slug) return null
          const isActive = activeSlug === category.slug
          const title = category.title || 'Untitled category'
          const color = stringToColor(title)
          const Icon = stringToIcon(title)

          return (
            <Link
              key={category.id}
              href={`/posts?category=${category.slug}`}
              className={cn(
                'shrink-0 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors',
                isActive ? 'border-primary bg-secondary' : 'border-border hover:bg-secondary/60',
              )}
            >
              <span
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-md',
                  color.bg,
                  color.text,
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              {title}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
