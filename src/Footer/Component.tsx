import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

import { FooterNewsletter } from './FooterNewsletter'

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()

  const columns = footerData?.columns || []
  const legalLinks = footerData?.legalLinks || []
  const year = new Date().getFullYear()

  return (
    <footer className="relative mt-auto overflow-hidden bg-black text-white">
      {/* Giant low-opacity wordmark bleeding behind the panel — pure CSS, no assets. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 select-none whitespace-nowrap text-center text-[18vw] font-bold leading-none text-white/5"
      >
        FastFlowPe
      </div>

      <div className="relative container pt-40 pb-10">
        {/* Margins instead of flexbox `gap` throughout this file — some
            preview browsers (e.g. VS Code's built-in Simple Browser) don't
            support `gap` on flex containers and silently drop it, fusing
            everything together with zero space. Margins work everywhere. */}
        <div className="rounded-3xl border-2 border-white/10 bg-white/[0.03] p-8 md:p-12 flex flex-col md:flex-row md:justify-between">
          <div className="md:max-w-xs mb-12 md:mb-0">
            <Link className="flex items-center mb-8" href="/">
              <Logo />
            </Link>
            <FooterNewsletter
              heading={footerData?.newsletterHeading}
              description={footerData?.newsletterDescription}
              form={footerData?.newsletterForm}
            />
          </div>

          {columns.length > 0 && (
            <div className="flex flex-wrap">
              {columns.map((column, i) => (
                <div key={column.id || i} className="mr-12 mb-8">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">
                    {column.title}
                  </p>
                  <nav className="flex flex-col">
                    {(column.navItems || []).map(({ link }, j) => (
                      <CMSLink
                        className="text-white/70 hover:text-white mb-3 last:mb-0"
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

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col-reverse md:flex-row md:items-center md:justify-between text-sm text-white/50">
          <p className="mt-4 md:mt-0">&copy; {year} FastFlowPe. All rights reserved.</p>
          <div className="flex items-start md:items-center">
            {legalLinks.length > 0 && (
              <nav className="flex">
                {legalLinks.map(({ link }, i) => (
                  <CMSLink
                    className="text-white/50 hover:text-white mr-6 last:mr-0"
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
