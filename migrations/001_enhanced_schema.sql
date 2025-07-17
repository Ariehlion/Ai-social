-- Enhanced Schema Migration for AI Social Generator
-- This file contains improved database schema with additional features

-- Create posts table (core table for generated social media posts)
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  original_content TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('twitter', 'linkedin', 'instagram', 'facebook')),
  generated_text TEXT NOT NULL,
  tone VARCHAR(20) DEFAULT 'professional',
  is_favorite BOOLEAN DEFAULT FALSE,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  word_count INTEGER DEFAULT 0,
  hashtags TEXT[],
  mentions TEXT[],
  media_urls TEXT[],
  content_type VARCHAR(20) DEFAULT 'text',
  engagement_prediction DECIMAL(3,2) DEFAULT 0,
  seo_score DECIMAL(3,2) DEFAULT 0,
  readability_score DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_profiles table to extend auth.users
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  is_pro BOOLEAN DEFAULT FALSE,
  daily_generations INTEGER DEFAULT 0,
  last_generation_date DATE DEFAULT CURRENT_DATE,
  full_name VARCHAR(100),
  avatar_url TEXT,
  bio TEXT,
  timezone VARCHAR(50) DEFAULT 'UTC',
  language VARCHAR(10) DEFAULT 'en',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tags table for organizing posts
CREATE TABLE IF NOT EXISTS tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  color VARCHAR(7) DEFAULT '#3b82f6',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create post_tags junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Create templates table for reusable content templates
CREATE TABLE IF NOT EXISTS templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('twitter', 'linkedin', 'instagram', 'facebook', 'all')),
  is_public BOOLEAN DEFAULT FALSE,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookmarks table for saving favorite posts
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- Create analytics table for tracking post performance
CREATE TABLE IF NOT EXISTS post_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  clicks INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_preferences table for personalized settings
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  preferred_platforms TEXT[] DEFAULT ARRAY['twitter', 'linkedin'],
  default_tone VARCHAR(20) DEFAULT 'professional',
  auto_save BOOLEAN DEFAULT TRUE,
  theme VARCHAR(10) DEFAULT 'light',
  notifications JSONB DEFAULT '{"email": true, "push": false}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content_history table for tracking content modifications
CREATE TABLE IF NOT EXISTS content_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  content TEXT NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  change_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscription_plans table for different pricing tiers
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  daily_generations INTEGER NOT NULL,
  features JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_subscriptions table for tracking user subscriptions
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES subscription_plans(id),
  status VARCHAR(20) DEFAULT 'active',
  current_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_period_end TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '1 month',
  stripe_subscription_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Additional columns are already included in the CREATE TABLE statements above

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_scheduled_for ON posts(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_posts_tone ON posts(tone);
CREATE INDEX IF NOT EXISTS idx_posts_platform ON posts(platform);
CREATE INDEX IF NOT EXISTS idx_posts_updated_at ON posts(updated_at);
CREATE INDEX IF NOT EXISTS idx_post_tags_post_id ON post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_tag_id ON post_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON templates(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_platform ON templates(platform);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_post_analytics_post_id ON post_analytics(post_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_content_history_post_id ON content_history(post_id);

-- Enable Row Level Security for new tables
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tags (public read, authenticated write)
CREATE POLICY "Tags are viewable by everyone" ON tags
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create tags" ON tags
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Create RLS policies for post_tags
CREATE POLICY "Users can view post tags for their own posts" ON post_tags
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM posts 
      WHERE posts.id = post_tags.post_id 
      AND posts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage post tags for their own posts" ON post_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM posts 
      WHERE posts.id = post_tags.post_id 
      AND posts.user_id = auth.uid()
    )
  );

-- Create RLS policies for templates
CREATE POLICY "Users can view their own templates and public templates" ON templates
  FOR SELECT USING (user_id = auth.uid() OR is_public = true);

CREATE POLICY "Users can manage their own templates" ON templates
  FOR ALL USING (user_id = auth.uid());

-- Create RLS policies for bookmarks
CREATE POLICY "Users can view their own bookmarks" ON bookmarks
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own bookmarks" ON bookmarks
  FOR ALL USING (user_id = auth.uid());

-- Create RLS policies for post_analytics
CREATE POLICY "Users can view analytics for their own posts" ON post_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM posts 
      WHERE posts.id = post_analytics.post_id 
      AND posts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage analytics for their own posts" ON post_analytics
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM posts 
      WHERE posts.id = post_analytics.post_id 
      AND posts.user_id = auth.uid()
    )
  );

-- Create RLS policies for user_preferences
CREATE POLICY "Users can view their own preferences" ON user_preferences
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own preferences" ON user_preferences
  FOR ALL USING (user_id = auth.uid());

-- Create RLS policies for content_history
CREATE POLICY "Users can view history for their own posts" ON content_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM posts 
      WHERE posts.id = content_history.post_id 
      AND posts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create history for their own posts" ON content_history
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM posts 
      WHERE posts.id = content_history.post_id 
      AND posts.user_id = auth.uid()
    )
  );

-- Create RLS policies for subscription_plans (public read)
CREATE POLICY "Subscription plans are viewable by everyone" ON subscription_plans
  FOR SELECT USING (is_active = true);

-- Create RLS policies for user_subscriptions
CREATE POLICY "Users can view their own subscriptions" ON user_subscriptions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own subscriptions" ON user_subscriptions
  FOR ALL USING (user_id = auth.uid());

-- Create functions for enhanced functionality

-- Function to update word count on post changes
CREATE OR REPLACE FUNCTION update_post_word_count()
RETURNS TRIGGER AS $$
BEGIN
  NEW.word_count = array_length(string_to_array(NEW.generated_text, ' '), 1);
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for word count updates
CREATE TRIGGER update_post_word_count_trigger
  BEFORE INSERT OR UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_post_word_count();

-- Function to create user preferences on signup
CREATE OR REPLACE FUNCTION handle_new_user_preferences() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_preferences (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user preferences
CREATE TRIGGER on_auth_user_created_preferences
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_preferences();

-- Function to increment template usage count
CREATE OR REPLACE FUNCTION increment_template_usage(template_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE templates 
  SET usage_count = usage_count + 1,
      updated_at = NOW()
  WHERE id = template_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get user analytics summary
CREATE OR REPLACE FUNCTION get_user_analytics_summary(user_id UUID)
RETURNS TABLE (
  total_posts INTEGER,
  total_clicks INTEGER,
  total_impressions INTEGER,
  avg_engagement_rate DECIMAL,
  most_popular_platform TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(p.id)::INTEGER as total_posts,
    COALESCE(SUM(pa.clicks), 0)::INTEGER as total_clicks,
    COALESCE(SUM(pa.impressions), 0)::INTEGER as total_impressions,
    COALESCE(AVG(pa.engagement_rate), 0)::DECIMAL as avg_engagement_rate,
    (SELECT p2.platform 
     FROM posts p2 
     WHERE p2.user_id = user_id 
     GROUP BY p2.platform 
     ORDER BY COUNT(*) DESC 
     LIMIT 1) as most_popular_platform
  FROM posts p
  LEFT JOIN post_analytics pa ON p.id = pa.post_id
  WHERE p.user_id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Insert default subscription plans
INSERT INTO subscription_plans (name, price, daily_generations, features) VALUES
('Free', 0.00, 5, '{"templates": false, "analytics": false, "export": false}'),
('Pro', 9.99, 50, '{"templates": true, "analytics": true, "export": true, "priority_support": true}'),
('Enterprise', 29.99, 200, '{"templates": true, "analytics": true, "export": true, "priority_support": true, "custom_branding": true, "team_collaboration": true}')
ON CONFLICT DO NOTHING;

-- Insert default tags
INSERT INTO tags (name, color, description) VALUES
('Marketing', '#ef4444', 'Marketing and promotional content'),
('Educational', '#3b82f6', 'Educational and informative posts'),
('Personal', '#10b981', 'Personal thoughts and experiences'),
('Business', '#8b5cf6', 'Business and professional content'),
('Technology', '#06b6d4', 'Technology and innovation posts'),
('Lifestyle', '#f59e0b', 'Lifestyle and personal interest content')
ON CONFLICT DO NOTHING;