import { notFound } from 'next/navigation'
import BuilderPage from '@/components/BuilderPage'

interface PageProps {
  params: {
    path?: string[]
  }
}

export default function Page({ params }: PageProps) {
  // Build the URL path from the dynamic segments
  const urlPath = '/' + (params.path?.join('/') || '')
  
  // Skip Builder.io for specific app routes
  const skipRoutes = ['/auth', '/dashboard', '/api']
  if (skipRoutes.some(route => urlPath.startsWith(route))) {
    notFound()
  }

  // Pass the URL path to the client component
  return <BuilderPage model="page" urlPath={urlPath} />
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