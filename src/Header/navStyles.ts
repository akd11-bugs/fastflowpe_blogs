import type { Header as HeaderType } from '@/payload-types'

/**
 * fastflowpe.com's own brand colors/gradient, replicated exactly (pulled
 * from the live site's computed styles) — not this blog's theme tokens,
 * since the header intentionally matches the main site rather than the
 * blog's own palette. Centralized here because the same values were
 * repeated across Nav/index.tsx, Nav/CTA.tsx, DropdownNavItem.tsx, and
 * MobileNav.tsx.
 */
export const NAV_LINK_ACTIVE = 'font-semibold text-[#028DD0]'
export const NAV_LINK_INACTIVE = 'font-normal text-[#0F3261] transition-colors hover:text-[#028DD0]'
export const BRAND_GRADIENT = 'bg-[linear-gradient(105.97deg,_#028DD0_0%,_#4761E4_100%)]'
export const OUTLINE_BUTTON = 'rounded-[6px] border-[#028DD0] text-[15px] font-semibold text-[#028DD0]'
export const GRADIENT_BUTTON = `rounded-[6px] ${BRAND_GRADIENT} text-[15px] font-semibold text-white shadow-sm`

type NavItem = NonNullable<HeaderType['navItems']>[number]

/** A nav item renders as a dropdown once it has at least one group with links in it. */
export function getVisibleDropdownGroups(item: NavItem) {
  return (item.dropdownGroups || []).filter((group) => (group.links || []).length > 0)
}
