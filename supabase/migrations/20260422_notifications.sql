-- Migration: notifications table + RLS + demo data
-- Run manually in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS notifications (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title      text NOT NULL,
  body       text,
  type       varchar(30) DEFAULT 'system', -- 'service_update'|'report_ready'|'billing'|'system'
  read_at    timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread
  ON notifications(user_id, read_at)
  WHERE read_at IS NULL;

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notifications_own" ON notifications;
CREATE POLICY "notifications_own" ON notifications
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Demo notifications for existing client users
-- Replace these UUIDs with real user IDs from your auth.users table if needed.
-- This inserts via a subquery so it only runs when the profiles exist.

INSERT INTO notifications (user_id, title, body, type, created_at)
SELECT
  p.user_id,
  '📅 Limpeza agendada para 03 jun',
  'Confirmada pelo técnico Carlos S.',
  'service_update',
  now() - interval '2 hours'
FROM profiles p
WHERE p.role = 'cliente'
ON CONFLICT DO NOTHING;

INSERT INTO notifications (user_id, title, body, type, created_at)
SELECT
  p.user_id,
  '📊 Relatório de abril disponível',
  'Sua usina gerou 94% do esperado este mês.',
  'report_ready',
  now() - interval '1 day'
FROM profiles p
WHERE p.role = 'cliente'
ON CONFLICT DO NOTHING;

INSERT INTO notifications (user_id, title, body, type, created_at)
SELECT
  p.user_id,
  '💳 Cobrança da assinatura em 20 mai',
  'Lembrete: sua mensalidade será cobrada em breve.',
  'billing',
  now() - interval '3 days'
FROM profiles p
WHERE p.role = 'cliente'
ON CONFLICT DO NOTHING;

NOTIFY pgrst, 'reload schema';
