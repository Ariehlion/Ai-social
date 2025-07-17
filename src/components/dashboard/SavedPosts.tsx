'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Post } from '@/lib/types'

export default function SavedPosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const deletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)

      if (error) throw error
      setPosts(posts.filter(post => post.id !== postId))
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  const copyToClipboard = async (text: string, postId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(postId)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const platformEmojis = {
    twitter: '𝕏',
    linkedin: '💼',
    instagram: '📸',
    facebook: '👥'
  }

  const platformColors = {
    twitter: 'badge-info',
    linkedin: 'badge-primary',
    instagram: 'badge-secondary',
    facebook: 'badge-accent'
  }

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center gap-4 mb-4">
            <div className="skeleton h-8 w-8 rounded-full shrink-0"></div>
            <div className="flex flex-col gap-2">
              <div className="skeleton h-4 w-32"></div>
              <div className="skeleton h-4 w-24"></div>
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-24 w-full"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center justify-between mb-6">
          <h2 className="card-title text-2xl">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            Saved Posts
          </h2>
          <div className="badge badge-primary badge-lg">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </div>
        </div>
        
        {posts.length === 0 ? (
          <div className="hero min-h-[200px]">
            <div className="hero-content text-center">
              <div className="max-w-md">
                <svg className="w-16 h-16 mx-auto mb-4 text-base-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="text-lg font-bold">No saved posts yet</h3>
                <p className="text-sm opacity-70 mt-2">
                  Generate some social media posts and save your favorites to see them here!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className={`card bg-base-200 shadow-md platform-${post.platform} transition-all hover:shadow-lg`}>
                <div className="card-body p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content w-10 h-10 rounded-full text-lg">
                          {platformEmojis[post.platform as keyof typeof platformEmojis]}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className={`badge ${platformColors[post.platform as keyof typeof platformColors]} capitalize`}>
                            {post.platform}
                          </span>
                          <span className="text-sm opacity-60">
                            {new Date(post.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="text-xs opacity-50 mt-1">
                          {post.generated_text.length} characters
                        </div>
                      </div>
                    </div>
                    
                    <div className="dropdown dropdown-end">
                      <div tabIndex={0} role="button" className="btn btn-ghost btn-sm btn-circle">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </div>
                      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-lg border">
                        <li>
                          <a 
                            onClick={() => copyToClipboard(post.generated_text, post.id)}
                            className="flex items-center gap-2"
                          >
                            {copiedId === post.id ? (
                              <>
                                <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Copied!
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Copy to Clipboard
                              </>
                            )}
                          </a>
                        </li>
                        <li>
                          <a className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Post
                          </a>
                        </li>
                        <li>
                          <a className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h6a2 2 0 012 2v4m1 0H6m2 5v6m0 0v6m0-6h6m-6 0H8" />
                            </svg>
                            Duplicate
                          </a>
                        </li>
                        <div className="divider my-1"></div>
                        <li>
                          <a 
                            onClick={() => deletePost(post.id)}
                            className="flex items-center gap-2 text-error hover:bg-error hover:text-error-content"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete Post
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* Post Content */}
                  <div className="mockup-code bg-base-100 text-sm mb-3">
                    <pre className="px-4 py-2 whitespace-pre-wrap text-base-content">{post.generated_text}</pre>
                  </div>
                  
                  {/* Original Content Preview */}
                  <div className="collapse collapse-arrow bg-base-300">
                    <input type="checkbox" /> 
                    <div className="collapse-title text-xs font-medium opacity-70">
                      View original content
                    </div>
                    <div className="collapse-content text-xs opacity-60">
                      <p>{post.original_content.substring(0, 300)}...</p>
                    </div>
                  </div>
                  
                  {/* Post Stats */}
                  <div className="flex justify-between items-center mt-3 text-xs opacity-60">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-1l-4 4z" />
                        </svg>
                        {post.generated_text.length} chars
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        {post.generated_text.split(' ').length} words
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                        {(post.generated_text.match(/#\w+/g) || []).length} hashtags
                      </span>
                    </div>
                    <div className="text-xs">
                      {new Date(post.created_at).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}