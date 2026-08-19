import type { Metadata } from 'next/types'

import React from 'react'
import PageClient from './page.client'
import { PostsListing } from '@/components/PostsListing'

export const revalidate = 600

type Args = {
  searchParams: Promise<{
    category?: string
  }>
}

export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { category } = await searchParamsPromise

  return (
    <>
      <PageClient />
      <PostsListing page={1} categorySlug={category} />
    </>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `FastFlowPe Blog | Posts`,
  }
}
