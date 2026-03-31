-- Migration: escalation + SLA columns
-- Criada em: 2026-04-01
--
-- IMPORTANTE: Esta migration NÃO é aplicada automaticamente.
-- Execute manualmente no Supabase SQL Editor:
-- https://app.supabase.com → seu projeto → SQL Editor

-- ── Colunas de Escalonamento (Tarefa 2) ──────────────────────────────────────
-- escalation_level: quantas vezes o admin aumentou o preço para atrair técnico
-- escalated_at:     timestamp da última escalação manual pelo admin

ALTER TABLE service_requests
  ADD COLUMN IF NOT EXISTS escalation_level INT DEFAULT 0;

ALTER TABLE service_requests
  ADD COLUMN IF NOT EXISTS escalated_at TIMESTAMPTZ;

-- ── Coluna de SLA de pagamento (Tarefa 6) ────────────────────────────────────
-- payment_reported_at: quando o cliente clicou "Já paguei"
-- Usado para calcular o SLA de 15 minutos para confirmação do admin

ALTER TABLE service_requests
  ADD COLUMN IF NOT EXISTS payment_reported_at TIMESTAMPTZ;

-- ── Refresh do schema do PostgREST ────────────────────────────────────────────
NOTIFY pgrst, 'reload schema';
