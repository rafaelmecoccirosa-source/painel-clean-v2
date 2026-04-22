-- Migration: add approved_at to profiles for technician approval flow
-- Run manually in Supabase SQL Editor

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS approved_at timestamptz;

-- Index for fast lookup of pending technicians
CREATE INDEX IF NOT EXISTS idx_profiles_role_approved ON profiles(role, approved_at);

COMMENT ON COLUMN profiles.approved_at IS 'When null for role=tecnico, the technician is pending admin approval';

NOTIFY pgrst, 'reload schema';
