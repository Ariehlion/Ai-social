'use client'

import { Builder } from '@builder.io/react'

interface HeroSectionProps {
  title?: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
  backgroundImage?: string
}

function HeroSection({
  title = 'AI Social Content Generator',
  subtitle = 'Transform your blog articles into engaging social media posts',
  ctaText = 'Get Started',
  ctaLink = '/auth',
  backgroundImage = ''
}: HeroSectionProps) {
  return (
    <div 
      className="hero min-h-screen bg-gradient-to-r from-primary to-secondary"
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
    >
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">{title}</h1>
          <p className="mb-5">{subtitle}</p>
          <a href={ctaLink} className="btn btn-primary">
            {ctaText}
          </a>
        </div>
      </div>
    </div>
  )
}

// Register the component with Builder.io
Builder.registerComponent(HeroSection, {
  name: 'HeroSection',
  friendlyName: 'Hero Section',
  inputs: [
    {
      name: 'title',
      type: 'string',
      defaultValue: 'AI Social Content Generator',
    },
    {
      name: 'subtitle',
      type: 'string',
      defaultValue: 'Transform your blog articles into engaging social media posts',
    },
    {
      name: 'ctaText',
      type: 'string',
      defaultValue: 'Get Started',
    },
    {
      name: 'ctaLink',
      type: 'url',
      defaultValue: '/auth',
    },
    {
      name: 'backgroundImage',
      type: 'file',
      allowedFileTypes: ['jpeg', 'jpg', 'png', 'svg'],
    },
  ],
})

export default HeroSection