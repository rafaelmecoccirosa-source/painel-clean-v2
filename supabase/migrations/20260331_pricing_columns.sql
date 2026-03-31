-- Migration: Dynamic pricing columns for service_requests
-- Run manually in Supabase SQL Editor

ALTER TABLE service_requests
  ADD COLUMN IF NOT EXISTS tipo_instalacao VARCHAR(20)
    CHECK (tipo_instalacao IN ('solo', 'telhado_padrao', 'telhado_dificil'));

ALTER TABLE service_requests
  ADD COLUMN IF NOT EXISTS nivel_sujeira VARCHAR(10)
    CHECK (nivel_sujeira IN ('normal', 'pesada'));

ALTER TABLE service_requests
  ADD COLUMN IF NOT EXISTS nivel_acesso VARCHAR(10)
    CHECK (nivel_acesso IN ('normal', 'dificil'));

ALTER TABLE service_requests
  ADD COLUMN IF NOT EXISTS distancia_km DECIMAL(6,1);

ALTER TABLE service_requests
  ADD COLUMN IF NOT EXISTS preco_min DECIMAL(10,2);

ALTER TABLE service_requests
  ADD COLUMN IF NOT EXISTS preco_max DECIMAL(10,2);
