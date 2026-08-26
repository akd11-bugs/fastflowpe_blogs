import React from 'react'

import { cn } from '@/utilities/ui'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="FastFlowPe - More Than Just Payments"
      width={600}
      height={152}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      // cn (clsx + tailwind-merge), not plain clsx: a caller's className
      // needs to actually override these defaults (e.g. the header uses a
      // different height than the footer), not just concatenate alongside
      // them — plain clsx would leave both the default and the override in
      // the class list with an unpredictable winner. No max-w/w-full cap:
      // with a fixed height and object-contain, the image's own aspect
      // ratio already determines its width.
      className={cn('h-10 w-auto object-contain object-left', className)}
      src="/logo-header.png"
    />
  )
}
