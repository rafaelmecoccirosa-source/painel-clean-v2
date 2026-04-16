CREATE TABLE IF NOT EXISTS subscriptions (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id        UUID REFERENCES auth.users(id) NOT NULL,
  plan_type        VARCHAR(20) NOT NULL
    CHECK (plan_type IN ('basic', 'standard', 'plus', 'pro', 'business')),
  status           VARCHAR(20) DEFAULT 'active'
    CHECK (status IN ('active', 'cancelled', 'paused')),
  price_monthly    DECIMAL(10,2) NOT NULL,
  modules_count    INTEGER NOT NULL,
  started_at       TIMESTAMPTZ DEFAULT NOW(),
  next_billing_at  TIMESTAMPTZ,
  next_service_at  TIMESTAMPTZ,
  inverter_brand   VARCHAR(50),
  inverter_api_key TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients view own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = client_id);

CREATE POLICY "Clients insert own subscriptions"
  ON subscriptions FOR INSERT
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients update own subscriptions"
  ON subscriptions FOR UPDATE
  USING (auth.uid() = client_id)
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Admin full access subscriptions"
  ON subscriptions FOR ALL
  USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');

CREATE INDEX IF NOT EXISTS idx_subscriptions_client
  ON subscriptions(client_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_status
  ON subscriptions(status);
