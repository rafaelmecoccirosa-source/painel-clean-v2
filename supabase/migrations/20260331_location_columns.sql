-- Migration: add GPS location columns to service_requests
-- Run manually in Supabase SQL Editor

ALTER TABLE service_requests
  ADD COLUMN IF NOT EXISTS latitude          DECIMAL(10,8),
  ADD COLUMN IF NOT EXISTS longitude         DECIMAL(11,8),
  ADD COLUMN IF NOT EXISTS location_description TEXT;

-- Optional: add index for geo-proximity queries in the future
-- CREATE INDEX IF NOT EXISTS idx_service_requests_location
--   ON service_requests (latitude, longitude)
--   WHERE latitude IS NOT NULL;
