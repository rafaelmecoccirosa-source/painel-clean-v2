-- Migration: colunas de pagamento em service_requests
-- Criada em: 2026-03-30
--
-- Execute manualmente no Supabase SQL Editor.
-- Acesse: https://app.supabase.com → seu projeto → SQL Editor → New query

ALTER TABLE service_requests
  ADD COLUMN IF NOT EXISTS payment_status VARCHAR(30)
    DEFAULT 'pending'
    CHECK (payment_status IN (
      'pending',                -- aguardando pagamento
      'awaiting_confirmation',  -- cliente diz que pagou, aguardando admin confirmar
      'confirmed',              -- admin confirmou, pagamento OK
      'released'                -- repasse liberado pro técnico
    ));

ALTER TABLE service_requests
  ADD COLUMN IF NOT EXISTS payment_method VARCHAR(20) DEFAULT 'pix';

ALTER TABLE service_requests
  ADD COLUMN IF NOT EXISTS payment_proof_url TEXT;

ALTER TABLE service_requests
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

ALTER TABLE service_requests
  ADD COLUMN IF NOT EXISTS released_at TIMESTAMPTZ;

-- ── Índice para queries de pagamento no painel admin ──────────────────────────

CREATE INDEX IF NOT EXISTS idx_service_requests_payment_status
  ON service_requests(payment_status);

-- ── Políticas RLS adicionais ──────────────────────────────────────────────────

-- Cliente pode atualizar payment_status de 'pending' → 'awaiting_confirmation'
-- (a política existente de UPDATE do cliente cobre isso via .eq('client_id', uid))

-- Admin já tem acesso total via política existente
