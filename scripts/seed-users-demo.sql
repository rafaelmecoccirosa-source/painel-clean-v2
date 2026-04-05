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
-- IDEMPOTENTE — LÓGICA DE VERIFICAÇÃO (v2):
--   Cada usuário segue o padrão em duas etapas independentes:
--     1. Busca o user_id em auth.users pelo email.
--        Se não existe → cria. Se já existe → reutiliza o uid existente.
--     2. Verifica se profiles já tem uma linha para aquele user_id.
--        Se não existe → cria. Se já existe → pula.
--   Isso garante que estados parciais (auth.users criado mas profiles
--   faltando, ou vice-versa) sejam corrigidos na re-execução.
--
-- COLISÃO COM USUÁRIOS REAIS:
--   Todos os emails usam o domínio @demo.painelclean.com.br.
--   Usuários reais tipicamente usam @gmail.com, @hotmail.com, etc.
--   Colisão é impossível a menos que alguém tenha se cadastrado
--   deliberadamente com esse domínio.
--
-- NOTA SOBRE last_seen / STATUS ONLINE:
--   O sistema considera "online" last_seen nos últimos 5 minutos.
--   Os 3 técnicos "online" têm last_seen = NOW() - 2 ou 3 minutos.
--   Os demais têm last_seen de horas atrás → aparecem como "offline".
--
-- PRÉ-REQUISITOS:
--   Migrations aplicadas:
--     • 20260330_service_requests.sql
--     • 20260404_technician_presence_location.sql (last_seen, cep, lat, lng)
-- =============================================================================


-- Helper: macro de inserção usada em cada bloco abaixo.
-- Padrão para cada usuário:
--
--   SELECT id INTO uid FROM auth.users WHERE email = '...';
--   IF uid IS NULL THEN
--     uid := gen_random_uuid();
--     INSERT INTO auth.users ...
--   END IF;
--   IF NOT EXISTS (SELECT 1 FROM profiles WHERE user_id = uid) THEN
--     INSERT INTO profiles ...
--   END IF;


-- ============================================================================
-- TÉCNICO 1 — Carlos Souza — Jaraguá do Sul — ONLINE
-- ============================================================================
DO $$
DECLARE uid UUID;
BEGIN
  SELECT id INTO uid FROM auth.users
  WHERE email = 'carlos.souza@demo.painelclean.com.br';

  IF uid IS NULL THEN
    uid := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password,
      email_confirmed_at, aud, role,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      uid, '00000000-0000-0000-0000-000000000000',
      'carlos.souza@demo.painelclean.com.br',
      crypt('Demo@2026!', gen_salt('bf')),
      NOW(), 'authenticated', 'authenticated',
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Carlos Souza"}',
      NOW(), NOW(), '', '', '', ''
    );
    RAISE NOTICE 'auth.users criado: Carlos Souza';
  ELSE
    RAISE NOTICE 'auth.users já existe: Carlos Souza (uid=%) — reutilizando', uid;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM profiles WHERE user_id = uid) THEN
    INSERT INTO profiles (id, user_id, role, full_name, phone, city, cep, lat, lng, last_seen)
    VALUES (gen_random_uuid(), uid, 'tecnico', 'Carlos Souza',
            '(47) 99101-0001', 'Jaraguá do Sul',
            '89251-000', -26.4854, -49.0713,
            NOW());  -- ONLINE
    RAISE NOTICE 'profile criado: Carlos Souza';
  ELSE
    RAISE NOTICE 'profile já existe: Carlos Souza — ignorado';
  END IF;
END $$;


-- ============================================================================
-- TÉCNICO 2 — Lucas Martins — Jaraguá do Sul — offline (3h)
-- ============================================================================
DO $$
DECLARE uid UUID;
BEGIN
  SELECT id INTO uid FROM auth.users
  WHERE email = 'lucas.martins@demo.painelclean.com.br';

  IF uid IS NULL THEN
    uid := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password,
      email_confirmed_at, aud, role,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      uid, '00000000-0000-0000-0000-000000000000',
      'lucas.martins@demo.painelclean.com.br',
      crypt('Demo@2026!', gen_salt('bf')),
      NOW(), 'authenticated', 'authenticated',
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Lucas Martins"}',
      NOW(), NOW(), '', '', '', ''
    );
    RAISE NOTICE 'auth.users criado: Lucas Martins';
  ELSE
    RAISE NOTICE 'auth.users já existe: Lucas Martins — reutilizando';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM profiles WHERE user_id = uid) THEN
    INSERT INTO profiles (id, user_id, role, full_name, phone, city, cep, lat, lng, last_seen)
    VALUES (gen_random_uuid(), uid, 'tecnico', 'Lucas Martins',
            '(47) 99101-0002', 'Jaraguá do Sul',
            '89251-000', -26.4920, -49.0650,
            NOW() - INTERVAL '3 hours');  -- offline
    RAISE NOTICE 'profile criado: Lucas Martins';
  ELSE
    RAISE NOTICE 'profile já existe: Lucas Martins — ignorado';
  END IF;
END $$;


-- ============================================================================
-- TÉCNICO 3 — Pedro Santos — Pomerode — ONLINE (last_seen = NOW()-2min)
-- ============================================================================
DO $$
DECLARE uid UUID;
BEGIN
  SELECT id INTO uid FROM auth.users
  WHERE email = 'pedro.santos@demo.painelclean.com.br';

  IF uid IS NULL THEN
    uid := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password,
      email_confirmed_at, aud, role,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      uid, '00000000-0000-0000-0000-000000000000',
      'pedro.santos@demo.painelclean.com.br',
      crypt('Demo@2026!', gen_salt('bf')),
      NOW(), 'authenticated', 'authenticated',
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Pedro Santos"}',
      NOW(), NOW(), '', '', '', ''
    );
    RAISE NOTICE 'auth.users criado: Pedro Santos';
  ELSE
    RAISE NOTICE 'auth.users já existe: Pedro Santos — reutilizando';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM profiles WHERE user_id = uid) THEN
    INSERT INTO profiles (id, user_id, role, full_name, phone, city, cep, lat, lng, last_seen)
    VALUES (gen_random_uuid(), uid, 'tecnico', 'Pedro Santos',
            '(47) 99107-0003', 'Pomerode',
            '89107-000', -26.7407, -49.1764,
            NOW() - INTERVAL '2 minutes');  -- ONLINE (< 5min)
    RAISE NOTICE 'profile criado: Pedro Santos';
  ELSE
    RAISE NOTICE 'profile já existe: Pedro Santos — ignorado';
  END IF;
END $$;


-- ============================================================================
-- TÉCNICO 4 — Diego Ferreira — Pomerode — offline (5h)
-- ============================================================================
DO $$
DECLARE uid UUID;
BEGIN
  SELECT id INTO uid FROM auth.users
  WHERE email = 'diego.ferreira@demo.painelclean.com.br';

  IF uid IS NULL THEN
    uid := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password,
      email_confirmed_at, aud, role,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      uid, '00000000-0000-0000-0000-000000000000',
      'diego.ferreira@demo.painelclean.com.br',
      crypt('Demo@2026!', gen_salt('bf')),
      NOW(), 'authenticated', 'authenticated',
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Diego Ferreira"}',
      NOW(), NOW(), '', '', '', ''
    );
    RAISE NOTICE 'auth.users criado: Diego Ferreira';
  ELSE
    RAISE NOTICE 'auth.users já existe: Diego Ferreira — reutilizando';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM profiles WHERE user_id = uid) THEN
    INSERT INTO profiles (id, user_id, role, full_name, phone, city, cep, lat, lng, last_seen)
    VALUES (gen_random_uuid(), uid, 'tecnico', 'Diego Ferreira',
            '(47) 99107-0004', 'Pomerode',
            '89107-000', -26.7350, -49.1820,
            NOW() - INTERVAL '5 hours');  -- offline
    RAISE NOTICE 'profile criado: Diego Ferreira';
  ELSE
    RAISE NOTICE 'profile já existe: Diego Ferreira — ignorado';
  END IF;
END $$;


-- ============================================================================
-- TÉCNICO 5 — Roberto Lima — Florianópolis — ONLINE (last_seen = NOW()-3min)
-- ============================================================================
DO $$
DECLARE uid UUID;
BEGIN
  SELECT id INTO uid FROM auth.users
  WHERE email = 'roberto.lima@demo.painelclean.com.br';

  IF uid IS NULL THEN
    uid := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password,
      email_confirmed_at, aud, role,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      uid, '00000000-0000-0000-0000-000000000000',
      'roberto.lima@demo.painelclean.com.br',
      crypt('Demo@2026!', gen_salt('bf')),
      NOW(), 'authenticated', 'authenticated',
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Roberto Lima"}',
      NOW(), NOW(), '', '', '', ''
    );
    RAISE NOTICE 'auth.users criado: Roberto Lima';
  ELSE
    RAISE NOTICE 'auth.users já existe: Roberto Lima — reutilizando';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM profiles WHERE user_id = uid) THEN
    INSERT INTO profiles (id, user_id, role, full_name, phone, city, cep, lat, lng, last_seen)
    VALUES (gen_random_uuid(), uid, 'tecnico', 'Roberto Lima',
            '(48) 99880-0005', 'Florianópolis',
            '88015-000', -27.5954, -48.5480,
            NOW() - INTERVAL '3 minutes');  -- ONLINE (< 5min)
    RAISE NOTICE 'profile criado: Roberto Lima';
  ELSE
    RAISE NOTICE 'profile já existe: Roberto Lima — ignorado';
  END IF;
END $$;


-- ============================================================================
-- TÉCNICO 6 — Amanda Reis — Florianópolis — offline (4h)
-- ============================================================================
DO $$
DECLARE uid UUID;
BEGIN
  SELECT id INTO uid FROM auth.users
  WHERE email = 'amanda.reis@demo.painelclean.com.br';

  IF uid IS NULL THEN
    uid := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password,
      email_confirmed_at, aud, role,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      uid, '00000000-0000-0000-0000-000000000000',
      'amanda.reis@demo.painelclean.com.br',
      crypt('Demo@2026!', gen_salt('bf')),
      NOW(), 'authenticated', 'authenticated',
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Amanda Reis"}',
      NOW(), NOW(), '', '', '', ''
    );
    RAISE NOTICE 'auth.users criado: Amanda Reis';
  ELSE
    RAISE NOTICE 'auth.users já existe: Amanda Reis — reutilizando';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM profiles WHERE user_id = uid) THEN
    INSERT INTO profiles (id, user_id, role, full_name, phone, city, cep, lat, lng, last_seen)
    VALUES (gen_random_uuid(), uid, 'tecnico', 'Amanda Reis',
            '(48) 99880-0006', 'Florianópolis',
            '88015-000', -27.6020, -48.5400,
            NOW() - INTERVAL '4 hours');  -- offline
    RAISE NOTICE 'profile criado: Amanda Reis';
  ELSE
    RAISE NOTICE 'profile já existe: Amanda Reis — ignorado';
  END IF;
END $$;


-- ============================================================================
-- CLIENTE 1 — Ana Silva — Jaraguá do Sul
-- ============================================================================
DO $$
DECLARE uid UUID;
BEGIN
  SELECT id INTO uid FROM auth.users
  WHERE email = 'ana.silva@demo.painelclean.com.br';

  IF uid IS NULL THEN
    uid := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password,
      email_confirmed_at, aud, role,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      uid, '00000000-0000-0000-0000-000000000000',
      'ana.silva@demo.painelclean.com.br',
      crypt('Demo@2026!', gen_salt('bf')),
      NOW(), 'authenticated', 'authenticated',
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Ana Silva"}',
      NOW(), NOW(), '', '', '', ''
    );
    RAISE NOTICE 'auth.users criado: Ana Silva';
  ELSE
    RAISE NOTICE 'auth.users já existe: Ana Silva — reutilizando';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM profiles WHERE user_id = uid) THEN
    INSERT INTO profiles (id, user_id, role, full_name, phone, city)
    VALUES (gen_random_uuid(), uid, 'cliente', 'Ana Silva',
            '(47) 99201-0007', 'Jaraguá do Sul');
    RAISE NOTICE 'profile criado: Ana Silva';
  ELSE
    RAISE NOTICE 'profile já existe: Ana Silva — ignorado';
  END IF;
END $$;


-- ============================================================================
-- CLIENTE 2 — Fernanda Alves — Jaraguá do Sul
-- ============================================================================
DO $$
DECLARE uid UUID;
BEGIN
  SELECT id INTO uid FROM auth.users
  WHERE email = 'fernanda.alves@demo.painelclean.com.br';

  IF uid IS NULL THEN
    uid := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password,
      email_confirmed_at, aud, role,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      uid, '00000000-0000-0000-0000-000000000000',
      'fernanda.alves@demo.painelclean.com.br',
      crypt('Demo@2026!', gen_salt('bf')),
      NOW(), 'authenticated', 'authenticated',
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Fernanda Alves"}',
      NOW(), NOW(), '', '', '', ''
    );
    RAISE NOTICE 'auth.users criado: Fernanda Alves';
  ELSE
    RAISE NOTICE 'auth.users já existe: Fernanda Alves — reutilizando';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM profiles WHERE user_id = uid) THEN
    INSERT INTO profiles (id, user_id, role, full_name, phone, city)
    VALUES (gen_random_uuid(), uid, 'cliente', 'Fernanda Alves',
            '(47) 99201-0008', 'Jaraguá do Sul');
    RAISE NOTICE 'profile criado: Fernanda Alves';
  ELSE
    RAISE NOTICE 'profile já existe: Fernanda Alves — ignorado';
  END IF;
END $$;


-- ============================================================================
-- CLIENTE 3 — Camila Rocha — Pomerode
-- ============================================================================
DO $$
DECLARE uid UUID;
BEGIN
  SELECT id INTO uid FROM auth.users
  WHERE email = 'camila.rocha@demo.painelclean.com.br';

  IF uid IS NULL THEN
    uid := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password,
      email_confirmed_at, aud, role,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      uid, '00000000-0000-0000-0000-000000000000',
      'camila.rocha@demo.painelclean.com.br',
      crypt('Demo@2026!', gen_salt('bf')),
      NOW(), 'authenticated', 'authenticated',
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Camila Rocha"}',
      NOW(), NOW(), '', '', '', ''
    );
    RAISE NOTICE 'auth.users criado: Camila Rocha';
  ELSE
    RAISE NOTICE 'auth.users já existe: Camila Rocha — reutilizando';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM profiles WHERE user_id = uid) THEN
    INSERT INTO profiles (id, user_id, role, full_name, phone, city)
    VALUES (gen_random_uuid(), uid, 'cliente', 'Camila Rocha',
            '(47) 99107-0009', 'Pomerode');
    RAISE NOTICE 'profile criado: Camila Rocha';
  ELSE
    RAISE NOTICE 'profile já existe: Camila Rocha — ignorado';
  END IF;
END $$;


-- ============================================================================
-- CLIENTE 4 — Maria Oliveira — Florianópolis
-- ============================================================================
DO $$
DECLARE uid UUID;
BEGIN
  SELECT id INTO uid FROM auth.users
  WHERE email = 'maria.oliveira@demo.painelclean.com.br';

  IF uid IS NULL THEN
    uid := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password,
      email_confirmed_at, aud, role,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      uid, '00000000-0000-0000-0000-000000000000',
      'maria.oliveira@demo.painelclean.com.br',
      crypt('Demo@2026!', gen_salt('bf')),
      NOW(), 'authenticated', 'authenticated',
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Maria Oliveira"}',
      NOW(), NOW(), '', '', '', ''
    );
    RAISE NOTICE 'auth.users criado: Maria Oliveira';
  ELSE
    RAISE NOTICE 'auth.users já existe: Maria Oliveira — reutilizando';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM profiles WHERE user_id = uid) THEN
    INSERT INTO profiles (id, user_id, role, full_name, phone, city)
    VALUES (gen_random_uuid(), uid, 'cliente', 'Maria Oliveira',
            '(48) 99880-0010', 'Florianópolis');
    RAISE NOTICE 'profile criado: Maria Oliveira';
  ELSE
    RAISE NOTICE 'profile já existe: Maria Oliveira — ignorado';
  END IF;
END $$;


-- ============================================================================
-- CLIENTE 5 — Juliana Costa — Florianópolis
-- ============================================================================
DO $$
DECLARE uid UUID;
BEGIN
  SELECT id INTO uid FROM auth.users
  WHERE email = 'juliana.costa@demo.painelclean.com.br';

  IF uid IS NULL THEN
    uid := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password,
      email_confirmed_at, aud, role,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      uid, '00000000-0000-0000-0000-000000000000',
      'juliana.costa@demo.painelclean.com.br',
      crypt('Demo@2026!', gen_salt('bf')),
      NOW(), 'authenticated', 'authenticated',
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Juliana Costa"}',
      NOW(), NOW(), '', '', '', ''
    );
    RAISE NOTICE 'auth.users criado: Juliana Costa';
  ELSE
    RAISE NOTICE 'auth.users já existe: Juliana Costa — reutilizando';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM profiles WHERE user_id = uid) THEN
    INSERT INTO profiles (id, user_id, role, full_name, phone, city)
    VALUES (gen_random_uuid(), uid, 'cliente', 'Juliana Costa',
            '(48) 99880-0011', 'Florianópolis');
    RAISE NOTICE 'profile criado: Juliana Costa';
  ELSE
    RAISE NOTICE 'profile já existe: Juliana Costa — ignorado';
  END IF;
END $$;


-- ============================================================================
-- CLIENTE 6 — Ricardo Mendes — Blumenau
-- ============================================================================
DO $$
DECLARE uid UUID;
BEGIN
  SELECT id INTO uid FROM auth.users
  WHERE email = 'ricardo.mendes@demo.painelclean.com.br';

  IF uid IS NULL THEN
    uid := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password,
      email_confirmed_at, aud, role,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      uid, '00000000-0000-0000-0000-000000000000',
      'ricardo.mendes@demo.painelclean.com.br',
      crypt('Demo@2026!', gen_salt('bf')),
      NOW(), 'authenticated', 'authenticated',
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Ricardo Mendes"}',
      NOW(), NOW(), '', '', '', ''
    );
    RAISE NOTICE 'auth.users criado: Ricardo Mendes';
  ELSE
    RAISE NOTICE 'auth.users já existe: Ricardo Mendes — reutilizando';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM profiles WHERE user_id = uid) THEN
    INSERT INTO profiles (id, user_id, role, full_name, phone, city)
    VALUES (gen_random_uuid(), uid, 'cliente', 'Ricardo Mendes',
            '(47) 99322-0012', 'Blumenau');
    RAISE NOTICE 'profile criado: Ricardo Mendes';
  ELSE
    RAISE NOTICE 'profile já existe: Ricardo Mendes — ignorado';
  END IF;
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
-- ATENÇÃO: apaga permanentemente os usuários e todos os dados vinculados.
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
