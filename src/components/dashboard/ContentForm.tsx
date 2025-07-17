'use client'

import { useState } from 'react'
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
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-6 flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
          </svg>
          Generate Social Content
        </h2>
        
        {/* Input Type Toggle */}
        <div className="form-control mb-6">
          <div className="tabs tabs-boxed bg-base-200 p-1">
            <button
              onClick={() => setInputType('text')}
              className={`tab flex-1 ${
                inputType === 'text' ? 'tab-active' : ''
              }`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Text Input
            </button>
            <button
              onClick={() => setInputType('url')}
              className={`tab flex-1 ${
                inputType === 'url' ? 'tab-active' : ''
              }`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              URL Input
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Content Input */}
          <div className="form-control">
            <label className="label" htmlFor="content">
              <span className="label-text font-medium">
                {inputType === 'text' ? 'Blog Article Content' : 'Blog Article URL'}
              </span>
              <span className="label-text-alt">
                {inputType === 'text' ? 'Paste your content below' : 'Enter article URL'}
              </span>
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="textarea textarea-bordered textarea-primary w-full text-sm"
              placeholder={inputType === 'text' 
                ? "Paste your blog article text here... The AI will analyze and generate engaging social media posts optimized for your chosen platform."
                : "Enter the URL of your blog article here... The AI will fetch, analyze, and transform the content into platform-specific social media posts."
              }
              required
            />
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