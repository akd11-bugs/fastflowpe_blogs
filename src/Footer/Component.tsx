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
        <div className="rounded-3xl border-2 border-white/10 bg-white/[0.03] p-8 md:p-12 flex flex-col gap-12 md:flex-row md:justify-between">
          <div className="md:max-w-xs">
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
            <div className="flex flex-wrap gap-12">
              {columns.map((column, i) => (
                <div key={column.id || i}>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">
                    {column.title}
                  </p>
                  <nav className="flex flex-col gap-3">
                    {(column.navItems || []).map(({ link }, j) => (
                      <CMSLink className="text-white/70 hover:text-white" key={j} {...link} />
                    ))}
                  </nav>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col-reverse gap-4 md:flex-row md:items-center md:justify-between text-sm text-white/50">
          <p>
            &copy; {year} FastFlowPe. All rights reserved.
          </p>
          <div className="flex flex-col-reverse items-start gap-4 md:flex-row md:items-center">
            {legalLinks.length > 0 && (
              <nav className="flex gap-6">
                {legalLinks.map(({ link }, i) => (
                  <CMSLink className="text-white/50 hover:text-white" key={i} {...link} />
                ))}
              </nav>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
