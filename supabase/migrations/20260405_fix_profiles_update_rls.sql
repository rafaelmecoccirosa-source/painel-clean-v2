-- Fix profiles UPDATE RLS policies — add WITH CHECK clause
-- Without WITH CHECK, Supabase rejects PATCH even when USING passes (returns 500)

-- Drop incomplete UPDATE policies
DROP POLICY IF EXISTS "user_update_own_profile" ON profiles;
DROP POLICY IF EXISTS "admin_update_any_profile" ON profiles;

-- User can update their own profile
CREATE POLICY "user_update_own_profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admin can update any profile (for role management)
CREATE POLICY "admin_update_any_profile" ON profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = auth.uid() AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = auth.uid() AND p.role = 'admin'
    )
  );

NOTIFY pgrst, 'reload schema';
