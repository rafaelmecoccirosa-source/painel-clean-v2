-- Fix RLS para técnicos verem chamados disponíveis
-- Problema: a policy "Technicians view available and own" não verifica o role,
-- permitindo que qualquer usuário autenticado veja todos os pedidos pending.
-- Esta migration corrige isso verificando o role na tabela profiles.
--
-- Executar no Supabase SQL Editor → New query

-- 1. Remover policy antiga que não verifica role
DROP POLICY IF EXISTS "Technicians view available and own" ON service_requests;

-- 2. Criar policy correta — técnico vê chamados sem técnico (disponíveis) + os seus
CREATE POLICY "Technicians view available and own"
  ON service_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = auth.uid()
        AND p.role = 'tecnico'
        AND (
          service_requests.technician_id IS NULL
          OR service_requests.technician_id = auth.uid()
        )
    )
  );

-- 3. Confirmar que a policy do cliente só vê os próprios pedidos (não os de outros)
-- (deve já existir — recriar por segurança)
DROP POLICY IF EXISTS "Clients view own requests" ON service_requests;
CREATE POLICY "Clients view own requests"
  ON service_requests FOR SELECT
  USING (auth.uid() = client_id);

NOTIFY pgrst, 'reload schema';
