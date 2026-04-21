-- Migration: add missing fields aligned with CLAUDE.md spec
-- Created: 2026-04-21
-- Run manually in Supabase SQL Editor

-- ── monthly_reports: add read_at for hero 'report' state ─────────────────────
ALTER TABLE monthly_reports ADD COLUMN IF NOT EXISTS read_at timestamptz;

-- ── referrals: programa de indicações ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS referrals (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES auth.users(id),
  referred_id uuid REFERENCES auth.users(id),
  status      varchar(20) CHECK (status IN ('pending', 'active', 'expired')) DEFAULT 'pending',
  discount_pct decimal(5,2) DEFAULT 6.00,
  expires_at  timestamptz,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own referrals"
  ON referrals FOR SELECT
  USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Admin full access referrals"
  ON referrals FOR ALL
  USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');

CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status   ON referrals(status);

NOTIFY pgrst, 'reload schema';
