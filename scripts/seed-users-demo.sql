-- =============================================================================
-- SEED: Usuários fictícios de demonstração — técnicos e clientes
-- =============================================================================
--
-- COMO EXECUTAR:
--   1. Acesse https://app.supabase.com → seu projeto → SQL Editor → New query
--   2. Cole todo o conteúdo deste arquivo
--   3. Clique em "Run"
--   4. Todos os usuários são criados com senha: Demo@2026!
--
-- COMO FAZER LOGIN:
--   Email: nome.sobrenome@demo.painelclean.com.br
--   Senha: Demo@2026!
--   Exemplos:
--     carlos.souza@demo.painelclean.com.br   (técnico, Jaraguá, ONLINE)
--     pedro.santos@demo.painelclean.com.br   (técnico, Pomerode, ONLINE)
--     roberto.lima@demo.painelclean.com.br   (técnico, Floripa, ONLINE)
--     ana.silva@demo.painelclean.com.br      (cliente, Jaraguá)
--     maria.oliveira@demo.painelclean.com.br (cliente, Floripa)
--
-- IDEMPOTENTE:
--   Seguro re-executar — usuários já existentes são ignorados (IF NOT EXISTS).
--
-- NOTA SOBRE last_seen / STATUS ONLINE:
--   O sistema considera "online" last_seen nos últimos 5 minutos (PresencePing).
--   Os 3 técnicos marcados como "online" têm last_seen = NOW() - 2 ou 3 minutos.
--   Os demais têm last_seen de horas atrás → aparecem como "offline".
--
-- PRÉ-REQUISITOS:
--   Migrations aplicadas:
--     • 20260330_service_requests.sql
--     • 20260404_technician_presence_location.sql (last_seen, cep, lat, lng)
-- =============================================================================


DO $$
DECLARE
  uid UUID;
BEGIN

-- ============================================================================
-- TÉCNICOS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Carlos Souza — Jaraguá do Sul — ONLINE (last_seen = agora)
-- ----------------------------------------------------------------------------
IF NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'carlos.souza@demo.painelclean.com.br'
) THEN
  uid := gen_random_uuid();

  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password,
    email_confirmed_at, aud, role,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) VALUES (
    uid,
    '00000000-0000-0000-0000-000000000000',
    'carlos.souza@demo.painelclean.com.br',
    crypt('Demo@2026!', gen_salt('bf')),
    NOW(), 'authenticated', 'authenticated',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Carlos Souza"}',
    NOW(), NOW(), '', '', '', ''
  );

  INSERT INTO profiles (
    id, user_id, role, full_name, phone, city,
    cep, lat, lng, last_seen
  ) VALUES (
    gen_random_uuid(), uid, 'tecnico', 'Carlos Souza',
    '(47) 99101-0001', 'Jaraguá do Sul',
    '89251-000', -26.4854, -49.0713,
    NOW()  -- ONLINE
  );

  RAISE NOTICE 'Criado: Carlos Souza (técnico, Jaraguá do Sul, ONLINE)';
ELSE
  RAISE NOTICE 'Já existe: carlos.souza@demo.painelclean.com.br — ignorado';
END IF;


-- ----------------------------------------------------------------------------
-- 2. Lucas Martins — Jaraguá do Sul — offline (3h atrás)
-- ----------------------------------------------------------------------------
IF NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'lucas.martins@demo.painelclean.com.br'
) THEN
  uid := gen_random_uuid();

  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password,
    email_confirmed_at, aud, role,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) VALUES (
    uid,
    '00000000-0000-0000-0000-000000000000',
    'lucas.martins@demo.painelclean.com.br',
    crypt('Demo@2026!', gen_salt('bf')),
    NOW(), 'authenticated', 'authenticated',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Lucas Martins"}',
    NOW(), NOW(), '', '', '', ''
  );

  INSERT INTO profiles (
    id, user_id, role, full_name, phone, city,
    cep, lat, lng, last_seen
  ) VALUES (
    gen_random_uuid(), uid, 'tecnico', 'Lucas Martins',
    '(47) 99101-0002', 'Jaraguá do Sul',
    '89251-000', -26.4920, -49.0650,
    NOW() - INTERVAL '3 hours'  -- offline
  );

  RAISE NOTICE 'Criado: Lucas Martins (técnico, Jaraguá do Sul, offline)';
ELSE
  RAISE NOTICE 'Já existe: lucas.martins@demo.painelclean.com.br — ignorado';
END IF;


-- ----------------------------------------------------------------------------
-- 3. Pedro Santos — Pomerode — ONLINE
--    (last_seen ajustado para 2min atrás — threshold online = 5min)
-- ----------------------------------------------------------------------------
IF NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'pedro.santos@demo.painelclean.com.br'
) THEN
  uid := gen_random_uuid();

  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password,
    email_confirmed_at, aud, role,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) VALUES (
    uid,
    '00000000-0000-0000-0000-000000000000',
    'pedro.santos@demo.painelclean.com.br',
    crypt('Demo@2026!', gen_salt('bf')),
    NOW(), 'authenticated', 'authenticated',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Pedro Santos"}',
    NOW(), NOW(), '', '', '', ''
  );

  INSERT INTO profiles (
    id, user_id, role, full_name, phone, city,
    cep, lat, lng, last_seen
  ) VALUES (
    gen_random_uuid(), uid, 'tecnico', 'Pedro Santos',
    '(47) 99107-0003', 'Pomerode',
    '89107-000', -26.7407, -49.1764,
    NOW() - INTERVAL '2 minutes'  -- ONLINE (< 5min)
  );

  RAISE NOTICE 'Criado: Pedro Santos (técnico, Pomerode, ONLINE)';
ELSE
  RAISE NOTICE 'Já existe: pedro.santos@demo.painelclean.com.br — ignorado';
END IF;


-- ----------------------------------------------------------------------------
-- 4. Diego Ferreira — Pomerode — offline (5h atrás)
-- ----------------------------------------------------------------------------
IF NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'diego.ferreira@demo.painelclean.com.br'
) THEN
  uid := gen_random_uuid();

  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password,
    email_confirmed_at, aud, role,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) VALUES (
    uid,
    '00000000-0000-0000-0000-000000000000',
    'diego.ferreira@demo.painelclean.com.br',
    crypt('Demo@2026!', gen_salt('bf')),
    NOW(), 'authenticated', 'authenticated',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Diego Ferreira"}',
    NOW(), NOW(), '', '', '', ''
  );

  INSERT INTO profiles (
    id, user_id, role, full_name, phone, city,
    cep, lat, lng, last_seen
  ) VALUES (
    gen_random_uuid(), uid, 'tecnico', 'Diego Ferreira',
    '(47) 99107-0004', 'Pomerode',
    '89107-000', -26.7350, -49.1820,
    NOW() - INTERVAL '5 hours'  -- offline
  );

  RAISE NOTICE 'Criado: Diego Ferreira (técnico, Pomerode, offline)';
ELSE
  RAISE NOTICE 'Já existe: diego.ferreira@demo.painelclean.com.br — ignorado';
END IF;


-- ----------------------------------------------------------------------------
-- 5. Roberto Lima — Florianópolis — ONLINE
--    (last_seen ajustado para 3min atrás — threshold online = 5min)
-- ----------------------------------------------------------------------------
IF NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'roberto.lima@demo.painelclean.com.br'
) THEN
  uid := gen_random_uuid();

  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password,
    email_confirmed_at, aud, role,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) VALUES (
    uid,
    '00000000-0000-0000-0000-000000000000',
    'roberto.lima@demo.painelclean.com.br',
    crypt('Demo@2026!', gen_salt('bf')),
    NOW(), 'authenticated', 'authenticated',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Roberto Lima"}',
    NOW(), NOW(), '', '', '', ''
  );

  INSERT INTO profiles (
    id, user_id, role, full_name, phone, city,
    cep, lat, lng, last_seen
  ) VALUES (
    gen_random_uuid(), uid, 'tecnico', 'Roberto Lima',
    '(48) 99880-0005', 'Florianópolis',
    '88015-000', -27.5954, -48.5480,
    NOW() - INTERVAL '3 minutes'  -- ONLINE (< 5min)
  );

  RAISE NOTICE 'Criado: Roberto Lima (técnico, Florianópolis, ONLINE)';
ELSE
  RAISE NOTICE 'Já existe: roberto.lima@demo.painelclean.com.br — ignorado';
END IF;


-- ----------------------------------------------------------------------------
-- 6. Amanda Reis — Florianópolis — offline (4h atrás)
-- ----------------------------------------------------------------------------
IF NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'amanda.reis@demo.painelclean.com.br'
) THEN
  uid := gen_random_uuid();

  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password,
    email_confirmed_at, aud, role,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) VALUES (
    uid,
    '00000000-0000-0000-0000-000000000000',
    'amanda.reis@demo.painelclean.com.br',
    crypt('Demo@2026!', gen_salt('bf')),
    NOW(), 'authenticated', 'authenticated',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Amanda Reis"}',
    NOW(), NOW(), '', '', '', ''
  );

  INSERT INTO profiles (
    id, user_id, role, full_name, phone, city,
    cep, lat, lng, last_seen
  ) VALUES (
    gen_random_uuid(), uid, 'tecnico', 'Amanda Reis',
    '(48) 99880-0006', 'Florianópolis',
    '88015-000', -27.6020, -48.5400,
    NOW() - INTERVAL '4 hours'  -- offline
  );

  RAISE NOTICE 'Criado: Amanda Reis (técnico, Florianópolis, offline)';
ELSE
  RAISE NOTICE 'Já existe: amanda.reis@demo.painelclean.com.br — ignorado';
END IF;


-- ============================================================================
-- CLIENTES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 7. Ana Silva — Jaraguá do Sul
-- ----------------------------------------------------------------------------
IF NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'ana.silva@demo.painelclean.com.br'
) THEN
  uid := gen_random_uuid();

  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password,
    email_confirmed_at, aud, role,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) VALUES (
    uid,
    '00000000-0000-0000-0000-000000000000',
    'ana.silva@demo.painelclean.com.br',
    crypt('Demo@2026!', gen_salt('bf')),
    NOW(), 'authenticated', 'authenticated',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Ana Silva"}',
    NOW(), NOW(), '', '', '', ''
  );

  INSERT INTO profiles (
    id, user_id, role, full_name, phone, city
  ) VALUES (
    gen_random_uuid(), uid, 'cliente', 'Ana Silva',
    '(47) 99201-0007', 'Jaraguá do Sul'
  );

  RAISE NOTICE 'Criado: Ana Silva (cliente, Jaraguá do Sul)';
ELSE
  RAISE NOTICE 'Já existe: ana.silva@demo.painelclean.com.br — ignorado';
END IF;


-- ----------------------------------------------------------------------------
-- 8. Fernanda Alves — Jaraguá do Sul
-- ----------------------------------------------------------------------------
IF NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'fernanda.alves@demo.painelclean.com.br'
) THEN
  uid := gen_random_uuid();

  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password,
    email_confirmed_at, aud, role,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) VALUES (
    uid,
    '00000000-0000-0000-0000-000000000000',
    'fernanda.alves@demo.painelclean.com.br',
    crypt('Demo@2026!', gen_salt('bf')),
    NOW(), 'authenticated', 'authenticated',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Fernanda Alves"}',
    NOW(), NOW(), '', '', '', ''
  );

  INSERT INTO profiles (
    id, user_id, role, full_name, phone, city
  ) VALUES (
    gen_random_uuid(), uid, 'cliente', 'Fernanda Alves',
    '(47) 99201-0008', 'Jaraguá do Sul'
  );

  RAISE NOTICE 'Criado: Fernanda Alves (cliente, Jaraguá do Sul)';
ELSE
  RAISE NOTICE 'Já existe: fernanda.alves@demo.painelclean.com.br — ignorado';
END IF;


-- ----------------------------------------------------------------------------
-- 9. Camila Rocha — Pomerode
-- ----------------------------------------------------------------------------
IF NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'camila.rocha@demo.painelclean.com.br'
) THEN
  uid := gen_random_uuid();

  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password,
    email_confirmed_at, aud, role,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) VALUES (
    uid,
    '00000000-0000-0000-0000-000000000000',
    'camila.rocha@demo.painelclean.com.br',
    crypt('Demo@2026!', gen_salt('bf')),
    NOW(), 'authenticated', 'authenticated',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Camila Rocha"}',
    NOW(), NOW(), '', '', '', ''
  );

  INSERT INTO profiles (
    id, user_id, role, full_name, phone, city
  ) VALUES (
    gen_random_uuid(), uid, 'cliente', 'Camila Rocha',
    '(47) 99107-0009', 'Pomerode'
  );

  RAISE NOTICE 'Criado: Camila Rocha (cliente, Pomerode)';
ELSE
  RAISE NOTICE 'Já existe: camila.rocha@demo.painelclean.com.br — ignorado';
END IF;


-- ----------------------------------------------------------------------------
-- 10. Maria Oliveira — Florianópolis
-- ----------------------------------------------------------------------------
IF NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'maria.oliveira@demo.painelclean.com.br'
) THEN
  uid := gen_random_uuid();

  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password,
    email_confirmed_at, aud, role,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) VALUES (
    uid,
    '00000000-0000-0000-0000-000000000000',
    'maria.oliveira@demo.painelclean.com.br',
    crypt('Demo@2026!', gen_salt('bf')),
    NOW(), 'authenticated', 'authenticated',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Maria Oliveira"}',
    NOW(), NOW(), '', '', '', ''
  );

  INSERT INTO profiles (
    id, user_id, role, full_name, phone, city
  ) VALUES (
    gen_random_uuid(), uid, 'cliente', 'Maria Oliveira',
    '(48) 99880-0010', 'Florianópolis'
  );

  RAISE NOTICE 'Criado: Maria Oliveira (cliente, Florianópolis)';
ELSE
  RAISE NOTICE 'Já existe: maria.oliveira@demo.painelclean.com.br — ignorado';
END IF;


-- ----------------------------------------------------------------------------
-- 11. Juliana Costa — Florianópolis
-- ----------------------------------------------------------------------------
IF NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'juliana.costa@demo.painelclean.com.br'
) THEN
  uid := gen_random_uuid();

  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password,
    email_confirmed_at, aud, role,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) VALUES (
    uid,
    '00000000-0000-0000-0000-000000000000',
    'juliana.costa@demo.painelclean.com.br',
    crypt('Demo@2026!', gen_salt('bf')),
    NOW(), 'authenticated', 'authenticated',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Juliana Costa"}',
    NOW(), NOW(), '', '', '', ''
  );

  INSERT INTO profiles (
    id, user_id, role, full_name, phone, city
  ) VALUES (
    gen_random_uuid(), uid, 'cliente', 'Juliana Costa',
    '(48) 99880-0011', 'Florianópolis'
  );

  RAISE NOTICE 'Criado: Juliana Costa (cliente, Florianópolis)';
ELSE
  RAISE NOTICE 'Já existe: juliana.costa@demo.painelclean.com.br — ignorado';
END IF;


-- ----------------------------------------------------------------------------
-- 12. Ricardo Mendes — Blumenau
-- ----------------------------------------------------------------------------
IF NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'ricardo.mendes@demo.painelclean.com.br'
) THEN
  uid := gen_random_uuid();

  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password,
    email_confirmed_at, aud, role,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) VALUES (
    uid,
    '00000000-0000-0000-0000-000000000000',
    'ricardo.mendes@demo.painelclean.com.br',
    crypt('Demo@2026!', gen_salt('bf')),
    NOW(), 'authenticated', 'authenticated',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Ricardo Mendes"}',
    NOW(), NOW(), '', '', '', ''
  );

  INSERT INTO profiles (
    id, user_id, role, full_name, phone, city
  ) VALUES (
    gen_random_uuid(), uid, 'cliente', 'Ricardo Mendes',
    '(47) 99322-0012', 'Blumenau'
  );

  RAISE NOTICE 'Criado: Ricardo Mendes (cliente, Blumenau)';
ELSE
  RAISE NOTICE 'Já existe: ricardo.mendes@demo.painelclean.com.br — ignorado';
END IF;


RAISE NOTICE '=== Seed concluído. 12 usuários processados. ===';
END $$;


-- =============================================================================
-- VERIFICAÇÃO — execute após o seed para confirmar
-- =============================================================================
-- SELECT
--   u.email,
--   p.role,
--   p.full_name,
--   p.city,
--   CASE
--     WHEN p.role = 'tecnico' AND p.last_seen > NOW() - INTERVAL '5 minutes'
--       THEN 'ONLINE'
--     WHEN p.role = 'tecnico'
--       THEN 'offline'
--     ELSE '—'
--   END AS presenca,
--   p.lat IS NOT NULL AS tem_coordenada
-- FROM auth.users u
-- INNER JOIN profiles p ON p.user_id = u.id
-- WHERE u.email LIKE '%@demo.painelclean.com.br'
-- ORDER BY p.role DESC, p.city, p.full_name;


-- =============================================================================
-- ROLLBACK / CLEANUP — descomente para remover TODOS os usuários demo
-- =============================================================================
--
-- ATENÇÃO: isso apaga permanentemente os usuários e todos os dados vinculados.
-- Execute apenas quando tiver certeza.
--
/*

-- 1. Remove service_requests vinculados a clientes/técnicos demo
DELETE FROM service_requests
WHERE client_id IN (
  SELECT u.id FROM auth.users u
  WHERE u.email LIKE '%@demo.painelclean.com.br'
)
OR technician_id IN (
  SELECT u.id FROM auth.users u
  WHERE u.email LIKE '%@demo.painelclean.com.br'
);

-- 2. Remove profiles
DELETE FROM profiles
WHERE user_id IN (
  SELECT id FROM auth.users
  WHERE email LIKE '%@demo.painelclean.com.br'
);

-- 3. Remove de auth.users (sempre por último por causa do FK)
DELETE FROM auth.users
WHERE email LIKE '%@demo.painelclean.com.br';

*/
