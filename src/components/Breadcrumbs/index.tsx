import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React, { Fragment } from 'react'

import { cn } from '@/utilities/ui'
import { getServerSideURL } from '@/utilities/getURL'

export type Crumb = {
  label: string
  href?: string
}

export const Breadcrumbs: React.FC<{ items: Crumb[]; className?: string }> = ({
  items,
  className,
}) => {
  const serverUrl = getServerSideURL()

  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${serverUrl}${item.href}` } : {}),
    })),
  }

  return (
    <nav aria-label="Breadcrumb" className={cn('container mb-6', className)}>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
      />
      {/* Margin, not flex `gap` — see the note in Footer/Component.tsx. */}
      <ol className="flex items-center flex-wrap text-sm text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <Fragment key={index}>
              <li className="mr-2">
                {item.href && !isLast ? (
                  <Link href={item.href} className="hover:text-foreground transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? 'text-foreground font-medium' : undefined}>
                    {item.label}
                  </span>
                )}
              </li>
              {!isLast && (
                <li aria-hidden className="mr-2">
                  <ChevronRight className="h-3.5 w-3.5" />
                </li>
              )}
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
