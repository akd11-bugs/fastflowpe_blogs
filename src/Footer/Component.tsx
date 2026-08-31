import { getCachedGlobal } from '@/utilities/getGlobals'
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

import { FooterNewsletter } from './FooterNewsletter'

// Same platform set used in utilities/organizationSchema.ts for the
// Organization JSON-LD `sameAs` list — keep both in sync if a platform is
// added or removed. `x` renders the classic bird glyph (lucide's `Twitter`),
// not the X wordmark icon — the stored platform value/admin label still say
// "X (Twitter)".
const socialIcons = {
  linkedin: Linkedin,
  instagram: Instagram,
  x: Twitter,
  facebook: Facebook,
  youtube: Youtube,
} as const

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()

  const columns = footerData?.columns || []
  const legalLinks = footerData?.legalLinks || []
  const socialLinks = footerData?.socialLinks || []
  const year = new Date().getFullYear()

  return (
    <footer className="relative mt-auto overflow-hidden bg-white text-black">
      {/* Giant low-opacity wordmark bleeding behind the panel — pure CSS, no assets. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 select-none whitespace-nowrap text-center text-[18vw] font-bold leading-none text-black/8"
      >
        FastFlowPe
      </div>

      <div className="relative container pt-40 pb-10">
        {/* Margins instead of flexbox `gap` throughout this file — some
            preview browsers (e.g. VS Code's built-in Simple Browser) don't
            support `gap` on flex containers and silently drop it, fusing
            everything together with zero space. Margins work everywhere. */}
        <div className="rounded-3xl border border-black/10 bg-white/10 backdrop-blur-md text-black p-8 md:p-12 flex flex-col md:flex-row md:justify-between shadow-xl">
          <div className="md:max-w-xs mb-12 md:mb-0">
            <Link className="flex items-center mb-8" href="/">
              <Logo />
            </Link>
            <FooterNewsletter
              heading={footerData?.newsletterHeading}
              description={footerData?.newsletterDescription}
              form={footerData?.newsletterForm}
            />

            {(footerData?.companyName || footerData?.companyAddress || footerData?.cin) && (
              <div className="mt-8">
                <p className="text-xs font-bold uppercase tracking-widest text-black/50 mb-4">
                  Connect with Us
                </p>
                {footerData?.companyName && (
                  <p className="font-bold text-black mb-1">{footerData.companyName}</p>
                )}
                {footerData?.companyAddress && (
                  <p className="whitespace-pre-line text-black/70 mb-4">
                    {footerData.companyAddress}
                  </p>
                )}
                {footerData?.cin && <p className="text-black/70">CIN - {footerData.cin}</p>}
              </div>
            )}

            {socialLinks.length > 0 && (
              <div className="mt-8">
                <p className="text-xs font-bold uppercase tracking-widest text-black/50 mb-4">
                  Follow Us
                </p>
                <div className="flex items-center">
                  {socialLinks.map((social, i) => {
                    const Icon = social.platform ? socialIcons[social.platform] : null
                    if (!Icon || !social.url) return null

                    return (
                      <a
                        key={social.id || i}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.platform}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-black/5 text-black/70 mr-2 last:mr-0 transition-colors hover:border-black/40 hover:text-black"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {columns.length > 0 && (
            <div className="flex flex-wrap">
              {columns.map((column, i) => (
                <div key={column.id || i} className="mr-12 mb-8">
                  <p className="text-xs font-bold uppercase tracking-widest text-black/50 mb-4">
                    {column.title}
                  </p>
                  <nav className="flex flex-col">
                    {(column.navItems || []).map(({ link }, j) => (
                      <CMSLink
                        className="text-black/70 hover:text-black mb-3 last:mb-0"
                        key={j}
                        {...link}
                      />
                    ))}
                  </nav>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-black/10 mt-8 pt-6 flex flex-col-reverse md:flex-row md:items-center md:justify-between text-sm text-black/50">
          <p className="mt-4 md:mt-0">&copy; {year} FastFlowPe. All rights reserved.</p>
          <div className="flex items-start md:items-center">
            {legalLinks.length > 0 && (
              <nav className="flex">
                {legalLinks.map(({ link }, i) => (
                  <CMSLink
                    className="text-black/50 hover:text-black mr-6 last:mr-0"
                    key={i}
                    {...link}
                  />
                ))}
              </nav>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
