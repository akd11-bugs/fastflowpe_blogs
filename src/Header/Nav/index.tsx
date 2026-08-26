'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, ChevronDown, SearchIcon } from 'lucide-react'

import { resolveLinkHref } from '@/utilities/resolveLinkHref'

import { DropdownNavItem } from './DropdownNavItem'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const { loginLink, signupLink } = data || {}
  const pathname = usePathname()

  return (
    <div className="hidden flex-1 items-center justify-between md:flex">
      <ul className="flex items-center">
        {navItems.map((item, i) => {
          const hasDropdown = (item.dropdownGroups || []).some((group) => (group.links || []).length > 0)
          if (hasDropdown) return <DropdownNavItem key={i} item={item} />

          const isActive = resolveLinkHref(item.link) === pathname

          return (
            <li key={i}>
              <CMSLink
                className={
                  isActive
                    ? 'flex items-center px-3 py-1 text-base font-semibold text-[#028DD0]'
                    : 'flex items-center px-3 py-1 text-base font-normal text-[#0F3261] transition-colors hover:text-[#028DD0]'
                }
                {...item.link}
                appearance="link"
              >
                {item.showChevron && <ChevronDown className="ml-1 h-3.5 w-3.5" />}
              </CMSLink>
            </li>
          )
        })}
      </ul>

      <div className="flex items-center">
        <Link href="/search" className="flex items-center mr-4" aria-label="Search">
          <SearchIcon className="w-5 text-[#0F3261]/60 hover:text-[#0F3261]" />
        </Link>
        {/* CMSLink itself returns null when no URL/reference is configured
            yet in the admin — no extra guard here. The label fallback below
            is separate: a URL can be set without a label (the admin field
            isn't blocking on it), and CMSLink renders nothing for a blank
            label, which otherwise shows up as a blank button. */}
        <CMSLink
          {...loginLink}
          label={loginLink?.label || 'Login'}
          className="mr-3 rounded-[6px] border-[#028DD0] px-7 py-2 text-[15px] font-semibold text-[#028DD0] hover:bg-[#028DD0]/5"
          appearance="outline"
        />
        {/* Exact gradient + arrow from the live site, not a generic
            Tailwind blue — this specific angle/stop pair is the brand's
            actual CTA treatment. */}
        <CMSLink
          {...signupLink}
          label={signupLink?.label || 'Sign Up'}
          className="rounded-[6px] bg-[linear-gradient(105.97deg,_#028DD0_0%,_#4761E4_100%)] px-7 py-3 text-[15px] font-semibold text-white shadow-sm hover:-translate-y-0 hover:opacity-90 hover:shadow-sm"
          appearance="default"
        >
          <ArrowRight className="h-5 w-5" />
        </CMSLink>
      </div>
    </div>
  )
}
