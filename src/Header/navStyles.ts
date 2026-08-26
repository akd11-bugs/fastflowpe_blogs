import type { Header as HeaderType } from '@/payload-types'

/**
 * fastflowpe.com's own brand colors/gradient, replicated exactly (pulled
 * from the live site's computed styles) — not this blog's theme tokens,
 * since the header intentionally matches the main site rather than the
 * blog's own palette. Centralized here because the same values were
 * repeated across Nav/index.tsx, Nav/CTA.tsx, DropdownNavItem.tsx, and
 * MobileNav.tsx.
 *
 * #008DD2 (not #028DD0) for text/border/active-nav-color — measured via
 * getComputedStyle on the live site's Home link and Login button
 * (rgb(0, 141, 210)). #028DD0 is a real, different color the live site
 * uses only as the gradient's start stop — the two are one digit apart
 * and easy to conflate, but they're not interchangeable there.
 */
export const NAV_LINK_ACTIVE = 'font-semibold text-[#008DD2]'
export const NAV_LINK_INACTIVE = 'font-normal text-[#0F3261] transition-colors hover:text-[#008DD2]'
export const BRAND_GRADIENT = 'bg-[linear-gradient(105.97deg,_#028DD0_0%,_#4761E4_100%)]'
// bg-transparent overrides the outline Button variant's own bg-background
// (live site's outline button has no fill at all); border (1px) overrides
// its border-2 (live measures border: 1px solid). h-[47px] on both: with
// identical padding/border/line-height, Login still measures 6px shorter
// than Sign Up on the live site (something in its layout stretches it to
// match — not worth reverse-engineering), so both get the same explicit
// height directly instead of relying on natural sizing to agree.
// hover:text-[#008DD2] overrides the outline variant's own
// hover:text-accent-foreground, which otherwise turns the label dark on
// hover instead of keeping the brand blue.
export const OUTLINE_BUTTON =
  'h-[47px] rounded-[6px] border bg-transparent border-[#008DD2] text-[15px] font-semibold text-[#008DD2] hover:text-[#008DD2]'
export const GRADIENT_BUTTON = `h-[47px] rounded-[6px] ${BRAND_GRADIENT} text-[15px] font-semibold text-white shadow-sm`

type NavItem = NonNullable<HeaderType['navItems']>[number]

/** A nav item renders as a dropdown once it has at least one group with links in it. */
export function getVisibleDropdownGroups(item: NavItem) {
  return (item.dropdownGroups || []).filter((group) => (group.links || []).length > 0)
}
