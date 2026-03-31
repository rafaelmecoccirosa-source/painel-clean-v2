-- contact_attempt_logs: registra tentativas de compartilhamento de contato bloqueadas no chat
-- Execute manualmente no Supabase SQL Editor

CREATE TABLE IF NOT EXISTS contact_attempt_logs (
  id                   UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  service_request_id   UUID          REFERENCES service_requests(id) ON DELETE CASCADE NOT NULL,
  user_id              UUID          REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  attempted_content    TEXT          NOT NULL,
  created_at           TIMESTAMPTZ   DEFAULT NOW()
);

-- Índices para queries de monitoramento no admin
CREATE INDEX IF NOT EXISTS idx_contact_attempt_logs_user_id
  ON contact_attempt_logs (user_id);

CREATE INDEX IF NOT EXISTS idx_contact_attempt_logs_service_request_id
  ON contact_attempt_logs (service_request_id);

CREATE INDEX IF NOT EXISTS idx_contact_attempt_logs_created_at
  ON contact_attempt_logs (created_at DESC);

-- RLS: apenas admins podem ler os logs; usuários podem inserir seus próprios
ALTER TABLE contact_attempt_logs ENABLE ROW LEVEL SECURITY;

-- Admin: leitura total
CREATE POLICY "Admin can read all contact attempt logs"
  ON contact_attempt_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = auth.uid() AND p.role = 'admin'
    )
  );

-- Usuário autenticado: pode inserir log da própria tentativa bloqueada
CREATE POLICY "User can insert own contact attempt log"
  ON contact_attempt_logs FOR INSERT
  WITH CHECK (user_id = auth.uid());
