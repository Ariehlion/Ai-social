'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Platform, UserProfile, GenerateRequest } from '@/lib/types'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import ContentForm from '@/components/dashboard/ContentForm'
import ResultsDisplay from '@/components/dashboard/ResultsDisplay'
import SavedPosts from '@/components/dashboard/SavedPosts'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<string[]>([])
  const [currentPlatform, setCurrentPlatform] = useState<Platform>('twitter')
  const [currentContent, setCurrentContent] = useState('')
  const [remainingGenerations, setRemainingGenerations] = useState(5)
  const [activeTab, setActiveTab] = useState<'generate' | 'saved'>('generate')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }

      let { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      // If profile doesn't exist, create it
      if (!profile) {
        const { data: newProfile, error } = await supabase
          .from('user_profiles')
          .insert([
            {
              id: user.id,
              email: user.email || '',
              is_pro: false,
              daily_generations: 0,
              last_generation_date: new Date().toISOString().split('T')[0]
            }
          ])
          .select()
          .single()

        if (error) {
          console.error('Error creating user profile:', error)
          return
        }
        profile = newProfile
      }

      if (profile) {
        setUserProfile(profile)
        const maxGenerations = profile.is_pro ? 50 : 5
        setRemainingGenerations(maxGenerations - profile.daily_generations)
      }
    }

    fetchUserProfile()
  }, [router, supabase])

  const handleGenerate = async (content: string, platform: Platform) => {
    if (remainingGenerations <= 0) return

    setLoading(true)
    setCurrentContent(content)
    setCurrentPlatform(platform)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, platform } as GenerateRequest),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate content')
      }

      const data = await response.json()
      setResults(data.posts)
      setRemainingGenerations(data.remainingGenerations)
    } catch (error) {
      console.error('Error generating content:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate content. Please try again.'
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSavePost = async (post: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('posts')
        .insert([
          {
            user_id: user.id,
            original_content: currentContent,
            platform: currentPlatform,
            generated_text: post,
          },
        ])

      if (error) throw error

      alert('Post saved successfully!')
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Failed to save post. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-base-200">
      <DashboardHeader userProfile={userProfile} />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="hero bg-gradient-to-r from-primary to-secondary text-primary-content rounded-2xl mb-8 fade-in">
          <div className="hero-content text-center py-12">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Welcome to your AI Social Content Generator
              </h1>
              <p className="text-lg opacity-90 mb-6">
                Transform your blog articles into engaging social media posts for any platform with the power of AI.
              </p>
              <div className="stats stats-horizontal bg-base-100 text-base-content rounded-xl shadow-lg">
                <div className="stat">
                  <div className="stat-title">Remaining Today</div>
                  <div className="stat-value text-primary">{remainingGenerations}</div>
                  <div className="stat-desc">Generations left</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Account Type</div>
                  <div className="stat-value text-secondary">{userProfile?.is_pro ? 'Pro' : 'Free'}</div>
                  <div className="stat-desc">{userProfile?.is_pro ? 'Advanced features' : 'Basic features'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="tabs tabs-boxed bg-base-100 shadow-lg mb-8 p-2 rounded-xl">
          <button
            onClick={() => setActiveTab('generate')}
            className={`tab tab-lg flex-1 ${
              activeTab === 'generate' ? 'tab-active' : ''
            }`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Generate Posts
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`tab tab-lg flex-1 ${
              activeTab === 'saved' ? 'tab-active' : ''
            }`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            Saved Posts
          </button>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {activeTab === 'generate' && (
            <>
              <div className="lg:col-span-2">
                <ContentForm
                  onGenerate={handleGenerate}
                  loading={loading}
                  remainingGenerations={remainingGenerations}
                />
              </div>
              
              <div className="lg:col-span-1">
                {/* Quick Stats Card */}
                <div className="card bg-base-100 shadow-lg mb-6">
                  <div className="card-body">
                    <h3 className="card-title text-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Quick Stats
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm opacity-70">Today&apos;s Usage</span>
                        <span className="font-medium">{userProfile?.daily_generations || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm opacity-70">Remaining</span>
                        <span className="font-medium text-primary">{remainingGenerations}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm opacity-70">Limit</span>
                        <span className="font-medium">{userProfile?.is_pro ? 50 : 5}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-sm opacity-70 mb-2">Usage Progress</div>
                      <progress 
                        className="progress progress-primary w-full" 
                        value={userProfile?.daily_generations || 0} 
                        max={userProfile?.is_pro ? 50 : 5}
                      ></progress>
                    </div>
                  </div>
                </div>
                
                {/* Platform Tips */}
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h3 className="card-title text-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Platform Tips
                    </h3>
                    <div className="space-y-3">
                      <div className="platform-twitter p-3 bg-base-200 rounded-lg">
                        <div className="font-semibold text-sm text-blue-600 mb-1">Twitter</div>
                        <p className="text-xs opacity-70">Keep it under 280 characters, use 1-2 hashtags, engage with questions</p>
                      </div>
                      <div className="platform-linkedin p-3 bg-base-200 rounded-lg">
                        <div className="font-semibold text-sm text-blue-700 mb-1">LinkedIn</div>
                        <p className="text-xs opacity-70">Professional tone, longer content ok, include industry insights</p>
                      </div>
                      <div className="platform-instagram p-3 bg-base-200 rounded-lg">
                        <div className="font-semibold text-sm text-pink-600 mb-1">Instagram</div>
                        <p className="text-xs opacity-70">Visual-first, use 3-5 hashtags, storytelling approach</p>
                      </div>
                      <div className="platform-facebook p-3 bg-base-200 rounded-lg">
                        <div className="font-semibold text-sm text-blue-800 mb-1">Facebook</div>
                        <p className="text-xs opacity-70">Casual tone, encourage engagement, use emojis sparingly</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Results Display */}
        {activeTab === 'generate' && results.length > 0 && (
          <div className="mt-8 fade-in">
            <ResultsDisplay
              results={results}
              platform={currentPlatform}
              originalContent={currentContent}
              onSavePost={handleSavePost}
            />
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="fade-in">
            <SavedPosts />
          </div>
        )}
      </main>
    </div>
  )
}