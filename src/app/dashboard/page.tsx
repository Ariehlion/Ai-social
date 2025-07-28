'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Platform, UserProfile, GenerateRequest } from '@/lib/types'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import ContentForm from '@/components/dashboard/ContentForm'
import ResultsDisplay from '@/components/dashboard/ResultsDisplay'
import SavedPosts from '@/components/dashboard/SavedPosts'
import WixIntegration from '@/components/dashboard/WixIntegration'
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Spectacular Animated Background */}
      <div className="fixed inset-0 z-0">
        {/* Main Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900"></div>
        
        {/* Animated Gradient Orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400/30 to-blue-500/30 rounded-full mix-blend-screen filter blur-3xl animate-float"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-pink-500/30 rounded-full mix-blend-screen filter blur-3xl animate-float delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-yellow-400/30 to-orange-500/30 rounded-full mix-blend-screen filter blur-3xl animate-float delay-500"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-400/20 to-purple-500/20 rounded-full mix-blend-screen filter blur-3xl animate-pulse-slow"></div>
        </div>
        
        {/* Spectacular Particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 80 }, (_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-sparkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 4}s`,
                opacity: Math.random() * 0.8 + 0.2,
              }}
            ></div>
          ))}
        </div>
        
        {/* Dynamic Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10 pattern-grid animate-pulse-slow"
        ></div>
      </div>
      
      <div className="relative z-10">
        <DashboardHeader userProfile={userProfile} />
      
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Spectacular Welcome Section */}
          <div className="text-center mb-20 py-16 animate-fade-in-up">
            <div className="max-w-5xl mx-auto">
              {/* Glowing Badge */}
              <div className="inline-flex items-center px-8 py-4 rounded-full glass-spectacular text-white/90 text-lg font-medium mb-12 animate-fade-in-down neon-glow-spectacular">
                <span className="w-3 h-3 bg-green-400 rounded-full mr-4 animate-pulse"></span>
                AI Content Studio - Transform Ideas Into Viral Content
              </div>
              
              <h1 className="font-playfair text-6xl md:text-8xl font-bold text-white mb-8 text-shimmer-spectacular">
                Create Viral Content
              </h1>
              <p className="text-2xl md:text-3xl text-white/90 mb-16 font-light leading-relaxed max-w-4xl mx-auto">
                Harness the power of advanced AI to create 
                <span className="text-cyan-300 font-semibold"> compelling</span>,
                <span className="text-purple-300 font-semibold"> engaging</span>, and
                <span className="text-pink-300 font-semibold"> viral</span> social media content
              </p>
              
              {/* Spectacular Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="group card-spectacular p-8 rounded-3xl hover-lift-dramatic">
                  <div className="text-5xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors animate-pulse-slow">
                    {remainingGenerations}
                  </div>
                  <div className="text-white/90 font-semibold text-lg">Generations Left</div>
                  <div className="w-full bg-white/20 rounded-full h-2 mt-4">
                    <div 
                      className="bg-gradient-to-r from-cyan-400 to-purple-500 h-2 rounded-full transition-all duration-500 animate-gradient"
                      style={{ 
                        width: `${(remainingGenerations / (userProfile?.is_pro ? 50 : 5)) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="group card-spectacular p-8 rounded-3xl hover-lift-dramatic">
                  <div className="text-5xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors animate-pulse-slow">
                    {userProfile?.is_pro ? 'Pro' : 'Free'}
                  </div>
                  <div className="text-white/90 font-semibold text-lg">Account Type</div>
                  <div className="mt-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                      userProfile?.is_pro 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                        : 'bg-white/20 text-white/90'
                    }`}>
                      {userProfile?.is_pro ? 'Premium Features' : 'Basic Features'}
                    </span>
                  </div>
                </div>
                
                <div className="group card-spectacular p-8 rounded-3xl hover-lift-dramatic">
                  <div className="text-5xl font-bold text-white mb-4 group-hover:text-pink-300 transition-colors animate-pulse-slow">
                    {userProfile?.daily_generations || 0}
                  </div>
                  <div className="text-white/90 font-semibold text-lg">Today's Usage</div>
                  <div className="mt-4 text-sm text-white/70">
                    {((userProfile?.daily_generations || 0) / (userProfile?.is_pro ? 50 : 5) * 100).toFixed(0)}% used
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Spectacular Navigation Tabs */}
          <div className="flex justify-center mb-16 animate-fade-in-up delay-300">
            <div className="glass-spectacular rounded-3xl p-3 shadow-2xl">
              <button
                onClick={() => setActiveTab('generate')}
                className={`px-12 py-4 rounded-2xl text-xl font-bold transition-all duration-500 ${
                  activeTab === 'generate' 
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-2xl scale-105' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                } btn-spectacular`}
              >
                Generate Content
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`px-12 py-4 rounded-2xl text-xl font-bold transition-all duration-500 ${
                  activeTab === 'saved' 
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-2xl scale-105' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                } btn-spectacular`}
              >
                Saved Posts
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {activeTab === 'generate' && (
              <>
                <div className="lg:col-span-2 animate-slide-in-left">
                  <ContentForm
                    onGenerate={handleGenerate}
                    loading={loading}
                    remainingGenerations={remainingGenerations}
                  />
                </div>
                
                <div className="lg:col-span-1 animate-slide-in-right space-y-8">
                  {/* Spectacular Usage Analytics Card */}
                  <div className="card-spectacular p-8 rounded-3xl hover-lift-dramatic">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center mr-4 animate-rotate-glow">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-white">Usage Analytics</h3>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <span className="text-white/80 text-lg">Today's Usage</span>
                        <span className="font-bold text-2xl text-white">{userProfile?.daily_generations || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/80 text-lg">Remaining</span>
                        <span className="font-bold text-2xl text-green-400 animate-glow">{remainingGenerations}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/80 text-lg">Daily Limit</span>
                        <span className="font-bold text-2xl text-white">{userProfile?.is_pro ? 50 : 5}</span>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <div className="text-white/80 mb-3 text-lg">Progress</div>
                      <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 h-4 rounded-full transition-all duration-1000 animate-gradient"
                          style={{ 
                            width: `${((userProfile?.daily_generations || 0) / (userProfile?.is_pro ? 50 : 5)) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Wix Integration */}
                  <WixIntegration 
                    title={currentContent ? `Social Content from ${currentPlatform}` : undefined}
                    content={results.join('\n\n')}
                    platform={currentPlatform}
                  />

                  {/* Spectacular Platform Tips */}
                  <div className="card-spectacular p-8 rounded-3xl hover-lift-dramatic">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl flex items-center justify-center mr-4 animate-bounce-slow">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-white">Platform Tips</h3>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="platform-twitter-spectacular p-6 rounded-2xl hover-scale-dramatic cursor-pointer">
                        <div className="font-bold text-lg text-cyan-300 mb-2 flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                          Twitter
                        </div>
                        <p className="text-white/80">Keep it under 280 characters, use 1-2 hashtags, engage with questions</p>
                      </div>
                      <div className="platform-linkedin-spectacular p-6 rounded-2xl hover-scale-dramatic cursor-pointer">
                        <div className="font-bold text-lg text-blue-300 mb-2 flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.14-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                          LinkedIn
                        </div>
                        <p className="text-white/80">Professional tone, longer content ok, include industry insights</p>
                      </div>
                      <div className="platform-instagram-spectacular p-6 rounded-2xl hover-scale-dramatic cursor-pointer">
                        <div className="font-bold text-lg text-pink-300 mb-2 flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                          Instagram
                        </div>
                        <p className="text-white/80">Visual-first, use 3-5 hashtags, storytelling approach</p>
                      </div>
                      <div className="platform-facebook-spectacular p-6 rounded-2xl hover-scale-dramatic cursor-pointer">
                        <div className="font-bold text-lg text-blue-300 mb-2 flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                          Facebook
                        </div>
                        <p className="text-white/80">Casual tone, encourage engagement, use emojis sparingly</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Results Display */}
          {activeTab === 'generate' && results.length > 0 && (
            <div className="mt-16 animate-fade-in-up">
              <ResultsDisplay
                results={results}
                platform={currentPlatform}
                originalContent={currentContent}
                onSavePost={handleSavePost}
              />
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="animate-fade-in-up">
              <SavedPosts />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}