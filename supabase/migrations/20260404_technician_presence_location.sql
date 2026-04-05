-- Migration: presença e localização do técnico
-- Criada em: 2026-04-04
--
-- IMPORTANTE: Esta migration NÃO é aplicada automaticamente.
-- Execute manualmente no Supabase SQL Editor:
-- https://app.supabase.com → seu projeto → SQL Editor

-- ── Presença ──────────────────────────────────────────────────────────────────
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_seen TIMESTAMPTZ;

-- ── Localização do técnico via CEP ────────────────────────────────────────────
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cep       VARCHAR(9);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS lat       DOUBLE PRECISION;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS lng       DOUBLE PRECISION;

-- ── Índices ───────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_profiles_last_seen
  ON profiles(last_seen)
  WHERE role = 'tecnico';

CREATE INDEX IF NOT EXISTS idx_profiles_location
  ON profiles(lat, lng)
  WHERE role = 'tecnico';

NOTIFY pgrst, 'reload schema';
