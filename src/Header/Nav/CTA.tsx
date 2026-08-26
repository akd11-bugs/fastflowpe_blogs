import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { ArrowRight, SearchIcon } from 'lucide-react'

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
      <CMSLink
        {...loginLink}
        label={loginLink?.label || 'Login'}
        className="mr-3 rounded-[6px] border-[#028DD0] px-7 py-2 text-[15px] font-semibold text-[#028DD0] hover:bg-[#028DD0]/5"
        appearance="outline"
      />
      {/* Exact gradient + arrow from the live site, not a generic Tailwind
          blue — this specific angle/stop pair is the brand's actual CTA
          treatment. */}
      <CMSLink
        {...signupLink}
        label={signupLink?.label || 'Sign Up'}
        className="rounded-[6px] bg-[linear-gradient(105.97deg,_#028DD0_0%,_#4761E4_100%)] px-7 py-3 text-[15px] font-semibold text-white shadow-sm hover:-translate-y-0 hover:opacity-90 hover:shadow-sm"
        appearance="default"
      >
        <ArrowRight className="h-5 w-5" />
      </CMSLink>
    </div>
  )
}
