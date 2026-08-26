'use client'

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, X } from 'lucide-react'

import type { Header as HeaderType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'
import { resolveLinkHref } from '@/utilities/resolveLinkHref'
import {
  GRADIENT_BUTTON,
  NAV_LINK_ACTIVE,
  NAV_LINK_INACTIVE,
  OUTLINE_BUTTON,
  getVisibleDropdownGroups,
} from './navStyles'

/**
 * Hamburger button + accordion menu panel, `md:hidden`. The panel is
 * `absolute inset-x-0 top-full` — it relies on an ANCESTOR (the header's
 * content row in Component.client.tsx) being `relative`, not on a wrapper
 * of its own, so it spans the full header width regardless of where in the
 * row this component sits.
 *
 * CMSLink has no onClick prop, so "close the menu on navigate" is wired via
 * onClick on the wrapping <li> instead — it still fires on a click inside
 * (event bubbling from the inner <a>).
 */
export const MobileNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const pathname = usePathname()

  const navItems = data?.navItems || []
  const { loginLink, signupLink } = data || {}

  const close = () => {
    setIsOpen(false)
    setExpandedIndex(null)
  }

  return (
    <>
      <button
        type="button"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center justify-center rounded-lg p-2 text-[#0F3261]/70 transition-colors hover:bg-black/5 md:hidden"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="absolute inset-x-0 top-full z-20 mt-2 max-h-[75vh] overflow-y-auto rounded-[10px] bg-white p-4 shadow-lg md:hidden">
          <ul className="flex flex-col">
            {navItems.map((item, i) => {
              const groups = getVisibleDropdownGroups(item)
              const isActive = resolveLinkHref(item.link) === pathname

              if (groups.length === 0) {
                return (
                  <li key={i} className="border-b border-gray-100 last:border-0" onClick={close}>
                    <CMSLink
                      className={`block py-3 text-base ${isActive ? NAV_LINK_ACTIVE : NAV_LINK_INACTIVE}`}
                      {...item.link}
                      appearance="link"
                    />
                  </li>
                )
              }

              const expanded = expandedIndex === i

              return (
                <li key={i} className="border-b border-gray-100 last:border-0">
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setExpandedIndex(expanded ? null : i)}
                    className={`flex w-full items-center justify-between py-3 text-base ${NAV_LINK_INACTIVE}`}
                  >
                    <span>{item.link.label}</span>
                    <ChevronDown className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')} />
                  </button>

                  {expanded && (
                    <div className="pb-3 pl-4">
                      {groups.map((group, gi) => (
                        <div key={group.id || gi} className="mb-3 last:mb-0">
                          {group.heading && (
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#0F3261]/60">
                              {group.heading}
                            </p>
                          )}
                          <ul className="flex flex-col">
                            {(group.links || []).map(({ link }, li) => (
                              <li key={li} onClick={close}>
                                <CMSLink
                                  className={`block py-2 text-sm ${NAV_LINK_INACTIVE}`}
                                  {...link}
                                  appearance="link"
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>

          <div className="mt-4 flex flex-col space-y-2 border-t border-gray-100 pt-4">
            <div onClick={close}>
              <CMSLink
                {...loginLink}
                label={loginLink?.label || 'Login'}
                className={`w-full px-7 py-2 text-center ${OUTLINE_BUTTON}`}
                appearance="outline"
              />
            </div>
            <div onClick={close}>
              <CMSLink
                {...signupLink}
                label={signupLink?.label || 'Sign Up'}
                className={`w-full px-7 py-3 text-center ${GRADIENT_BUTTON}`}
                appearance="default"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
