-- Migration: chat messages table
-- Criada em: 2026-03-30
--
-- Execute manualmente no Supabase SQL Editor.
-- Acesse: https://app.supabase.com → seu projeto → SQL Editor → New query

CREATE TABLE IF NOT EXISTS messages (
  id                   UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  service_request_id   UUID          REFERENCES service_requests(id) ON DELETE CASCADE NOT NULL,
  sender_id            UUID          REFERENCES auth.users(id) NOT NULL,
  content              TEXT          NOT NULL,
  read                 BOOLEAN       DEFAULT false,
  created_at           TIMESTAMPTZ   DEFAULT NOW(),
  is_system            BOOLEAN       DEFAULT false
);

-- ── Índice para queries por serviço ───────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_messages_service_request
  ON messages(service_request_id, created_at);

CREATE INDEX IF NOT EXISTS idx_messages_unread
  ON messages(service_request_id, sender_id, read)
  WHERE read = false;

-- ── Row Level Security ─────────────────────────────────────────────────────────

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Cliente e técnico do serviço podem ler as mensagens
CREATE POLICY "Participants can read messages"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM service_requests sr
      WHERE sr.id = service_request_id
        AND (sr.client_id = auth.uid() OR sr.technician_id = auth.uid())
    )
  );

-- Participantes só podem enviar mensagens como eles mesmos
CREATE POLICY "Participants can send messages"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM service_requests sr
      WHERE sr.id = service_request_id
        AND (sr.client_id = auth.uid() OR sr.technician_id = auth.uid())
    )
  );

-- Participantes podem marcar mensagens como lidas
CREATE POLICY "Participants can mark messages read"
  ON messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM service_requests sr
      WHERE sr.id = service_request_id
        AND (sr.client_id = auth.uid() OR sr.technician_id = auth.uid())
    )
  )
  WITH CHECK (true);

-- Admin tem acesso total
CREATE POLICY "Admin full access to messages"
  ON messages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = auth.uid() AND p.role = 'admin'
    )
  );
