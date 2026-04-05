-- =============================================================================
-- SEED: Localização de técnicos + service_requests de demonstração
-- =============================================================================
--
-- COMO EXECUTAR:
--   1. Acesse https://app.supabase.com → seu projeto → SQL Editor → New query
--   2. Cole todo o conteúdo deste arquivo
--   3. Substitua os e-mails nas seções marcadas com "← SUBSTITUIR" pelos
--      e-mails reais dos usuários já cadastrados no seu banco
--   4. Clique em "Run"
--
-- PRÉ-REQUISITOS:
--   Migration 20260404_technician_presence_location.sql já aplicada
--   (adiciona colunas cep, lat, lng, last_seen em profiles)
--
-- SEGURANÇA:
--   UPDATEs usam e-mail como chave (via JOIN com auth.users) —
--   nunca UUIDs hard-coded que podem mudar entre ambientes.
-- =============================================================================


-- =============================================================================
-- PARTE 1 — TÉCNICOS: atualizar coordenadas por cidade
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Estratégia A (recomendada se souber os e-mails):
--   UPDATE por e-mail específico — 1 técnico online, demais offline
-- -----------------------------------------------------------------------------

-- Técnico em Jaraguá do Sul → ONLINE (last_seen = agora)
-- ← SUBSTITUIR pelo e-mail real do técnico de Jaraguá
UPDATE profiles
SET
  lat       = -26.4854,
  lng       = -49.0713,
  cep       = '89251-000',
  last_seen = NOW()
FROM auth.users u
WHERE profiles.user_id = u.id
  AND profiles.role     = 'tecnico'
  AND u.email           = 'tecnico.jaragua@demo.com';  -- ← SUBSTITUIR

-- Técnico em Pomerode → OFFLINE (last_seen = 2h atrás)
-- ← SUBSTITUIR pelo e-mail real do técnico de Pomerode
UPDATE profiles
SET
  lat       = -26.7407,
  lng       = -49.1764,
  cep       = '89107-000',
  last_seen = NOW() - INTERVAL '2 hours'
FROM auth.users u
WHERE profiles.user_id = u.id
  AND profiles.role     = 'tecnico'
  AND u.email           = 'tecnico.pomerode@demo.com';  -- ← SUBSTITUIR

-- Técnico em Florianópolis → OFFLINE (last_seen = 2h atrás)
-- ← SUBSTITUIR pelo e-mail real do técnico de Florianópolis
UPDATE profiles
SET
  lat       = -27.5954,
  lng       = -48.5480,
  cep       = '88015-000',
  last_seen = NOW() - INTERVAL '2 hours'
FROM auth.users u
WHERE profiles.user_id = u.id
  AND profiles.role     = 'tecnico'
  AND u.email           = 'tecnico.floripa@demo.com';  -- ← SUBSTITUIR


-- -----------------------------------------------------------------------------
-- Estratégia B (fallback): atualiza TODOS os técnicos pela coluna city
--   Use se não souber os e-mails individualmente.
--   O primeiro técnico de cada cidade vira online via subquery com LIMIT 1.
-- -----------------------------------------------------------------------------

-- Descomente o bloco abaixo se quiser usar a Estratégia B:

/*

-- Todos os técnicos de Jaraguá do Sul
UPDATE profiles
SET
  lat = -26.4854,
  lng = -49.0713,
  cep = '89251-000'
WHERE role = 'tecnico'
  AND city = 'Jaraguá do Sul'
  AND lat IS NULL;

-- Todos os técnicos de Pomerode
UPDATE profiles
SET
  lat = -26.7407,
  lng = -49.1764,
  cep = '89107-000'
WHERE role = 'tecnico'
  AND city = 'Pomerode'
  AND lat IS NULL;

-- Todos os técnicos de Florianópolis
UPDATE profiles
SET
  lat = -27.5954,
  lng = -48.5480,
  cep = '88015-000'
WHERE role = 'tecnico'
  AND city = 'Florianópolis'
  AND lat IS NULL;

-- Define 1 técnico por cidade como ONLINE, demais como OFFLINE
UPDATE profiles
SET last_seen = NOW()
WHERE id = (
  SELECT id FROM profiles
  WHERE role = 'tecnico' AND city = 'Jaraguá do Sul'
  ORDER BY created_at LIMIT 1
);

UPDATE profiles
SET last_seen = NOW() - INTERVAL '2 hours'
WHERE role = 'tecnico'
  AND city IN ('Pomerode', 'Florianópolis')
  AND last_seen IS NULL;

*/


-- =============================================================================
-- PARTE 2 — SERVICE_REQUESTS: inserções de demonstração com coordenadas reais
-- =============================================================================
--
-- Os INSERTs abaixo são envolvidos em blocos DO ... END para que sejam
-- ignorados silenciosamente caso o cliente/técnico de referência não exista.
-- Substitua os e-mails pelos usuários reais do seu banco.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Serviço 1 — Jaraguá do Sul — pendente, aguardando técnico
-- Cliente: cliente.jaragua@demo.com  ← SUBSTITUIR
-- Técnico: nenhum (disponível para aceite)
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  v_client_id UUID;
BEGIN
  SELECT u.id INTO v_client_id
  FROM auth.users u
  INNER JOIN profiles p ON p.user_id = u.id
  WHERE u.email = 'cliente.jaragua@demo.com'  -- ← SUBSTITUIR
    AND p.role  = 'cliente'
  LIMIT 1;

  IF v_client_id IS NOT NULL THEN
    INSERT INTO service_requests (
      client_id,
      technician_id,
      city,
      address,
      module_count,
      panel_count,
      price_estimate,
      preco_min,
      preco_max,
      status,
      payment_status,
      tipo_instalacao,
      nivel_sujeira,
      nivel_acesso,
      distancia_km,
      latitude,
      longitude,
      preferred_date,
      preferred_time,
      notes
    ) VALUES (
      v_client_id,
      NULL,
      'Jaraguá do Sul',
      'Rua XV de Novembro, 420 — Centro',
      24,
      24,
      660.00,
      594.00,
      792.00,
      'pending',
      'confirmed',
      'telhado_padrao',
      'normal',
      'normal',
      5.0,
      -26.4854,
      -49.0713,
      CURRENT_DATE + INTERVAL '2 days',
      '08:00',
      'Portão azul, campainha no lado direito.'
    );
    RAISE NOTICE 'Serviço 1 (Jaraguá - pendente) inserido.';
  ELSE
    RAISE NOTICE 'AVISO: cliente.jaragua@demo.com não encontrado — Serviço 1 ignorado.';
  END IF;
END $$;


-- -----------------------------------------------------------------------------
-- Serviço 2 — Jaraguá do Sul — em andamento, já com técnico
-- Cliente: cliente.jaragua@demo.com  ← SUBSTITUIR
-- Técnico: tecnico.jaragua@demo.com  ← SUBSTITUIR
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  v_client_id    UUID;
  v_technician_id UUID;
BEGIN
  SELECT u.id INTO v_client_id
  FROM auth.users u
  INNER JOIN profiles p ON p.user_id = u.id
  WHERE u.email = 'cliente.jaragua@demo.com'  -- ← SUBSTITUIR
    AND p.role  = 'cliente'
  LIMIT 1;

  SELECT u.id INTO v_technician_id
  FROM auth.users u
  INNER JOIN profiles p ON p.user_id = u.id
  WHERE u.email = 'tecnico.jaragua@demo.com'  -- ← SUBSTITUIR
    AND p.role  = 'tecnico'
  LIMIT 1;

  IF v_client_id IS NOT NULL AND v_technician_id IS NOT NULL THEN
    INSERT INTO service_requests (
      client_id,
      technician_id,
      city,
      address,
      module_count,
      panel_count,
      price_estimate,
      preco_min,
      preco_max,
      status,
      payment_status,
      tipo_instalacao,
      nivel_sujeira,
      nivel_acesso,
      distancia_km,
      latitude,
      longitude,
      preferred_date,
      preferred_time,
      accepted_at,
      notes
    ) VALUES (
      v_client_id,
      v_technician_id,
      'Jaraguá do Sul',
      'Av. Getúlio Vargas, 1.100 — Bairro Ilha',
      48,
      48,
      980.00,
      882.00,
      1176.00,
      'in_progress',
      'confirmed',
      'telhado_padrao',
      'pesada',
      'normal',
      8.0,
      -26.4920,
      -49.0650,
      CURRENT_DATE,
      '09:00',
      NOW() - INTERVAL '1 hour',
      'Sujeira de construção pesada. Levar escova extra.'
    );
    RAISE NOTICE 'Serviço 2 (Jaraguá - em andamento) inserido.';
  ELSE
    RAISE NOTICE 'AVISO: cliente ou técnico de Jaraguá não encontrado — Serviço 2 ignorado.';
  END IF;
END $$;


-- -----------------------------------------------------------------------------
-- Serviço 3 — Pomerode — pendente, aguardando técnico
-- Cliente: cliente.pomerode@demo.com  ← SUBSTITUIR
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  v_client_id UUID;
BEGIN
  SELECT u.id INTO v_client_id
  FROM auth.users u
  INNER JOIN profiles p ON p.user_id = u.id
  WHERE u.email = 'cliente.pomerode@demo.com'  -- ← SUBSTITUIR
    AND p.role  = 'cliente'
  LIMIT 1;

  IF v_client_id IS NOT NULL THEN
    INSERT INTO service_requests (
      client_id,
      technician_id,
      city,
      address,
      module_count,
      panel_count,
      price_estimate,
      preco_min,
      preco_max,
      status,
      payment_status,
      tipo_instalacao,
      nivel_sujeira,
      nivel_acesso,
      distancia_km,
      latitude,
      longitude,
      preferred_date,
      preferred_time,
      notes
    ) VALUES (
      v_client_id,
      NULL,
      'Pomerode',
      'Rua Hermann Weege, 300 — Centro',
      36,
      36,
      720.00,
      648.00,
      864.00,
      'pending',
      'confirmed',
      'solo',
      'normal',
      'normal',
      3.5,
      -26.7407,
      -49.1764,
      CURRENT_DATE + INTERVAL '3 days',
      '14:00',
      NULL
    );
    RAISE NOTICE 'Serviço 3 (Pomerode - pendente) inserido.';
  ELSE
    RAISE NOTICE 'AVISO: cliente.pomerode@demo.com não encontrado — Serviço 3 ignorado.';
  END IF;
END $$;


-- -----------------------------------------------------------------------------
-- Serviço 4 — Pomerode — concluído (histórico)
-- Cliente: cliente.pomerode@demo.com  ← SUBSTITUIR
-- Técnico: tecnico.pomerode@demo.com  ← SUBSTITUIR
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  v_client_id    UUID;
  v_technician_id UUID;
BEGIN
  SELECT u.id INTO v_client_id
  FROM auth.users u
  INNER JOIN profiles p ON p.user_id = u.id
  WHERE u.email = 'cliente.pomerode@demo.com'  -- ← SUBSTITUIR
    AND p.role  = 'cliente'
  LIMIT 1;

  SELECT u.id INTO v_technician_id
  FROM auth.users u
  INNER JOIN profiles p ON p.user_id = u.id
  WHERE u.email = 'tecnico.pomerode@demo.com'  -- ← SUBSTITUIR
    AND p.role  = 'tecnico'
  LIMIT 1;

  IF v_client_id IS NOT NULL AND v_technician_id IS NOT NULL THEN
    INSERT INTO service_requests (
      client_id,
      technician_id,
      city,
      address,
      module_count,
      panel_count,
      price_estimate,
      preco_min,
      preco_max,
      status,
      payment_status,
      tipo_instalacao,
      nivel_sujeira,
      nivel_acesso,
      distancia_km,
      latitude,
      longitude,
      preferred_date,
      preferred_time,
      accepted_at,
      completed_at,
      notes
    ) VALUES (
      v_client_id,
      v_technician_id,
      'Pomerode',
      'Rua 15 de Novembro, 55 — Bairro Progresso',
      20,
      20,
      580.00,
      522.00,
      696.00,
      'completed',
      'released',
      'telhado_padrao',
      'normal',
      'normal',
      2.0,
      -26.7350,
      -49.1820,
      CURRENT_DATE - INTERVAL '7 days',
      '10:00',
      NOW() - INTERVAL '8 days',
      NOW() - INTERVAL '7 days',
      'Serviço concluído sem intercorrências.'
    );
    RAISE NOTICE 'Serviço 4 (Pomerode - concluído) inserido.';
  ELSE
    RAISE NOTICE 'AVISO: cliente ou técnico de Pomerode não encontrado — Serviço 4 ignorado.';
  END IF;
END $$;


-- -----------------------------------------------------------------------------
-- Serviço 5 — Florianópolis — pendente, aguardando técnico
-- Cliente: cliente.floripa@demo.com  ← SUBSTITUIR
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  v_client_id UUID;
BEGIN
  SELECT u.id INTO v_client_id
  FROM auth.users u
  INNER JOIN profiles p ON p.user_id = u.id
  WHERE u.email = 'cliente.floripa@demo.com'  -- ← SUBSTITUIR
    AND p.role  = 'cliente'
  LIMIT 1;

  IF v_client_id IS NOT NULL THEN
    INSERT INTO service_requests (
      client_id,
      technician_id,
      city,
      address,
      module_count,
      panel_count,
      price_estimate,
      preco_min,
      preco_max,
      status,
      payment_status,
      tipo_instalacao,
      nivel_sujeira,
      nivel_acesso,
      distancia_km,
      latitude,
      longitude,
      preferred_date,
      preferred_time,
      notes
    ) VALUES (
      v_client_id,
      NULL,
      'Florianópolis',
      'Rua Felipe Schmidt, 515 — Centro',
      60,
      60,
      890.00,
      801.00,
      1068.00,
      'pending',
      'confirmed',
      'telhado_dificil',
      'pesada',
      'dificil',
      12.0,
      -27.5954,
      -48.5480,
      CURRENT_DATE + INTERVAL '4 days',
      '07:30',
      'Telhado colonial com telhas coloniais. Necessário cuidado extra.'
    );
    RAISE NOTICE 'Serviço 5 (Florianópolis - pendente) inserido.';
  ELSE
    RAISE NOTICE 'AVISO: cliente.floripa@demo.com não encontrado — Serviço 5 ignorado.';
  END IF;
END $$;


-- -----------------------------------------------------------------------------
-- Serviço 6 — Florianópolis — aceito, aguardando execução
-- Cliente: cliente.floripa@demo.com   ← SUBSTITUIR
-- Técnico: tecnico.floripa@demo.com   ← SUBSTITUIR
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  v_client_id    UUID;
  v_technician_id UUID;
BEGIN
  SELECT u.id INTO v_client_id
  FROM auth.users u
  INNER JOIN profiles p ON p.user_id = u.id
  WHERE u.email = 'cliente.floripa@demo.com'  -- ← SUBSTITUIR
    AND p.role  = 'cliente'
  LIMIT 1;

  SELECT u.id INTO v_technician_id
  FROM auth.users u
  INNER JOIN profiles p ON p.user_id = u.id
  WHERE u.email = 'tecnico.floripa@demo.com'  -- ← SUBSTITUIR
    AND p.role  = 'tecnico'
  LIMIT 1;

  IF v_client_id IS NOT NULL AND v_technician_id IS NOT NULL THEN
    INSERT INTO service_requests (
      client_id,
      technician_id,
      city,
      address,
      module_count,
      panel_count,
      price_estimate,
      preco_min,
      preco_max,
      status,
      payment_status,
      tipo_instalacao,
      nivel_sujeira,
      nivel_acesso,
      distancia_km,
      latitude,
      longitude,
      preferred_date,
      preferred_time,
      accepted_at,
      notes
    ) VALUES (
      v_client_id,
      v_technician_id,
      'Florianópolis',
      'Av. Beira Mar Norte, 2.100 — Agronômica',
      80,
      80,
      1140.00,
      1026.00,
      1368.00,
      'accepted',
      'confirmed',
      'telhado_padrao',
      'normal',
      'normal',
      15.0,
      -27.6020,
      -48.5400,
      CURRENT_DATE + INTERVAL '1 day',
      '08:00',
      NOW() - INTERVAL '3 hours',
      NULL
    );
    RAISE NOTICE 'Serviço 6 (Florianópolis - aceito) inserido.';
  ELSE
    RAISE NOTICE 'AVISO: cliente ou técnico de Florianópolis não encontrado — Serviço 6 ignorado.';
  END IF;
END $$;


-- =============================================================================
-- VERIFICAÇÃO FINAL
-- =============================================================================
-- Execute estas queries para conferir o resultado:

-- Técnicos com coordenadas:
-- SELECT p.full_name, p.city, p.cep, p.lat, p.lng,
--        CASE WHEN p.last_seen > NOW() - INTERVAL '5 minutes'
--             THEN 'ONLINE' ELSE 'OFFLINE' END AS presenca
-- FROM profiles p
-- WHERE p.role = 'tecnico'
-- ORDER BY p.city;

-- Serviços com coordenadas:
-- SELECT sr.city, sr.address, sr.status, sr.payment_status,
--        sr.module_count, sr.price_estimate, sr.latitude, sr.longitude
-- FROM service_requests sr
-- ORDER BY sr.created_at DESC
-- LIMIT 10;
