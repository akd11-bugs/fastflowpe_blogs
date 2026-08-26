'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { ChevronDown, SearchIcon } from 'lucide-react'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
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
            label, which otherwise shows up as a blank button. */}
        <CMSLink
          {...loginLink}
          label={loginLink?.label || 'Login'}
          className="mr-3"
          size="sm"
          appearance="outline"
        />
        {/* Brand blue, not the theme's default bg-primary (near-black) — the
            real site's Sign Up button is a flat brand-blue fill, no
            gradient, no icon. */}
        <CMSLink
          {...signupLink}
          label={signupLink?.label || 'Sign Up'}
          size="sm"
          className="bg-[#028DD0] text-white hover:bg-[#0279b5]"
          appearance="default"
        />
      </div>
    </div>
  )
}
