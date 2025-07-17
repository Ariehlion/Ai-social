-- Add missing RLS policies for core tables

-- Enable RLS for posts table
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Enable RLS for user_profiles table (if not already enabled)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own posts" ON posts;
DROP POLICY IF EXISTS "Users can create their own posts" ON posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON posts;

-- Create RLS policies for posts
CREATE POLICY "Users can view their own posts" ON posts
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own posts" ON posts
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own posts" ON posts
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own posts" ON posts
  FOR DELETE USING (user_id = auth.uid());

-- Drop existing user_profiles policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Service role can insert user profiles" ON user_profiles;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Service role can insert user profiles" ON user_profiles
  FOR INSERT WITH CHECK (true);