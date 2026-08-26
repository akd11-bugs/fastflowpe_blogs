'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'

import { resolveLinkHref } from '@/utilities/resolveLinkHref'

import { DropdownNavItem } from './DropdownNavItem'

/**
 * Just the link list — a sibling of the logo and HeaderCTA in
 * Component.client.tsx, not a wrapper around the CTA buttons. Nesting them
 * together previously meant the outer row's own `justify-between` only had
 * two children (logo, and this-plus-CTA), which swallowed all the leftover
 * space into one gap right before the CTA buttons, leaving the nav items
 * bunched up against the logo. Three true siblings under one
 * `justify-between` — matching the live site's actual DOM structure —
 * distributes the gap evenly instead.
 */
export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const pathname = usePathname()

  return (
    <ul className="hidden items-center md:flex">
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
  )
}
