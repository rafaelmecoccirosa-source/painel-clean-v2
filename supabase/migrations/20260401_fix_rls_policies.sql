-- Migration: fix RLS policies for payment flow
-- Criada em: 2026-04-01
--
-- IMPORTANTE: Esta migration NÃO é aplicada automaticamente.
-- Execute manualmente no Supabase SQL Editor:
-- https://app.supabase.com → seu projeto → SQL Editor
--
-- Problema corrigido:
-- A policy "Clients cancel own pending" usava WITH CHECK (status = 'cancelled'),
-- o que bloqueava o cliente de atualizar payment_status para 'awaiting_confirmation'
-- ao clicar em "Já paguei". Esta migration substitui essa policy por duas mais precisas.

-- ── 1. Remover policy antiga do cliente ──────────────────────────────────────

DROP POLICY IF EXISTS "Clients cancel own pending" ON service_requests;

-- ── 2. Policy: cliente pode cancelar pedidos pendentes ────────────────────────

CREATE POLICY "Clients cancel own pending"
  ON service_requests FOR UPDATE
  USING  (auth.uid() = client_id AND status = 'pending' AND payment_status = 'pending')
  WITH CHECK (status = 'cancelled');

-- ── 3. Policy: cliente pode informar pagamento (Já paguei) ────────────────────
-- Permite atualizar payment_status de 'pending' → 'awaiting_confirmation'
-- nos seus próprios pedidos com status 'pending'

CREATE POLICY "Clients report payment"
  ON service_requests FOR UPDATE
  USING  (auth.uid() = client_id AND status = 'pending')
  WITH CHECK (payment_status = 'awaiting_confirmation');

-- ── 4. Corrigir policy de técnico: só ver pedidos com payment confirmado ──────
-- A policy original mostrava TODOS os pedidos pending para o técnico,
-- incluindo os que ainda não tiveram pagamento confirmado.

DROP POLICY IF EXISTS "Technicians view available and own" ON service_requests;

CREATE POLICY "Technicians view available and own"
  ON service_requests FOR SELECT
  USING (
    (status = 'pending' AND payment_status = 'confirmed') OR
    (auth.uid() = technician_id)
  );

-- ── 5. Index para acelerar query de técnico (payment_status) ─────────────────

CREATE INDEX IF NOT EXISTS idx_service_requests_payment_status
  ON service_requests(payment_status);
