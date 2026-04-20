-- =============================================================================
-- Seed v2 — Assinaturas, relatórios mensais e service_requests vinculados
--
-- Pré-requisitos:
--   1. Migrations v2 aplicadas:
--        supabase/migrations/20260416_subscriptions.sql
--        supabase/migrations/20260416_monthly_reports.sql
--        supabase/migrations/20260416_service_requests_v2.sql
--   2. Usuários demo existentes (scripts/seed-users-demo.sql):
--        • fernanda.alves@demo.painelclean.com.br (Jaraguá do Sul)
--        • ana.silva@demo.painelclean.com.br       (Jaraguá do Sul)
--        • ricardo.mendes@demo.painelclean.com.br  (Blumenau)
--        • maria.oliveira@demo.painelclean.com.br  (Florianópolis)
--        • carlos.souza@demo.painelclean.com.br    (técnico Jaraguá)
--        • lucas.martins@demo.painelclean.com.br   (técnico Jaraguá)
--        • roberto.lima@demo.painelclean.com.br    (técnico Florianópolis)
--
-- Idempotente: execução repetida não duplica registros.
-- Mapeamento de planos (CLAUDE.md):
--   Básico → 'basic'   · R$ 30 / até 15 módulos
--   Padrão → 'standard'· R$ 50 / 16–30 módulos
--   Plus   → 'plus'    · R$ 100 / 31–60 módulos
-- =============================================================================

DO $$
DECLARE
  -- clientes
  fernanda_uid UUID;
  ana_uid      UUID;
  ricardo_uid  UUID;
  maria_uid    UUID;

  -- técnicos
  carlos_uid   UUID;
  lucas_uid    UUID;
  roberto_uid  UUID;

  -- assinaturas (ids resolvidos por client_id)
  fernanda_sub UUID;
  ana_sub      UUID;
  ricardo_sub  UUID;
  maria_sub    UUID;

  -- tarifa usada no cálculo de savings
  tariff CONSTANT NUMERIC := 0.92;

  -- ano/mês de referência para relatórios (últimos 3 meses a partir de 2026-04)
  y2026 CONSTANT INTEGER := 2026;
BEGIN
  ----------------------------------------------------------------------------
  -- 1. Resolver UIDs
  ----------------------------------------------------------------------------
  SELECT id INTO fernanda_uid FROM auth.users WHERE email = 'fernanda.alves@demo.painelclean.com.br';
  SELECT id INTO ana_uid      FROM auth.users WHERE email = 'ana.silva@demo.painelclean.com.br';
  SELECT id INTO ricardo_uid  FROM auth.users WHERE email = 'ricardo.mendes@demo.painelclean.com.br';
  SELECT id INTO maria_uid    FROM auth.users WHERE email = 'maria.oliveira@demo.painelclean.com.br';

  SELECT id INTO carlos_uid   FROM auth.users WHERE email = 'carlos.souza@demo.painelclean.com.br';
  SELECT id INTO lucas_uid    FROM auth.users WHERE email = 'lucas.martins@demo.painelclean.com.br';
  SELECT id INTO roberto_uid  FROM auth.users WHERE email = 'roberto.lima@demo.painelclean.com.br';

  IF fernanda_uid IS NULL OR ana_uid IS NULL OR ricardo_uid IS NULL OR maria_uid IS NULL THEN
    RAISE EXCEPTION 'Clientes demo não encontrados. Execute scripts/seed-users-demo.sql antes.';
  END IF;
  IF carlos_uid IS NULL OR lucas_uid IS NULL OR roberto_uid IS NULL THEN
    RAISE EXCEPTION 'Técnicos demo não encontrados. Execute scripts/seed-users-demo.sql antes.';
  END IF;

  ----------------------------------------------------------------------------
  -- 2. Assinaturas (uma por cliente)
  ----------------------------------------------------------------------------
  SELECT id INTO fernanda_sub FROM subscriptions WHERE client_id = fernanda_uid LIMIT 1;
  IF fernanda_sub IS NULL THEN
    INSERT INTO subscriptions (
      client_id, plan_type, status, price_monthly, modules_count,
      started_at, next_billing_at, next_service_at, inverter_brand
    ) VALUES (
      fernanda_uid, 'standard', 'active', 50.00, 20,
      NOW() - INTERVAL '120 days',
      NOW() + INTERVAL '10 days',
      NOW() + INTERVAL '45 days',
      'Growatt'
    ) RETURNING id INTO fernanda_sub;
    RAISE NOTICE 'subscription criada: Fernanda Alves — Padrão';
  END IF;

  SELECT id INTO ana_sub FROM subscriptions WHERE client_id = ana_uid LIMIT 1;
  IF ana_sub IS NULL THEN
    INSERT INTO subscriptions (
      client_id, plan_type, status, price_monthly, modules_count,
      started_at, next_billing_at, next_service_at, inverter_brand
    ) VALUES (
      ana_uid, 'basic', 'active', 30.00, 12,
      NOW() - INTERVAL '90 days',
      NOW() + INTERVAL '15 days',
      NOW() + INTERVAL '60 days',
      'Deye'
    ) RETURNING id INTO ana_sub;
    RAISE NOTICE 'subscription criada: Ana Silva — Básico';
  END IF;

  SELECT id INTO ricardo_sub FROM subscriptions WHERE client_id = ricardo_uid LIMIT 1;
  IF ricardo_sub IS NULL THEN
    INSERT INTO subscriptions (
      client_id, plan_type, status, price_monthly, modules_count,
      started_at, next_billing_at, next_service_at, inverter_brand
    ) VALUES (
      ricardo_uid, 'plus', 'active', 100.00, 40,
      NOW() - INTERVAL '180 days',
      NOW() + INTERVAL '5 days',
      NOW() + INTERVAL '30 days',
      'Fronius'
    ) RETURNING id INTO ricardo_sub;
    RAISE NOTICE 'subscription criada: Ricardo Mendes — Plus';
  END IF;

  SELECT id INTO maria_sub FROM subscriptions WHERE client_id = maria_uid LIMIT 1;
  IF maria_sub IS NULL THEN
    INSERT INTO subscriptions (
      client_id, plan_type, status, price_monthly, modules_count,
      started_at, next_billing_at, next_service_at, inverter_brand
    ) VALUES (
      maria_uid, 'standard', 'active', 50.00, 22,
      NOW() - INTERVAL '60 days',
      NOW() + INTERVAL '20 days',
      NOW() + INTERVAL '50 days',
      'Hoymiles'
    ) RETURNING id INTO maria_sub;
    RAISE NOTICE 'subscription criada: Maria Oliveira — Padrão';
  END IF;

  ----------------------------------------------------------------------------
  -- 3. monthly_reports — últimos meses (Jan, Fev, Mar 2026)
  -- kWh esperado ≈ modules × 0.55 kWp × 1.35 kWh/kWp/dia × 30 dias
  ----------------------------------------------------------------------------
  -- Fernanda (20 mod, expected ≈ 446 kWh)
  INSERT INTO monthly_reports (subscription_id, client_id, period_month, period_year,
                               kwh_generated, kwh_expected, efficiency_pct, savings_estimated,
                               alert_message, sent_at)
  SELECT fernanda_sub, fernanda_uid, m, y2026, gen, 446, ROUND(gen / 446 * 100, 2),
         ROUND(gen * tariff, 2), alert, sent
  FROM (VALUES
    (1, 422, NULL::TEXT,                                       '2026-02-01'::TIMESTAMPTZ),
    (2, 410, NULL::TEXT,                                       '2026-03-01'::TIMESTAMPTZ),
    (3, 438, NULL::TEXT,                                       '2026-04-01'::TIMESTAMPTZ)
  ) AS t(m, gen, alert, sent)
  WHERE NOT EXISTS (
    SELECT 1 FROM monthly_reports mr
     WHERE mr.subscription_id = fernanda_sub AND mr.period_month = t.m AND mr.period_year = y2026
  );

  -- Ana (12 mod, expected ≈ 267 kWh)
  INSERT INTO monthly_reports (subscription_id, client_id, period_month, period_year,
                               kwh_generated, kwh_expected, efficiency_pct, savings_estimated,
                               alert_message, sent_at)
  SELECT ana_sub, ana_uid, m, y2026, gen, 267, ROUND(gen / 267 * 100, 2),
         ROUND(gen * tariff, 2), alert, sent
  FROM (VALUES
    (2, 255, NULL::TEXT,                                       '2026-03-01'::TIMESTAMPTZ),
    (3, 248, 'Queda de 7% detectada — limpeza recomendada',    '2026-04-01'::TIMESTAMPTZ)
  ) AS t(m, gen, alert, sent)
  WHERE NOT EXISTS (
    SELECT 1 FROM monthly_reports mr
     WHERE mr.subscription_id = ana_sub AND mr.period_month = t.m AND mr.period_year = y2026
  );

  -- Ricardo (40 mod, expected ≈ 891 kWh)
  INSERT INTO monthly_reports (subscription_id, client_id, period_month, period_year,
                               kwh_generated, kwh_expected, efficiency_pct, savings_estimated,
                               alert_message, sent_at)
  SELECT ricardo_sub, ricardo_uid, m, y2026, gen, 891, ROUND(gen / 891 * 100, 2),
         ROUND(gen * tariff, 2), alert, sent
  FROM (VALUES
    (1, 862, NULL::TEXT,                                       '2026-02-01'::TIMESTAMPTZ),
    (2, 855, NULL::TEXT,                                       '2026-03-01'::TIMESTAMPTZ),
    (3, 878, NULL::TEXT,                                       '2026-04-01'::TIMESTAMPTZ)
  ) AS t(m, gen, alert, sent)
  WHERE NOT EXISTS (
    SELECT 1 FROM monthly_reports mr
     WHERE mr.subscription_id = ricardo_sub AND mr.period_month = t.m AND mr.period_year = y2026
  );

  -- Maria (22 mod, expected ≈ 490 kWh)
  INSERT INTO monthly_reports (subscription_id, client_id, period_month, period_year,
                               kwh_generated, kwh_expected, efficiency_pct, savings_estimated,
                               alert_message, sent_at)
  SELECT maria_sub, maria_uid, m, y2026, gen, 490, ROUND(gen / 490 * 100, 2),
         ROUND(gen * tariff, 2), alert, sent
  FROM (VALUES
    (2, 470, NULL::TEXT,                                       '2026-03-01'::TIMESTAMPTZ),
    (3, 482, NULL::TEXT,                                       '2026-04-01'::TIMESTAMPTZ)
  ) AS t(m, gen, alert, sent)
  WHERE NOT EXISTS (
    SELECT 1 FROM monthly_reports mr
     WHERE mr.subscription_id = maria_sub AND mr.period_month = t.m AND mr.period_year = y2026
  );

  ----------------------------------------------------------------------------
  -- 4. service_requests vinculados (origin='subscription')
  --    Apenas module_count salvo (solicitação do usuário — ver CLAUDE.md para
  --    a regra original que pedia panel_count + module_count juntos).
  --    price_estimate = módulos × R$10 (custo técnico), apenas para demo.
  ----------------------------------------------------------------------------
  -- Fernanda — 1ª limpeza concluída (entrada 50% off) + próxima agendada
  INSERT INTO service_requests (
    client_id, technician_id, city, address, module_count,
    price_estimate, preferred_date, preferred_time, status,
    origin, subscription_id, accepted_at, completed_at, created_at
  )
  SELECT fernanda_uid, carlos_uid, 'Jaraguá do Sul', 'Rua das Orquídeas, 128',
         20, 300.00,
         (NOW() - INTERVAL '115 days')::DATE, '14h-16h', 'completed',
         'subscription', fernanda_sub,
         NOW() - INTERVAL '118 days', NOW() - INTERVAL '115 days',
         NOW() - INTERVAL '120 days'
  WHERE NOT EXISTS (
    SELECT 1 FROM service_requests
     WHERE subscription_id = fernanda_sub AND status = 'completed'
  );

  INSERT INTO service_requests (
    client_id, technician_id, city, address, module_count,
    price_estimate, preferred_date, preferred_time, status,
    origin, subscription_id, created_at
  )
  SELECT fernanda_uid, lucas_uid, 'Jaraguá do Sul', 'Rua das Orquídeas, 128',
         20, 500.00,
         (NOW() + INTERVAL '45 days')::DATE, '10h-12h', 'pending',
         'subscription', fernanda_sub,
         NOW() - INTERVAL '2 days'
  WHERE NOT EXISTS (
    SELECT 1 FROM service_requests
     WHERE subscription_id = fernanda_sub AND status = 'pending'
  );

  -- Ana — 1ª limpeza concluída
  INSERT INTO service_requests (
    client_id, technician_id, city, address, module_count,
    price_estimate, preferred_date, preferred_time, status,
    origin, subscription_id, accepted_at, completed_at, created_at
  )
  SELECT ana_uid, lucas_uid, 'Jaraguá do Sul', 'Rua Pres. Epitácio Pessoa, 452',
         12, 180.00,
         (NOW() - INTERVAL '85 days')::DATE, '09h-11h', 'completed',
         'subscription', ana_sub,
         NOW() - INTERVAL '88 days', NOW() - INTERVAL '85 days',
         NOW() - INTERVAL '90 days'
  WHERE NOT EXISTS (
    SELECT 1 FROM service_requests
     WHERE subscription_id = ana_sub AND status = 'completed'
  );

  -- Ricardo — 2 concluídas (semestrais)
  INSERT INTO service_requests (
    client_id, technician_id, city, address, module_count,
    price_estimate, preferred_date, preferred_time, status,
    origin, subscription_id, accepted_at, completed_at, created_at
  )
  SELECT ricardo_uid, carlos_uid, 'Blumenau', 'Rua XV de Novembro, 1540',
         40, 500.00,
         (NOW() - INTERVAL '175 days')::DATE, '14h-17h', 'completed',
         'subscription', ricardo_sub,
         NOW() - INTERVAL '178 days', NOW() - INTERVAL '175 days',
         NOW() - INTERVAL '180 days'
  WHERE NOT EXISTS (
    SELECT 1 FROM service_requests
     WHERE subscription_id = ricardo_sub AND status = 'completed' AND completed_at < NOW() - INTERVAL '100 days'
  );

  INSERT INTO service_requests (
    client_id, technician_id, city, address, module_count,
    price_estimate, preferred_date, preferred_time, status,
    origin, subscription_id, accepted_at, completed_at, created_at
  )
  SELECT ricardo_uid, lucas_uid, 'Blumenau', 'Rua XV de Novembro, 1540',
         40, 1000.00,
         (NOW() - INTERVAL '15 days')::DATE, '09h-12h', 'completed',
         'subscription', ricardo_sub,
         NOW() - INTERVAL '18 days', NOW() - INTERVAL '15 days',
         NOW() - INTERVAL '20 days'
  WHERE NOT EXISTS (
    SELECT 1 FROM service_requests
     WHERE subscription_id = ricardo_sub AND status = 'completed' AND completed_at > NOW() - INTERVAL '100 days'
  );

  -- Maria — 1 concluída + 1 pending
  INSERT INTO service_requests (
    client_id, technician_id, city, address, module_count,
    price_estimate, preferred_date, preferred_time, status,
    origin, subscription_id, accepted_at, completed_at, created_at
  )
  SELECT maria_uid, roberto_uid, 'Florianópolis', 'Av. Beira-Mar Norte, 3200',
         22, 330.00,
         (NOW() - INTERVAL '55 days')::DATE, '08h-10h', 'completed',
         'subscription', maria_sub,
         NOW() - INTERVAL '58 days', NOW() - INTERVAL '55 days',
         NOW() - INTERVAL '60 days'
  WHERE NOT EXISTS (
    SELECT 1 FROM service_requests
     WHERE subscription_id = maria_sub AND status = 'completed'
  );

  INSERT INTO service_requests (
    client_id, technician_id, city, address, module_count,
    price_estimate, preferred_date, preferred_time, status,
    origin, subscription_id, created_at
  )
  SELECT maria_uid, roberto_uid, 'Florianópolis', 'Av. Beira-Mar Norte, 3200',
         22, 550.00,
         (NOW() + INTERVAL '50 days')::DATE, '08h-10h', 'pending',
         'subscription', maria_sub,
         NOW() - INTERVAL '1 day'
  WHERE NOT EXISTS (
    SELECT 1 FROM service_requests
     WHERE subscription_id = maria_sub AND status = 'pending'
  );

  RAISE NOTICE 'Seed v2 concluído com sucesso.';
END $$;

-- =============================================================================
-- VERIFICAÇÃO — counts por tabela (execute para conferir)
-- =============================================================================
-- SELECT full_name, plan_type, price_monthly, modules_count, status
--   FROM subscriptions s JOIN profiles p ON p.user_id = s.client_id;
--
-- SELECT p.full_name, mr.period_month, mr.period_year, mr.kwh_generated,
--        mr.efficiency_pct, mr.savings_estimated
--   FROM monthly_reports mr JOIN profiles p ON p.user_id = mr.client_id
--  ORDER BY p.full_name, mr.period_year, mr.period_month;
--
-- SELECT p.full_name, sr.status, sr.origin, sr.module_count, sr.price_estimate,
--        sr.preferred_date
--   FROM service_requests sr JOIN profiles p ON p.user_id = sr.client_id
--  WHERE sr.origin = 'subscription'
--  ORDER BY p.full_name, sr.preferred_date;
