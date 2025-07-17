import { builder } from '@builder.io/react'

// Initialize Builder.io with your API key
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY || '')

// Optional: Set up custom targeting attributes for personalization
// builder.setUserAttributes({
//   userType: 'free' | 'pro',
//   // Add other user attributes as needed
// })

export { builder }