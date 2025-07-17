import { builder } from '@builder.io/react'
import { notFound } from 'next/navigation'
import BuilderPage from '@/components/BuilderPage'

// Initialize Builder.io
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY || '')

interface PageProps {
  params: {
    path?: string[]
  }
}

export default async function Page({ params }: PageProps) {
  // Build the URL path from the dynamic segments
  const urlPath = '/' + (params.path?.join('/') || '')
  
  // Skip Builder.io for specific app routes
  const skipRoutes = ['/auth', '/dashboard', '/api']
  if (skipRoutes.some(route => urlPath.startsWith(route))) {
    notFound()
  }

  // Fetch content from Builder.io
  const content = await builder
    .get('page', {
      userAttributes: {
        urlPath,
      },
    })
    .toPromise()

  // If no content found in Builder.io, show 404
  if (!content) {
    notFound()
  }

  return <BuilderPage model="page" content={content} />
}

// Generate static params for known Builder.io pages
export async function generateStaticParams() {
  // You can add known static paths here
  return [
    { path: [''] }, // Homepage
    { path: ['about'] },
    { path: ['pricing'] },
    { path: ['features'] },
  ]
}