import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { NAV_LINK_INACTIVE, getVisibleDropdownGroups } from '../navStyles'

type NavItem = NonNullable<HeaderType['navItems']>[number]

/**
 * Hover-triggered dropdown, matching fastflowpe.com's Products/Industry nav
 * items: plain CSS group-hover, no click/JS needed on desktop —
 * `invisible`/`opacity-0` rather than `hidden` so the fade transition can
 * run, and the panel sits flush under the trigger (no gap) so the pointer
 * never leaves the hoverable area on the way down to it.
 */
export const DropdownNavItem: React.FC<{ item: NavItem }> = ({ item }) => {
  const groups = getVisibleDropdownGroups(item)

  return (
    <li className="group relative">
      <button type="button" className={`flex items-center gap-1 px-3 py-1 text-base ${NAV_LINK_INACTIVE}`}>
        <span>{item.link.label}</span>
      </button>

      <div
        className="invisible absolute left-0 top-full z-10 flex gap-10 whitespace-nowrap rounded-xl bg-white p-6 opacity-0 shadow-lg transition-[opacity,visibility] duration-150 group-hover:visible group-hover:opacity-100"
      >
        {groups.map((group, i) => (
          <div key={group.id || i}>
            {group.heading && (
              <p className="mb-3 text-sm font-semibold text-[#0F3261]">{group.heading}</p>
            )}
            <nav className="flex flex-col">
              {(group.links || []).map(({ link }, j) => (
                <CMSLink
                  key={j}
                  className={`mb-3 text-sm last:mb-0 ${NAV_LINK_INACTIVE}`}
                  {...link}
                  appearance="link"
                />
              ))}
            </nav>
          </div>
        ))}
      </div>
    </li>
  )
}
