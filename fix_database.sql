-- SAFE DATABASE FIX SCRIPT
-- Run this entire script in your Supabase SQL Editor
-- This version safely handles existing policies

-- First, let's disable RLS temporarily to ensure tables are accessible
ALTER TABLE IF EXISTS user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS posts DISABLE ROW LEVEL SECURITY;

-- Safely drop existing policies for user_profiles
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
    DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
    DROP POLICY IF EXISTS "Service role can insert user profiles" ON user_profiles;
    DROP POLICY IF EXISTS "Enable all access for authenticated users on user_profiles" ON user_profiles;
EXCEPTION 
    WHEN OTHERS THEN NULL;
END $$;

-- Safely drop existing policies for posts
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can view their own posts" ON posts;
    DROP POLICY IF EXISTS "Users can create their own posts" ON posts;
    DROP POLICY IF EXISTS "Users can update their own posts" ON posts;
    DROP POLICY IF EXISTS "Users can delete their own posts" ON posts;
    DROP POLICY IF EXISTS "Enable all access for authenticated users on posts" ON posts;
EXCEPTION 
    WHEN OTHERS THEN NULL;
END $$;

-- Drop existing triggers and functions
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user_profile();

-- Create the user profile creation function
CREATE OR REPLACE FUNCTION handle_new_user_profile() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, is_pro, daily_generations, last_generation_date)
  VALUES (
    NEW.id, 
    COALESCE(NEW.email, ''), 
    false, 
    0, 
    CURRENT_DATE
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Profile already exists, do nothing
    RETURN NEW;
  WHEN OTHERS THEN
    -- Log error but don't fail the user creation
    RAISE LOG 'Error creating user profile for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_profile();

-- Re-enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create simple, permissive RLS policies for user_profiles (safely)
DO $$ 
BEGIN
    CREATE POLICY "Enable all access for authenticated users on user_profiles" ON user_profiles
      FOR ALL USING (auth.uid() IS NOT NULL);
EXCEPTION 
    WHEN duplicate_object THEN NULL;
END $$;

-- Create simple, permissive RLS policies for posts (safely)
DO $$ 
BEGIN
    CREATE POLICY "Enable all access for authenticated users on posts" ON posts
      FOR ALL USING (auth.uid() IS NOT NULL);
EXCEPTION 
    WHEN duplicate_object THEN NULL;
END $$;

-- Grant necessary permissions
GRANT ALL ON user_profiles TO authenticated;
GRANT ALL ON posts TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Create missing user profiles for existing users
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

-- Verify the setup
SELECT 'Setup complete! Users in auth.users:' as status, count(*) as count FROM auth.users
UNION ALL
SELECT 'User profiles created:' as status, count(*) as count FROM user_profiles;