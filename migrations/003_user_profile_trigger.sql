-- Migration to add automatic user profile creation trigger
-- This ensures every new user gets a profile created automatically

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user_profile() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email, is_pro, daily_generations, last_generation_date)
  VALUES (
    NEW.id, 
    NEW.email, 
    false, 
    0, 
    CURRENT_DATE
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Profile already exists, do nothing
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;

-- Create trigger for new user profile creation
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_profile();

-- Enable RLS for user_profiles if not already enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;

CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Service role can insert user profiles" ON user_profiles
  FOR INSERT WITH CHECK (true);