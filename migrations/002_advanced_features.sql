-- Advanced Features Migration for AI Social Generator
-- This file adds advanced features like AI prompt templates, content scheduling, and team collaboration

-- Create ai_prompt_templates table for customizable AI prompts
CREATE TABLE IF NOT EXISTS ai_prompt_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  prompt_text TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('twitter', 'linkedin', 'instagram', 'facebook', 'all')),
  tone VARCHAR(20) DEFAULT 'professional',
  is_default BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content_calendar table for scheduling posts
CREATE TABLE IF NOT EXISTS content_calendar (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  timezone VARCHAR(50) DEFAULT 'UTC',
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'published', 'failed', 'cancelled')),
  auto_publish BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create teams table for collaboration
CREATE TABLE IF NOT EXISTS teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create team_members table for team collaboration
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
  permissions JSONB DEFAULT '{"create": true, "edit": false, "delete": false, "manage_members": false}',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- Create brand_guidelines table for consistent branding
CREATE TABLE IF NOT EXISTS brand_guidelines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  brand_colors JSONB DEFAULT '{}',
  fonts JSONB DEFAULT '{}',
  tone_of_voice TEXT,
  key_messages TEXT[],
  hashtags TEXT[],
  mentions TEXT[],
  do_not_use TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content_workflows table for approval processes
CREATE TABLE IF NOT EXISTS content_workflows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  steps JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workflow_instances table for tracking approval status
CREATE TABLE IF NOT EXISTS workflow_instances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id UUID REFERENCES content_workflows(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  current_step INTEGER DEFAULT 1,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  assigned_to UUID REFERENCES auth.users(id),
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content_suggestions table for AI-powered suggestions
CREATE TABLE IF NOT EXISTS content_suggestions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  suggestion_type VARCHAR(20) NOT NULL CHECK (suggestion_type IN ('topic', 'hashtag', 'time', 'platform')),
  content TEXT NOT NULL,
  confidence_score DECIMAL(3,2) DEFAULT 0.5,
  based_on TEXT,
  is_dismissed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content_performance table for detailed analytics
CREATE TABLE IF NOT EXISTS content_performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  platform VARCHAR(20) NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  likes INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  best_performing_time TIME,
  demographic_data JSONB DEFAULT '{}',
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hashtag_performance table for hashtag analytics
CREATE TABLE IF NOT EXISTS hashtag_performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hashtag VARCHAR(100) NOT NULL,
  platform VARCHAR(20) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  usage_count INTEGER DEFAULT 0,
  avg_engagement DECIMAL(5,2) DEFAULT 0,
  trending_score DECIMAL(3,2) DEFAULT 0,
  last_used TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add additional columns to existing tables
ALTER TABLE posts ADD COLUMN IF NOT EXISTS hashtags TEXT[];
ALTER TABLE posts ADD COLUMN IF NOT EXISTS mentions TEXT[];
ALTER TABLE posts ADD COLUMN IF NOT EXISTS media_urls TEXT[];
ALTER TABLE posts ADD COLUMN IF NOT EXISTS content_type VARCHAR(20) DEFAULT 'text';
ALTER TABLE posts ADD COLUMN IF NOT EXISTS engagement_prediction DECIMAL(3,2) DEFAULT 0;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS seo_score DECIMAL(3,2) DEFAULT 0;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS readability_score DECIMAL(3,2) DEFAULT 0;

ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'UTC';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'en';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;

-- Create indexes for new tables
CREATE INDEX IF NOT EXISTS idx_ai_prompt_templates_user_id ON ai_prompt_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_prompt_templates_platform ON ai_prompt_templates(platform);
CREATE INDEX IF NOT EXISTS idx_content_calendar_user_id ON content_calendar(user_id);
CREATE INDEX IF NOT EXISTS idx_content_calendar_scheduled_date ON content_calendar(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_content_calendar_status ON content_calendar(status);
CREATE INDEX IF NOT EXISTS idx_teams_owner_id ON teams(owner_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_brand_guidelines_user_id ON brand_guidelines(user_id);
CREATE INDEX IF NOT EXISTS idx_brand_guidelines_team_id ON brand_guidelines(team_id);
CREATE INDEX IF NOT EXISTS idx_content_workflows_team_id ON content_workflows(team_id);
CREATE INDEX IF NOT EXISTS idx_workflow_instances_post_id ON workflow_instances(post_id);
CREATE INDEX IF NOT EXISTS idx_workflow_instances_assigned_to ON workflow_instances(assigned_to);
CREATE INDEX IF NOT EXISTS idx_content_suggestions_user_id ON content_suggestions(user_id);
CREATE INDEX IF NOT EXISTS idx_content_performance_post_id ON content_performance(post_id);
CREATE INDEX IF NOT EXISTS idx_hashtag_performance_user_id ON hashtag_performance(user_id);
CREATE INDEX IF NOT EXISTS idx_hashtag_performance_hashtag ON hashtag_performance(hashtag);

-- Enable Row Level Security for new tables
ALTER TABLE ai_prompt_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_guidelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE hashtag_performance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_prompt_templates
CREATE POLICY "Users can view their own templates and public templates" ON ai_prompt_templates
  FOR SELECT USING (user_id = auth.uid() OR is_public = true);

CREATE POLICY "Users can manage their own prompt templates" ON ai_prompt_templates
  FOR ALL USING (user_id = auth.uid());

-- RLS Policies for content_calendar
CREATE POLICY "Users can view their own calendar entries" ON content_calendar
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own calendar entries" ON content_calendar
  FOR ALL USING (user_id = auth.uid());

-- RLS Policies for teams
CREATE POLICY "Users can view teams they belong to" ON teams
  FOR SELECT USING (
    owner_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_id = teams.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Team owners can manage their teams" ON teams
  FOR ALL USING (owner_id = auth.uid());

-- RLS Policies for team_members
CREATE POLICY "Users can view team members of their teams" ON team_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM teams 
      WHERE teams.id = team_members.team_id 
      AND (teams.owner_id = auth.uid() OR 
           EXISTS (SELECT 1 FROM team_members tm WHERE tm.team_id = teams.id AND tm.user_id = auth.uid()))
    )
  );

CREATE POLICY "Team owners and admins can manage team members" ON team_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM teams 
      WHERE teams.id = team_members.team_id 
      AND teams.owner_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM team_members tm 
      WHERE tm.team_id = team_members.team_id 
      AND tm.user_id = auth.uid() 
      AND tm.role IN ('owner', 'admin')
    )
  );

-- Advanced functions

-- Function to calculate engagement prediction
CREATE OR REPLACE FUNCTION calculate_engagement_prediction(post_content TEXT, platform TEXT, user_id UUID)
RETURNS DECIMAL(3,2) AS $$
DECLARE
  prediction DECIMAL(3,2) := 0.5;
  word_count INTEGER;
  hashtag_count INTEGER;
  mention_count INTEGER;
  avg_user_engagement DECIMAL(3,2);
BEGIN
  -- Basic content analysis
  word_count := array_length(string_to_array(post_content, ' '), 1);
  hashtag_count := array_length(string_to_array(post_content, '#'), 1) - 1;
  mention_count := array_length(string_to_array(post_content, '@'), 1) - 1;
  
  -- Get user's average engagement
  SELECT COALESCE(AVG(pa.engagement_rate), 0.5) INTO avg_user_engagement
  FROM posts p
  JOIN post_analytics pa ON p.id = pa.post_id
  WHERE p.user_id = user_id AND p.platform = platform;
  
  -- Calculate prediction based on various factors
  prediction := avg_user_engagement;
  
  -- Platform-specific adjustments
  CASE platform
    WHEN 'twitter' THEN
      prediction := prediction + CASE 
        WHEN word_count BETWEEN 71 AND 100 THEN 0.1
        WHEN word_count > 280 THEN -0.2
        ELSE 0
      END;
    WHEN 'linkedin' THEN
      prediction := prediction + CASE 
        WHEN word_count BETWEEN 150 AND 300 THEN 0.1
        ELSE 0
      END;
  END CASE;
  
  -- Hashtag adjustments
  prediction := prediction + CASE 
    WHEN hashtag_count BETWEEN 1 AND 3 THEN 0.1
    WHEN hashtag_count > 5 THEN -0.1
    ELSE 0
  END;
  
  -- Ensure prediction is within bounds
  prediction := GREATEST(0, LEAST(1, prediction));
  
  RETURN prediction;
END;
$$ LANGUAGE plpgsql;

-- Function to extract hashtags from content
CREATE OR REPLACE FUNCTION extract_hashtags(content TEXT)
RETURNS TEXT[] AS $$
BEGIN
  RETURN regexp_split_to_array(
    regexp_replace(content, '.*?(#\w+)', '\1', 'g'),
    '\s+'
  );
END;
$$ LANGUAGE plpgsql;

-- Function to extract mentions from content
CREATE OR REPLACE FUNCTION extract_mentions(content TEXT)
RETURNS TEXT[] AS $$
BEGIN
  RETURN regexp_split_to_array(
    regexp_replace(content, '.*?(@\w+)', '\1', 'g'),
    '\s+'
  );
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-extract hashtags and mentions
CREATE OR REPLACE FUNCTION auto_extract_post_metadata()
RETURNS TRIGGER AS $$
BEGIN
  NEW.hashtags = extract_hashtags(NEW.generated_text);
  NEW.mentions = extract_mentions(NEW.generated_text);
  NEW.engagement_prediction = calculate_engagement_prediction(NEW.generated_text, NEW.platform, NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_extract_metadata_trigger
  BEFORE INSERT OR UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION auto_extract_post_metadata();

-- Insert default AI prompt templates
INSERT INTO ai_prompt_templates (user_id, name, prompt_text, platform, tone, is_default) 
SELECT 
  auth.uid(),
  'Professional LinkedIn Post',
  'Transform this content into a professional LinkedIn post that engages my network. Focus on industry insights and actionable takeaways. Use a conversational but professional tone.',
  'linkedin',
  'professional',
  true
WHERE auth.uid() IS NOT NULL
ON CONFLICT DO NOTHING;

-- Insert default brand guidelines template
INSERT INTO brand_guidelines (user_id, name, brand_colors, tone_of_voice, key_messages)
SELECT 
  auth.uid(),
  'Default Brand Guidelines',
  '{"primary": "#3b82f6", "secondary": "#8b5cf6", "accent": "#10b981"}',
  'Professional, approachable, and informative. Avoid jargon and keep content accessible.',
  ARRAY['Innovation drives growth', 'Quality over quantity', 'Customer-first approach']
WHERE auth.uid() IS NOT NULL
ON CONFLICT DO NOTHING;