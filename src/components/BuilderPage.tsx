'use client'

import { BuilderComponent, builder, useIsPreviewing } from '@builder.io/react'
import { useEffect, useState } from 'react'

interface BuilderPageProps {
  model: string
  content?: any
  apiKey?: string
}

// Initialize Builder.io
if (typeof window !== 'undefined') {
  builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY || '')
}

export default function BuilderPage({ model, content, apiKey }: BuilderPageProps) {
  const [builderContent, setBuilderContent] = useState(content)
  const isPreviewing = useIsPreviewing()

  useEffect(() => {
    if (!content && typeof window !== 'undefined') {
      // Fetch content from Builder.io if not provided
      builder
        .get(model, {
          userAttributes: {
            urlPath: window.location.pathname,
          },
        })
        .toPromise()
        .then((content) => {
          setBuilderContent(content)
        })
    }
  }, [model, content])

  // Show loading state while content is being fetched
  if (!builderContent && !isPreviewing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
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