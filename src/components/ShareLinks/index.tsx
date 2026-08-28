'use client'

import { Check, Copy, Linkedin, X as XIcon } from 'lucide-react'
import React, { useState } from 'react'

/**
 * Share-icon row (X, LinkedIn, copy-link) — sits directly under the post
 * title, above the hero image. Extracted from PostSidebar, which used to
 * box this in its own "Share" card in the sidebar; no card wrapper here,
 * it's rendered inline under the heading instead.
 */
export const ShareLinks: React.FC<{ url: string; title: string }> = ({ url, title }) => {
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
    // space-x, not flex `gap` — see the note in Footer/Component.tsx.
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
  )
}
