'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { ArrowRight, ChevronDown, SearchIcon } from 'lucide-react'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  // Repurposed, not renamed: `loginLink` now renders as the plain text link
  // (e.g. "Sign Up") and `signupLink` as the filled gradient CTA (e.g.
  // "Book a demo") — see the admin-facing labels/descriptions in
  // Header/config.ts for why the field names don't match their content.
  const { loginLink, signupLink } = data || {}

  return (
    <div className="hidden flex-1 items-center justify-between md:flex">
      <nav className="flex items-center">
        {navItems.map(({ link, showChevron }, i) => {
          return (
            <CMSLink
              className="mr-6 flex items-center text-sm font-medium text-foreground/70 hover:text-foreground"
              key={i}
              {...link}
              appearance="link"
            >
              {/* Visual only — no dropdown panel behind it yet, see the
                  admin field's description. */}
              {showChevron && <ChevronDown className="ml-1 h-3.5 w-3.5" />}
            </CMSLink>
          )
        })}
      </nav>
      <div className="flex items-center">
        <Link href="/search" className="flex items-center mr-4" aria-label="Search">
          <SearchIcon className="w-5 text-muted-foreground hover:text-foreground" />
        </Link>
        {/* CMSLink itself returns null when no URL/reference is configured
            yet in the admin — no extra guard here. The label fallback below
            is separate: a URL can be set without a label (the admin field
            isn't blocking on it), and CMSLink renders nothing for a blank
            label, which otherwise shows up as a blank button/link. */}
        <CMSLink
          {...loginLink}
          label={loginLink?.label || 'Sign Up'}
          className="mr-6 text-sm font-medium text-foreground/70 hover:text-foreground"
          appearance="link"
        />
        {/* Custom gradient, not the theme's default bg-primary (near-black)
            — the reference design calls for a blue-to-indigo CTA
            specifically for this button, not the site's neutral primary
            color. hover:shadow-none/-translate-y-0 cancel the base Button
            variant's hover lift/shadow, which read oddly against a
            gradient fill. */}
        <CMSLink
          {...signupLink}
          label={signupLink?.label || 'Book a demo'}
          size="sm"
          className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:-translate-y-0 hover:shadow-none hover:opacity-90"
          appearance="default"
        >
          <ArrowRight className="h-4 w-4" />
        </CMSLink>
      </div>
    </div>
  )
}
