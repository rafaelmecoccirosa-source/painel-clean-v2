-- Migration: service_requests table
-- Criada em: 2026-03-30
--
-- IMPORTANTE: Esta migration NÃO é aplicada automaticamente.
-- Execute manualmente no Supabase SQL Editor:
-- https://app.supabase.com → seu projeto → SQL Editor
--
-- Cole e execute o SQL abaixo na íntegra.

-- ── Tabela principal de solicitações de serviço ────────────────────────────

CREATE TABLE IF NOT EXISTS service_requests (
  id               UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id        UUID          REFERENCES auth.users(id) NOT NULL,
  technician_id    UUID          REFERENCES auth.users(id),

  -- Dados do serviço
  city             VARCHAR(100)  NOT NULL,
  address          TEXT          NOT NULL,
  module_count     INTEGER       NOT NULL,
  price_estimate   DECIMAL(10,2) NOT NULL,

  -- Agendamento
  preferred_date   DATE          NOT NULL,
  preferred_time   VARCHAR(20)   NOT NULL,

  -- Status do fluxo
  status           VARCHAR(30)   DEFAULT 'pending'
    CHECK (status IN (
      'pending',      -- cliente solicitou, aguardando técnico
      'accepted',     -- técnico aceitou
      'in_progress',  -- técnico está realizando o serviço
      'completed',    -- técnico concluiu
      'cancelled'     -- cancelado por cliente ou técnico
    )),

  -- Metadados
  notes                TEXT,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW(),
  accepted_at          TIMESTAMPTZ,
  completed_at         TIMESTAMPTZ,
  cancelled_at         TIMESTAMPTZ,
  cancellation_reason  TEXT
);

-- ── Row Level Security ─────────────────────────────────────────────────────

ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

-- Cliente vê apenas seus próprios pedidos
CREATE POLICY "Clients view own requests"
  ON service_requests FOR SELECT
  USING (auth.uid() = client_id);

-- Cliente pode criar pedidos
CREATE POLICY "Clients create requests"
  ON service_requests FOR INSERT
  WITH CHECK (auth.uid() = client_id);

-- Cliente pode cancelar seus pedidos pendentes
CREATE POLICY "Clients cancel own pending"
  ON service_requests FOR UPDATE
  USING (auth.uid() = client_id AND status = 'pending')
  WITH CHECK (status = 'cancelled');

-- Técnico vê pedidos pendentes (disponíveis) + pedidos aceitos por ele
CREATE POLICY "Technicians view available and own"
  ON service_requests FOR SELECT
  USING (
    (status = 'pending') OR
    (auth.uid() = technician_id)
  );

-- Técnico pode aceitar pedidos pendentes e atualizar os seus
CREATE POLICY "Technicians accept requests"
  ON service_requests FOR UPDATE
  USING (
    (status = 'pending' AND technician_id IS NULL) OR
    (auth.uid() = technician_id)
  );

-- Admin vê e atualiza tudo
CREATE POLICY "Admins full access"
  ON service_requests FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- ── Índices ────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_service_requests_status
  ON service_requests(status);

CREATE INDEX IF NOT EXISTS idx_service_requests_client
  ON service_requests(client_id);

CREATE INDEX IF NOT EXISTS idx_service_requests_technician
  ON service_requests(technician_id);

CREATE INDEX IF NOT EXISTS idx_service_requests_city
  ON service_requests(city);

CREATE INDEX IF NOT EXISTS idx_service_requests_date
  ON service_requests(preferred_date);

-- ── Trigger: auto-update updated_at ───────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS service_requests_updated_at ON service_requests;
CREATE TRIGGER service_requests_updated_at
  BEFORE UPDATE ON service_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
