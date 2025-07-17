export interface Post {
  id: string
  user_id: string
  original_content: string
  platform: string
  generated_text: string
  created_at: string
  tone?: string
  is_favorite?: boolean
  scheduled_for?: string
  status?: 'draft' | 'published' | 'scheduled'
  word_count?: number
  updated_at?: string
  hashtags?: string[]
  mentions?: string[]
  media_urls?: string[]
  content_type?: string
  engagement_prediction?: number
  seo_score?: number
  readability_score?: number
}

export interface UserProfile {
  id: string
  email: string
  is_pro: boolean
  daily_generations: number
  last_generation_date: string
  created_at: string
  full_name?: string
  avatar_url?: string
  bio?: string
  updated_at?: string
  timezone?: string
  language?: string
  onboarding_completed?: boolean
  last_login?: string
}

export interface Tag {
  id: string
  name: string
  color: string
  description?: string
  created_at: string
}

export interface PostTag {
  post_id: string
  tag_id: string
}

export interface Template {
  id: string
  user_id: string
  name: string
  content: string
  platform: Platform | 'all'
  is_public: boolean
  usage_count: number
  created_at: string
  updated_at: string
}

export interface Bookmark {
  id: string
  user_id: string
  post_id: string
  created_at: string
}

export interface PostAnalytics {
  id: string
  post_id: string
  platform: string
  clicks: number
  impressions: number
  engagement_rate: number
  last_updated: string
}

export interface UserPreferences {
  user_id: string
  preferred_platforms: Platform[]
  default_tone: string
  auto_save: boolean
  theme: 'light' | 'dark'
  notifications: {
    email: boolean
    push: boolean
  }
  created_at: string
  updated_at: string
}

export interface ContentHistory {
  id: string
  post_id: string
  version: number
  content: string
  changed_by: string
  change_description?: string
  created_at: string
}

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  currency: string
  daily_generations: number
  features: Record<string, boolean>
  is_active: boolean
  created_at: string
}

export interface UserSubscription {
  id: string
  user_id: string
  plan_id: string
  status: string
  current_period_start: string
  current_period_end: string
  stripe_subscription_id?: string
  created_at: string
  updated_at: string
}

export interface AIPromptTemplate {
  id: string
  user_id: string
  name: string
  prompt_text: string
  platform: Platform | 'all'
  tone: string
  is_default: boolean
  is_public: boolean
  usage_count: number
  created_at: string
  updated_at: string
}

export interface ContentCalendar {
  id: string
  user_id: string
  post_id: string
  scheduled_date: string
  scheduled_time: string
  timezone: string
  status: 'scheduled' | 'published' | 'failed' | 'cancelled'
  auto_publish: boolean
  created_at: string
  updated_at: string
}

export interface Team {
  id: string
  name: string
  description?: string
  owner_id: string
  created_at: string
  updated_at: string
}

export interface TeamMember {
  id: string
  team_id: string
  user_id: string
  role: 'owner' | 'admin' | 'editor' | 'viewer'
  permissions: {
    create: boolean
    edit: boolean
    delete: boolean
    manage_members: boolean
  }
  joined_at: string
}

export interface BrandGuidelines {
  id: string
  user_id: string
  team_id?: string
  name: string
  brand_colors: Record<string, string>
  fonts: Record<string, string>
  tone_of_voice?: string
  key_messages?: string[]
  hashtags?: string[]
  mentions?: string[]
  do_not_use?: string[]
  created_at: string
  updated_at: string
}

export interface ContentSuggestion {
  id: string
  user_id: string
  suggestion_type: 'topic' | 'hashtag' | 'time' | 'platform'
  content: string
  confidence_score: number
  based_on?: string
  is_dismissed: boolean
  created_at: string
}

export interface ContentPerformance {
  id: string
  post_id: string
  platform: string
  published_at?: string
  likes: number
  shares: number
  comments: number
  saves: number
  clicks: number
  impressions: number
  reach: number
  engagement_rate: number
  best_performing_time?: string
  demographic_data: Record<string, any>
  last_updated: string
}

export interface HashtagPerformance {
  id: string
  hashtag: string
  platform: string
  user_id: string
  usage_count: number
  avg_engagement: number
  trending_score: number
  last_used?: string
  created_at: string
}

export type Platform = 'twitter' | 'linkedin' | 'instagram' | 'facebook'

export interface GenerateRequest {
  content: string
  platform: Platform
  tone?: string
  template_id?: string
  include_hashtags?: boolean
  include_mentions?: boolean
}

export interface GenerateResponse {
  posts: string[]
  remainingGenerations: number
  suggestions?: ContentSuggestion[]
  analytics?: {
    predicted_engagement: number
    optimal_posting_time: string
  }
}

export interface DashboardStats {
  total_posts: number
  total_clicks: number
  total_impressions: number
  avg_engagement_rate: number
  most_popular_platform: Platform
  recent_performance: ContentPerformance[]
}

export interface FilterOptions {
  platform?: Platform
  status?: string
  date_range?: {
    start: string
    end: string
  }
  tags?: string[]
  search?: string
}

export interface SortOptions {
  field: string
  direction: 'asc' | 'desc'
}