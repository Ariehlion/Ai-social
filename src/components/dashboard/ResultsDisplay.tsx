'use client'

import { useState } from 'react'
import { Platform } from '@/lib/types'

interface ResultsDisplayProps {
  results: string[]
  platform: Platform
  originalContent: string
  onSavePost: (post: string) => void
}

export default function ResultsDisplay({ results, platform, originalContent, onSavePost }: ResultsDisplayProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const platformColors = {
    twitter: 'badge-info',
    linkedin: 'badge-primary',
    instagram: 'badge-secondary',
    facebook: 'badge-accent'
  }

  const platformEmojis = {
    twitter: '𝕏',
    linkedin: '💼',
    instagram: '📸',
    facebook: '👥'
  }

  const platformNames = {
    twitter: 'X (Twitter)',
    linkedin: 'LinkedIn',
    instagram: 'Instagram',
    facebook: 'Facebook'
  }

  if (results.length === 0) return null

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center justify-between mb-6">
          <h2 className="card-title text-2xl">
            <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Generated Posts
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{platformEmojis[platform]}</span>
            <div className="flex flex-col">
              <span className="font-medium">{platformNames[platform]}</span>
              <div className={`badge ${platformColors[platform]} badge-sm`}>
                {results.length} posts generated
              </div>
            </div>
          </div>
        </div>
        
        {/* Original Content Preview */}
        <div className="alert alert-info mb-6">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <div className="font-medium">Source Content</div>
            <div className="text-sm opacity-80 mt-1">{originalContent.substring(0, 200)}...</div>
          </div>
        </div>

        {/* Generated Posts Grid */}
        <div className="grid gap-4">
          {results.map((post, index) => (
            <div key={index} className={`card bg-base-200 shadow-md platform-${platform} transition-all hover:shadow-lg`}>
              <div className="card-body p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <div className="badge badge-outline">#{index + 1}</div>
                    Post Option
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(post, index)}
                      className={`btn btn-sm btn-ghost ${
                        copiedIndex === index ? 'btn-success' : 'btn-outline'
                      }`}
                    >
                      {copiedIndex === index ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => onSavePost(post)}
                      className="btn btn-sm btn-primary"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      Save
                    </button>
                  </div>
                </div>
                
                {/* Post Content */}
                <div className="mockup-code bg-base-100 text-sm">
                  <pre className="px-4 py-2 whitespace-pre-wrap text-base-content">{post}</pre>
                </div>
                
                {/* Post Stats */}
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-4">
                    <div className="stat-desc flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-1l-4 4z" />
                      </svg>
                      {post.length} chars
                    </div>
                    <div className="stat-desc flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {post.split(' ').length} words
                    </div>
                    <div className="stat-desc flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                      {(post.match(/#\w+/g) || []).length} hashtags
                    </div>
                  </div>
                  
                  {/* Character Limit Warning */}
                  {platform === 'twitter' && post.length > 280 && (
                    <div className="badge badge-error gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      Over limit!
                    </div>
                  )}
                  
                  {platform === 'twitter' && post.length <= 280 && (
                    <div className="badge badge-success gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Perfect length
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}