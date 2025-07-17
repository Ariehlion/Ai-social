'use client'

import { Builder } from '@builder.io/react'

interface Feature {
  icon?: string
  title?: string
  description?: string
}

interface FeatureGridProps {
  features?: Feature[]
  title?: string
  subtitle?: string
}

function FeatureGrid({
  features = [
    {
      icon: '🤖',
      title: 'AI-Powered',
      description: 'Generate content using advanced AI technology'
    },
    {
      icon: '📱',
      title: 'Multi-Platform',
      description: 'Create posts for Twitter, LinkedIn, Instagram, and Facebook'
    },
    {
      icon: '⚡',
      title: 'Fast & Easy',
      description: 'Generate multiple post variations in seconds'
    }
  ],
  title = 'Why Choose Our Platform?',
  subtitle = 'Everything you need to create engaging social media content'
}: FeatureGridProps) {
  return (
    <section className="py-20 bg-base-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">{title}</h2>
          <p className="text-xl text-base-content/70">{subtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card bg-base-200 shadow-lg">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="card-title justify-center text-xl mb-2">
                  {feature.title}
                </h3>
                <p className="text-base-content/70">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Register the component with Builder.io
Builder.registerComponent(FeatureGrid, {
  name: 'FeatureGrid',
  friendlyName: 'Feature Grid',
  inputs: [
    {
      name: 'title',
      type: 'string',
      defaultValue: 'Why Choose Our Platform?',
    },
    {
      name: 'subtitle',
      type: 'string',
      defaultValue: 'Everything you need to create engaging social media content',
    },
    {
      name: 'features',
      type: 'list',
      subFields: [
        {
          name: 'icon',
          type: 'string',
          defaultValue: '🤖',
        },
        {
          name: 'title',
          type: 'string',
          defaultValue: 'Feature Title',
        },
        {
          name: 'description',
          type: 'string',
          defaultValue: 'Feature description goes here',
        },
      ],
    },
  ],
})

export default FeatureGrid