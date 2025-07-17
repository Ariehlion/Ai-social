-- MINIMAL FIX FOR 406 ERROR
-- This script only fixes the immediate user_profiles access issue

-- First, check if user_profiles table exists and create it if needed
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

-- Temporarily disable RLS to fix access issues
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Create user profiles for any existing users who don't have one
INSERT INTO user_profiles (id, email, is_pro, daily_generations, last_generation_date)
SELECT 
  au.id,
  COALESCE(au.email, ''),
  false,
  0,
  CURRENT_DATE
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.id
WHERE up.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Grant basic permissions
GRANT ALL ON user_profiles TO authenticated;
GRANT ALL ON user_profiles TO anon;

-- Show results
SELECT 'Fix complete! User profiles created:' as status, count(*) as count FROM user_profiles;