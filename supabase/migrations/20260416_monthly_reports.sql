CREATE TABLE IF NOT EXISTS monthly_reports (
  id                 UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id    UUID REFERENCES subscriptions(id) NOT NULL,
  client_id          UUID REFERENCES auth.users(id) NOT NULL,
  period_month       INTEGER NOT NULL CHECK (period_month BETWEEN 1 AND 12),
  period_year        INTEGER NOT NULL,
  kwh_generated      DECIMAL(10,2),
  kwh_expected       DECIMAL(10,2),
  efficiency_pct     DECIMAL(5,2),
  savings_estimated  DECIMAL(10,2),
  alert_message      TEXT,
  report_pdf_url     TEXT,
  sent_at            TIMESTAMPTZ,
  created_at         TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE monthly_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients view own reports"
  ON monthly_reports FOR SELECT
  USING (auth.uid() = client_id);

CREATE POLICY "Admin full access monthly reports"
  ON monthly_reports FOR ALL
  USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');

CREATE INDEX IF NOT EXISTS idx_monthly_reports_subscription
  ON monthly_reports(subscription_id);

CREATE INDEX IF NOT EXISTS idx_monthly_reports_client
  ON monthly_reports(client_id);
