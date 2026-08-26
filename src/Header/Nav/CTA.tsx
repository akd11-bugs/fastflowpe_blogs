import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { ArrowRight, SearchIcon } from 'lucide-react'

import { GRADIENT_BUTTON, OUTLINE_BUTTON } from '../navStyles'

/** Search icon + Login/Sign Up — see the note in Nav/index.tsx on why this
 * is a sibling of HeaderNav rather than nested inside it. */
export const HeaderCTA: React.FC<{ data: HeaderType }> = ({ data }) => {
  const { loginLink, signupLink } = data || {}

  return (
    <div className="hidden items-center md:flex">
      <Link href="/search" className="flex items-center mr-4" aria-label="Search">
        <SearchIcon className="w-5 text-[#0F3261]/60 hover:text-[#0F3261]" />
      </Link>
      {/* CMSLink itself returns null when no URL/reference is configured
          yet in the admin — no extra guard here. The label fallback below
          is separate: a URL can be set without a label (the admin field
          isn't blocking on it), and CMSLink renders nothing for a blank
          label, which otherwise shows up as a blank button. */}
      {/* size="clear" on both: the default Button size variant forces
          h-10 (fixed height, live measures a natural ~47px from padding
          alone) and, once an icon child is present, a `has-[>svg]:px-3`
          rule whose :has() selector out-specificities a plain px-7 class
          regardless of source order — collapsing the Sign Up button's
          padding to 12px on every side instead of the intended 12px 28px.
          size="clear" applies neither, leaving only this className's own
          padding in effect. */}
      <CMSLink
        {...loginLink}
        label={loginLink?.label || 'Login'}
        size="clear"
        className={`mr-3 px-7 py-2 hover:bg-[#008DD2]/5 ${OUTLINE_BUTTON}`}
        appearance="outline"
      />
      <CMSLink
        {...signupLink}
        label={signupLink?.label || 'Sign Up'}
        size="clear"
        className={`px-7 py-3 hover:-translate-y-0 hover:opacity-90 hover:shadow-sm ${GRADIENT_BUTTON}`}
        appearance="default"
      >
        <ArrowRight className="h-5 w-5" />
      </CMSLink>
    </div>
  )
}
