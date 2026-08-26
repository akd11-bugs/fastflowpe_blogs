import { getCachedGlobal } from '@/utilities/getGlobals'
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

// Same platform set used in utilities/organizationSchema.ts for the
// Organization JSON-LD `sameAs` list — keep both in sync if a platform is
// added or removed. `x` renders the classic bird glyph (lucide's `Twitter`),
// not the X wordmark icon — matches the reference design, even though the
// stored platform value/admin label still say "X (Twitter)".
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
  const socialLinks = footerData?.socialLinks || []
  const year = new Date().getFullYear()

  return (
    // Flat light-gray panel, not the previous black bordered card — matches
    // the reference design. bg-muted/text-foreground (not hardcoded gray
    // hex) so this still adapts under dark mode via the existing
    // [data-theme='dark'] token overrides in globals.css.
    <footer className="mt-auto bg-muted text-foreground">
      {/* Margins instead of flexbox `gap` throughout this file — some
          preview browsers (e.g. VS Code's built-in Simple Browser) don't
          support `gap` on flex containers and silently drop it, fusing
          everything together with zero space. Margins work everywhere. */}
      <div className="container flex flex-col justify-between py-16 lg:flex-row">
        <div className="mb-12 lg:mb-0 lg:mr-16 lg:max-w-xs">
          <Link className="flex items-center mb-8" href="/">
            <Logo />
          </Link>

          {(footerData?.companyName || footerData?.companyAddress || footerData?.cin) && (
            <div>
              <p className="font-bold text-foreground mb-4">Connect with Us</p>
              {footerData?.companyName && (
                <p className="text-sm text-muted-foreground">{footerData.companyName}</p>
              )}
              {footerData?.companyAddress && (
                <p className="whitespace-pre-line text-sm text-muted-foreground">
                  {footerData.companyAddress}
                </p>
              )}
              {footerData?.cin && (
                <p className="text-sm text-muted-foreground">CIN - {footerData.cin}</p>
              )}
            </div>
          )}

          {socialLinks.length > 0 && (
            <div className="mt-8">
              <p className="font-bold text-foreground mb-4">Follow Us</p>
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
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-foreground mr-2 last:mr-0 shadow-sm transition-colors hover:bg-accent"
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
              <div key={column.id || i} className="mr-16 mb-10 last:mr-0">
                <p className="font-bold text-foreground mb-4">{column.title}</p>
                <nav className="flex flex-col">
                  {(column.navItems || []).map(({ link }, j) => (
                    <CMSLink
                      className="text-sm text-muted-foreground hover:text-foreground mb-3 last:mb-0"
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

      <div className="container border-t border-border py-6">
        <p className="text-sm text-muted-foreground">
          {year} &copy; {footerData?.companyName || 'FastFlowPe'}
        </p>
      </div>
    </footer>
  )
}
