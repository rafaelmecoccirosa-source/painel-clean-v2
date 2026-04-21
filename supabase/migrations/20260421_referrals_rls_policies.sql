-- Migration: referrals — RLS policies granulares
-- Created: 2026-04-21
-- Run manually in Supabase SQL Editor
--
-- Remove as policies genéricas criadas em add_missing_fields e
-- substitui pelas 4 policies específicas abaixo.

-- ── Drop políticas genéricas anteriores (se existirem) ───────────────────────
DROP POLICY IF EXISTS "Users view own referrals"    ON referrals;
DROP POLICY IF EXISTS "Admin full access referrals" ON referrals;

-- ── Policies granulares ───────────────────────────────────────────────────────

-- Cliente vê suas próprias indicações (como referrer)
CREATE POLICY "referrals_select_own" ON referrals
  FOR SELECT USING (referrer_id = auth.uid());

-- Cliente vê indicações onde foi indicado
CREATE POLICY "referrals_select_referred" ON referrals
  FOR SELECT USING (referred_id = auth.uid());

-- Cliente pode inserir indicações onde é o referrer
CREATE POLICY "referrals_insert_own" ON referrals
  FOR INSERT WITH CHECK (referrer_id = auth.uid());

-- Admin pode tudo
CREATE POLICY "referrals_admin_all" ON referrals
  FOR ALL USING (
    auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
  );

NOTIFY pgrst, 'reload schema';
