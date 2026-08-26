'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { ArrowRight, SearchIcon } from 'lucide-react'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const { loginLink, signupLink } = data || {}

  return (
    <div className="hidden flex-1 items-center justify-between md:flex">
      <nav className="flex items-center">
        {navItems.map(({ link }, i) => {
          return (
            <CMSLink
              className="mr-6 text-sm font-medium text-foreground/70 hover:text-foreground"
              key={i}
              {...link}
              appearance="link"
            />
          )
        })}
      </nav>
      <div className="flex items-center">
        <Link href="/search" className="flex items-center mr-4" aria-label="Search">
          <SearchIcon className="w-5 text-muted-foreground hover:text-foreground" />
        </Link>
        {/* CMSLink itself returns null when no URL/reference is configured
            yet in the admin — no extra guard needed here. */}
        <CMSLink {...loginLink} className="mr-3" size="sm" appearance="outline" />
        <CMSLink {...signupLink} size="sm" appearance="default">
          <ArrowRight className="h-4 w-4" />
        </CMSLink>
      </div>
    </div>
  )
}
