'use client'

import { Check, Copy, Linkedin, X as XIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

import { cn } from '@/utilities/ui'
import { stringToColor } from '@/utilities/stringToColor'

type Category = {
  id: string
  title: string
  slug?: string | null
}

type HighlightPost = {
  slug: string
  title: string
}

const sectionLabel = 'text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4'
const sectionBox = 'border-2 border-border rounded-2xl bg-card p-6'

export const PostSidebar: React.FC<{
  categories: Category[]
  highlights: HighlightPost[]
  title: string
  url: string
}> = ({ categories, highlights, title, url }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access can fail (permissions, insecure context) — the
      // button just stays in its normal state rather than throwing.
    }
  }

  const shareLinks = [
    {
      label: 'Share on X',
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      Icon: XIcon,
    },
    {
      label: 'Share on LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      Icon: Linkedin,
    },
  ]

  return (
    // space-y, not flex `gap` — see the note in Footer/Component.tsx.
    <div className="flex flex-col space-y-6">
      <div className={sectionBox}>
        <p className={sectionLabel}>Share</p>
        {/* space-x, not flex `gap` — see the note in Footer/Component.tsx. */}
        <div className="flex items-center space-x-2">
          {shareLinks.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy link"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {categories.length > 0 && (
        <div className={sectionBox}>
          <p className={sectionLabel}>Categories</p>
          <div className="flex flex-wrap">
            {/* Plain tags, not filter links — there's no per-category listing
                page (the blog IS the homepage, and its Archive block shows a
                fixed admin-picked set, not a query-string-driven filter). */}
            {categories.map((category) => {
              const color = stringToColor(category.title)
              return (
                <span
                  key={category.id}
                  className={cn(
                    'mr-2 mb-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide',
                    color.solidBg,
                    color.solidText,
                  )}
                >
                  {category.title}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {highlights.length > 0 && (
        <div className={sectionBox}>
          <p className={sectionLabel}>Blog Highlights</p>
          {/* space-y, not flex `gap` — see the note in Footer/Component.tsx. */}
          <ul className="flex flex-col space-y-3">
            {highlights.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/posts/${post.slug}`}
                  className="text-sm font-medium text-foreground hover:text-primary underline-offset-4 hover:underline transition-colors"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
