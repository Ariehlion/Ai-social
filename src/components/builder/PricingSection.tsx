'use client'

import { Builder } from '@builder.io/react'

interface PricingPlan {
  name?: string
  price?: string
  features?: string[]
  ctaText?: string
  ctaLink?: string
  popular?: boolean
}

interface PricingSectionProps {
  title?: string
  subtitle?: string
  plans?: PricingPlan[]
}

function PricingSection({
  title = 'Choose Your Plan',
  subtitle = 'Start free, upgrade when you need more',
  plans = [
    {
      name: 'Free',
      price: '$0',
      features: ['5 generations per day', 'Basic templates', 'Standard support'],
      ctaText: 'Get Started',
      ctaLink: '/auth',
      popular: false
    },
    {
      name: 'Pro',
      price: '$9.99',
      features: ['50 generations per day', 'Premium templates', 'Priority support', 'Analytics'],
      ctaText: 'Upgrade Now',
      ctaLink: '/upgrade',
      popular: true
    }
  ]
}: PricingSectionProps) {
  return (
    <section className="py-20 bg-base-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">{title}</h2>
          <p className="text-xl text-base-content/70">{subtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`card shadow-lg ${plan.popular ? 'bg-primary text-primary-content' : 'bg-base-100'}`}
            >
              {plan.popular && (
                <div className="badge badge-secondary absolute top-4 right-4">
                  Popular
                </div>
              )}
              <div className="card-body">
                <h3 className="card-title text-2xl">{plan.name}</h3>
                <div className="text-3xl font-bold mb-4">
                  {plan.price}
                  <span className="text-sm font-normal">/month</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features?.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="card-actions">
                  <a 
                    href={plan.ctaLink} 
                    className={`btn w-full ${plan.popular ? 'btn-secondary' : 'btn-primary'}`}
                  >
                    {plan.ctaText}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Register the component with Builder.io
Builder.registerComponent(PricingSection, {
  name: 'PricingSection',
  friendlyName: 'Pricing Section',
  inputs: [
    {
      name: 'title',
      type: 'string',
      defaultValue: 'Choose Your Plan',
    },
    {
      name: 'subtitle',
      type: 'string',
      defaultValue: 'Start free, upgrade when you need more',
    },
    {
      name: 'plans',
      type: 'list',
      subFields: [
        {
          name: 'name',
          type: 'string',
          defaultValue: 'Plan Name',
        },
        {
          name: 'price',
          type: 'string',
          defaultValue: '$0',
        },
        {
          name: 'features',
          type: 'list',
          subFields: [
            {
              name: 'feature',
              type: 'string',
            }
          ]
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
          name: 'popular',
          type: 'boolean',
          defaultValue: false,
        },
      ],
    },
  ],
})

export default PricingSection