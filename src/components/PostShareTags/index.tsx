'use client'

import { Check, Copy, Linkedin, X as XIcon } from 'lucide-react'
import React, { useState } from 'react'

import { cn } from '@/utilities/ui'
import { stringToColor } from '@/utilities/stringToColor'

type Category = {
  id: string
  title: string
  slug?: string | null
}

/**
 * End-of-article footer: topic tags (styled like the category badges on
 * /posts cards, so a reader recognizes them as the same taxonomy) plus
 * share links and a copy-link button.
 *
 * `url` is passed in from the server (the post's canonical permalink) rather
 * than read from `window.location` here — correct behind any future proxy,
 * preview, or trailing-slash redirect, and avoids a client-only value that
 * would differ between server and client render.
 */
export const PostShareTags: React.FC<{
  categories: Category[]
  title: string
  url: string
}> = ({ categories, title, url }) => {
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
    <div className="flex flex-col gap-6 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {/* Plain tags, not filter links — there's no per-category listing
              page anymore for them to point at (the blog IS the homepage, and
              its Archive block shows a fixed admin-picked set, not a
              query-string-driven filter). */}
          {categories.map((category) => {
            const color = stringToColor(category.title)
            return (
              <span
                key={category.id}
                className={cn(
                  'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide transition-opacity hover:opacity-80',
                  color.solidBg,
                  color.solidText,
                )}
              >
                {category.title}
              </span>
            )
          })}
        </div>
      )}

      <div className="flex items-center gap-2">
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
          className="flex h-9 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy link'}
        </button>
      </div>
    </div>
  )
}
