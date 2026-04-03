-- Novas colunas para relatório fotográfico com dados de desempenho energético
-- Execute no Supabase SQL Editor

ALTER TABLE service_reports ADD COLUMN IF NOT EXISTS geracao_antes DECIMAL(10,2);
ALTER TABLE service_reports ADD COLUMN IF NOT EXISTS geracao_depois DECIMAL(10,2);
ALTER TABLE service_reports ADD COLUMN IF NOT EXISTS condicao_geral VARCHAR(30) DEFAULT 'bom';

NOTIFY pgrst, 'reload schema';
