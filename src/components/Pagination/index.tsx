import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/utilities/ui'
import React from 'react'

const buildHref = (pageNum: number, categorySlug?: string) => {
  const path = pageNum === 1 ? '/posts' : `/posts/page/${pageNum}`
  return categorySlug ? `${path}?category=${categorySlug}` : path
}

export const Pagination: React.FC<{
  className?: string
  page: number
  totalPages: number
  categorySlug?: string
}> = (props) => {
  const { className, page, totalPages, categorySlug } = props
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  const hasExtraPrevPages = page - 1 > 1
  const hasExtraNextPages = page + 1 < totalPages

  return (
    <div className={cn('my-12', className)}>
      <PaginationComponent>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              aria-disabled={!hasPrevPage}
              href={buildHref(hasPrevPage ? page - 1 : page, categorySlug)}
              className={!hasPrevPage ? 'pointer-events-none opacity-50' : undefined}
            />
          </PaginationItem>

          {hasExtraPrevPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {hasPrevPage && (
            <PaginationItem>
              <PaginationLink href={buildHref(page - 1, categorySlug)}>{page - 1}</PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink isActive href={buildHref(page, categorySlug)}>
              {page}
            </PaginationLink>
          </PaginationItem>

          {hasNextPage && (
            <PaginationItem>
              <PaginationLink href={buildHref(page + 1, categorySlug)}>{page + 1}</PaginationLink>
            </PaginationItem>
          )}

          {hasExtraNextPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              aria-disabled={!hasNextPage}
              href={buildHref(hasNextPage ? page + 1 : page, categorySlug)}
              className={!hasNextPage ? 'pointer-events-none opacity-50' : undefined}
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationComponent>
    </div>
  )
}
