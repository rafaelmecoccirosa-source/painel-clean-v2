-- RLS policies for profiles table
-- Run this in Supabase SQL Editor

-- Enable RLS (if not already)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "admin_read_all_profiles" ON profiles;
DROP POLICY IF EXISTS "user_read_own_profile" ON profiles;
DROP POLICY IF EXISTS "user_insert_own_profile" ON profiles;
DROP POLICY IF EXISTS "user_update_own_profile" ON profiles;
DROP POLICY IF EXISTS "Admin can read all profiles" ON profiles;

-- Admin can read ALL profiles
CREATE POLICY "admin_read_all_profiles" ON profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = auth.uid() AND p.role = 'admin'
    )
  );

-- User can read their own profile
CREATE POLICY "user_read_own_profile" ON profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Any authenticated user can insert their own profile
CREATE POLICY "user_insert_own_profile" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User can update their own profile
CREATE POLICY "user_update_own_profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Admin can update any profile (for role management)
CREATE POLICY "admin_update_any_profile" ON profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = auth.uid() AND p.role = 'admin'
    )
  );

NOTIFY pgrst, 'reload schema';
