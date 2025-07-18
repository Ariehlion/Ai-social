'use client'

import { BuilderComponent, builder, useIsPreviewing } from '@builder.io/react'
import { useEffect, useState } from 'react'
import { HeroSection, FeatureGrid, PricingSection } from './builder'

interface BuilderPageProps {
  model: string
  content?: any
  urlPath?: string
  apiKey?: string
}

// Initialize Builder.io
if (typeof window !== 'undefined') {
  builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY || '')
}

export default function BuilderPage({ model, content, urlPath, apiKey }: BuilderPageProps) {
  const [builderContent, setBuilderContent] = useState(content)
  const [loading, setLoading] = useState(!content)
  const isPreviewing = useIsPreviewing()

  useEffect(() => {
    if (!content && typeof window !== 'undefined') {
      setLoading(true)
      // Fetch content from Builder.io if not provided
      builder
        .get(model, {
          userAttributes: {
            urlPath: urlPath || window.location.pathname,
          },
        })
        .toPromise()
        .then((fetchedContent) => {
          setBuilderContent(fetchedContent)
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [model, content, urlPath])

  // Show loading state while content is being fetched
  if (loading && !isPreviewing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  // If no Builder.io content found, show fallback page
  if (!builderContent && !isPreviewing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <HeroSection />
        <FeatureGrid />
        <PricingSection />
      </div>
    )
  }

  return (
    <BuilderComponent
      model={model}
      content={builderContent}
      apiKey={apiKey || process.env.NEXT_PUBLIC_BUILDER_API_KEY}
    />
  )
}