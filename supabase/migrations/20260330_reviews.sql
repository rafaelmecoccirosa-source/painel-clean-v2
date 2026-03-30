-- Migration: reviews table
-- Criada em: 2026-03-30
--
-- Execute manualmente no Supabase SQL Editor.

-- ── Tabela de avaliações ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS reviews (
  id                   UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  service_request_id   UUID          REFERENCES service_requests(id) NOT NULL UNIQUE,
  client_id            UUID          REFERENCES auth.users(id) NOT NULL,
  technician_id        UUID          REFERENCES auth.users(id),
  rating               INTEGER       NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment              TEXT,
  created_at           TIMESTAMPTZ   DEFAULT NOW()
);

-- ── Row Level Security ─────────────────────────────────────────────────────

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Cliente pode criar avaliação de serviço que lhe pertence
CREATE POLICY "Clients can insert own review"
  ON reviews FOR INSERT
  WITH CHECK (
    auth.uid() = client_id AND
    EXISTS (
      SELECT 1 FROM service_requests sr
      WHERE sr.id = service_request_id
        AND sr.client_id = auth.uid()
        AND sr.status = 'completed'
    )
  );

-- Todos (autenticados) podem ler avaliações
CREATE POLICY "Authenticated users can read reviews"
  ON reviews FOR SELECT
  USING (auth.role() = 'authenticated');

-- Admin vê e atualiza tudo
CREATE POLICY "Admins full access to reviews"
  ON reviews FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- ── Índices ────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_reviews_technician
  ON reviews(technician_id);

CREATE INDEX IF NOT EXISTS idx_reviews_client
  ON reviews(client_id);
