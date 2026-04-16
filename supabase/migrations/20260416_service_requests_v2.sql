ALTER TABLE service_requests
  ADD COLUMN IF NOT EXISTS origin VARCHAR(20) DEFAULT 'avulso'
    CHECK (origin IN ('subscription', 'avulso'));

ALTER TABLE service_requests
  ADD COLUMN IF NOT EXISTS subscription_id UUID REFERENCES subscriptions(id);

CREATE INDEX IF NOT EXISTS idx_service_requests_origin
  ON service_requests(origin);

NOTIFY pgrst, 'reload schema';
