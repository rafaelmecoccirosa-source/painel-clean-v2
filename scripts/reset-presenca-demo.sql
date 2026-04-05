-- Reset presença dos técnicos demo antes de apresentações
-- Rodar no Supabase SQL Editor

-- Online: Rafu, Carlos Souza, Pedro Santos, Roberto Lima
UPDATE profiles SET last_seen = NOW()
FROM auth.users u WHERE profiles.user_id = u.id
AND u.email IN (
  'rafu@porteiradoalto.com.br',
  'carlos.souza@demo.painelclean.com.br',
  'pedro.santos@demo.painelclean.com.br',
  'roberto.lima@demo.painelclean.com.br'
);

-- Offline: Lucas Martins, Diego Ferreira, Amanda Reis, Tio Luís
UPDATE profiles SET last_seen = NOW() - INTERVAL '2 hours'
FROM auth.users u WHERE profiles.user_id = u.id
AND u.email IN (
  'lucas.martins@demo.painelclean.com.br',
  'diego.ferreira@demo.painelclean.com.br',
  'amanda.reis@demo.painelclean.com.br',
  'luis@painelclean.com.br'
);
