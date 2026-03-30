-- Migration: service_reports table
-- Criada em: 2026-03-30
--
-- Execute manualmente no Supabase SQL Editor.

-- ── Tabela de relatórios fotográficos ─────────────────────────────────────

CREATE TABLE IF NOT EXISTS service_reports (
  id                   UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  service_request_id   UUID          REFERENCES service_requests(id) NOT NULL,
  photos_before        JSONB         NOT NULL DEFAULT '[]',  -- array de URLs
  photos_after         JSONB         NOT NULL DEFAULT '[]',  -- array de URLs
  checklist            JSONB         NOT NULL DEFAULT '{}',
  observations         TEXT,
  general_condition    VARCHAR(30)   DEFAULT 'bom'
    CHECK (general_condition IN ('bom', 'regular', 'necessita_atencao')),
  created_at           TIMESTAMPTZ   DEFAULT NOW()
);

-- ── Row Level Security ─────────────────────────────────────────────────────

ALTER TABLE service_reports ENABLE ROW LEVEL SECURITY;

-- Técnico que executou o serviço pode criar o relatório
CREATE POLICY "Technician can insert own report"
  ON service_reports FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM service_requests sr
      WHERE sr.id = service_request_id
        AND sr.technician_id = auth.uid()
    )
  );

-- Técnico e cliente do serviço podem visualizar o relatório
CREATE POLICY "Technician and client can view report"
  ON service_reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM service_requests sr
      WHERE sr.id = service_request_id
        AND (sr.technician_id = auth.uid() OR sr.client_id = auth.uid())
    )
  );

-- Admin vê e atualiza tudo
CREATE POLICY "Admins full access to reports"
  ON service_reports FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- ── Storage bucket ────────────────────────────────────────────────────────
-- Execute este bloco separadamente se necessário:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('service-photos', 'service-photos', true)
-- ON CONFLICT (id) DO NOTHING;

-- Política de storage: técnico pode fazer upload
-- CREATE POLICY "Technician upload service photos"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'service-photos' AND auth.role() = 'authenticated');

-- CREATE POLICY "Public read service photos"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'service-photos');
