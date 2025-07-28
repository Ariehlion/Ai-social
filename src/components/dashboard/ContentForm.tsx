'use client'

import { useState, useEffect, useRef } from 'react'
import { Platform } from '@/lib/types'

interface ContentFormProps {
  onGenerate: (content: string, platform: Platform) => void
  loading: boolean
  remainingGenerations: number
}

export default function ContentForm({ onGenerate, loading, remainingGenerations }: ContentFormProps) {
  const [content, setContent] = useState('')
  const [platform, setPlatform] = useState<Platform>('twitter')
  const [inputType, setInputType] = useState<'text' | 'url'>('text')
  
  const containerRef = useRef<HTMLDivElement>(null)


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim()) {
      onGenerate(content, platform)
    }
  }


  const platformDescriptions = {
    twitter: '280 characters max, use hashtags and mentions',
    linkedin: 'Professional tone, longer form content allowed',
    instagram: 'Visual-focused, use hashtags and engaging captions',
    facebook: 'Casual tone, engaging and shareable content'
  }

  return (
    <div ref={containerRef} className="bg-white border border-gray-200 rounded-lg shadow-lg">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-black mb-8">
          Generate Social Content
        </h2>
        
        {/* Input Type Toggle */}
        <div className="mb-8">
          <div className="bg-gray-100 rounded-full p-1 inline-flex">
            <button
              onClick={() => setInputType('text')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                inputType === 'text' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'
              }`}
            >
              Text Input
            </button>
            <button
              onClick={() => setInputType('url')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                inputType === 'url' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'
              }`}
            >
              URL Input
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Content Input */}
          <div className="form-control form-element">
            <label className="label" htmlFor="content">
              <span className="label-text font-medium">
                {inputType === 'text' ? 'Blog Article Content' : 'Blog Article URL'}
              </span>
              <span className="label-text-alt">
                {inputType === 'text' ? 'Paste your content below' : 'Enter article URL'}
              </span>
            </label>
            {inputType === 'text' ? (
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="w-full p-4 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                placeholder="Paste your blog article text here... The AI will analyze and generate engaging social media posts optimized for your chosen platform."
                required
                autoFocus
              />
            ) : (
              <input
                type="url"
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                placeholder="Enter the URL of your blog article here... The AI will fetch, analyze, and transform the content into platform-specific social media posts."
                required
                autoFocus
              />
            )}
          </div>

          {/* Platform Selection */}
          <div className="form-control">
            <label className="label" htmlFor="platform">
              <span className="label-text font-medium">Target Platform</span>
              <span className="label-text-alt">Choose your social media platform</span>
            </label>
            <select
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
              className="select select-bordered select-primary w-full"
            >
              <option value="twitter">𝕏 (Twitter)</option>
              <option value="linkedin">💼 LinkedIn</option>
              <option value="instagram">📸 Instagram</option>
              <option value="facebook">👥 Facebook</option>
            </select>
            <label className="label">
              <span className="label-text-alt text-info">
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {platformDescriptions[platform]}
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="card-actions justify-end">
            <button
              type="submit"
              disabled={loading || remainingGenerations === 0}
              className={`btn btn-primary btn-wide ${
                loading ? 'loading' : ''
              } ${remainingGenerations === 0 ? 'btn-disabled' : ''}`}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Generating...
                </>
              ) : remainingGenerations === 0 ? (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Daily Limit Reached
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate Posts
                </>
              )}
            </button>
          </div>
        </form>
        
        {/* Generation Limit Alert */}
        {remainingGenerations <= 2 && remainingGenerations > 0 && (
          <div className="alert alert-warning mt-4">
            <svg className="w-6 h-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span>Only {remainingGenerations} generation{remainingGenerations === 1 ? '' : 's'} remaining today!</span>
          </div>
        )}
      </div>
    </div>
  )
}