'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'

import { resolveLinkHref } from '@/utilities/resolveLinkHref'
import { NAV_LINK_ACTIVE, NAV_LINK_INACTIVE, getVisibleDropdownGroups } from '../navStyles'

import { DropdownNavItem } from './DropdownNavItem'

/**
 * A sibling of the logo and HeaderCTA in Component.client.tsx, not a
 * wrapper around the CTA buttons — see the note in Nav/CTA.tsx. Hug-sized
 * (inline-flex, not flex-1) so the outer row's `justify-between` divides
 * the leftover space evenly on either side of it.
 *
 * No border/pill around this group — confirmed via direct inspection of
 * the live site's DOM: its nav-items div carries no border or rounded-box
 * classes at all. An earlier version added one based on a blue outline in
 * a Figma screenshot, which turned out to be Figma's own layer-selection
 * indicator, not a real design element.
 *
 * gap-8 (32px) between items: measured each item's own bounding box on
 * the live site — beyond each link's own px-3 padding, there's a uniform
 * 32px gap between one item's right edge and the next item's left edge.
 * Missing this made the whole nav cluster measure 160px narrower (5 gaps
 * × 32px) than the live site at the same viewport width.
 */
export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const pathname = usePathname()

  return (
    <ul className="hidden items-center gap-8 md:flex">
      {navItems.map((item, i) => {
        if (getVisibleDropdownGroups(item).length > 0) return <DropdownNavItem key={i} item={item} />

        const isActive = resolveLinkHref(item.link) === pathname

        return (
          <li key={i}>
            <CMSLink
              className={`flex items-center px-3 py-1 text-base ${isActive ? NAV_LINK_ACTIVE : NAV_LINK_INACTIVE}`}
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
