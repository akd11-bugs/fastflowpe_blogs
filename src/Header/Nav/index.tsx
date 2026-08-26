'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'

import { resolveLinkHref } from '@/utilities/resolveLinkHref'

import { DropdownNavItem } from './DropdownNavItem'

/**
 * A sibling of the logo and HeaderCTA in Component.client.tsx, not a
 * wrapper around the CTA buttons — see the note in Nav/CTA.tsx. Hug-sized
 * (inline-flex, not flex-1), matching the Figma spec: the nav items sit in
 * their own bordered pill rather than spreading flat across the header
 * bar. The outer row's `justify-between` still divides the leftover space
 * evenly on either side of this pill, same as before.
 */
export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const pathname = usePathname()

  return (
    <div className="hidden items-center rounded-full border border-gray-200 px-2 py-1 md:flex">
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
    </div>
  )
}
