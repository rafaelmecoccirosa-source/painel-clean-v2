# Painel Clean — Plataforma MVP

## O que é este projeto

Marketplace de limpeza de placas solares, modelo similar ao Uber/iFood.
Donos de usinas solares contratam técnicos qualificados para limpar e diagnosticar seus painéis.
Projeto paralelo à empresa **Painel Clean** (painelclean.com.br), que vende escovas profissionais para limpeza de placas solares.

---

## Stack técnica

- **Framework:** Next.js 14 (App Router)
- **Estilização:** Tailwind CSS
- **Backend/DB/Auth:** Supabase (PostgreSQL + Auth + Storage)
- **Pagamentos:** Asaas (PIX, cartão, boleto — melhor opção para Brasil)
- **Notificações:** WhatsApp via Z-API ou Twilio
- **Storage de fotos:** Supabase Storage
- **Deploy:** Vercel

---

## Identidade visual

Baseada no site oficial painelclean.com.br.

```css
--green-dark:   #1B3A2D;  /* cor principal — textos, headers, botões secundários */
--green-vibe:   #3DC45A;  /* verde vibrante — botões primários, destaques, logo */
--green-light:  #EBF3E8;  /* fundo de navbars, cards suaves, chips */
--green-pale:   #F4F8F2;  /* fundo geral da página */
--green-border: #C8DFC0;  /* bordas */
--muted:        #7A9A84;  /* textos secundários */
```

**Tipografia:**
- Títulos e labels: `Montserrat` (700–900)
- Corpo e inputs: `Open Sans` (400–600)

**Logo:** ícone verde vibrante com losangos + "Painel Clean" em verde escuro.
Subtítulo no header: "Limpeza de Placa Solar".

---

## Operação

- **Cidades piloto:** Jaraguá do Sul (SC), Pomerode (SC), Florianópolis (SC)
- **Fase 1 — MVP:** somente web responsivo (mobile-first)
- **Fase 2 — futuro:** app React Native

---

## Modelo de negócio

**Híbrido: comissão por serviço + assinatura do técnico**

| Receita | Descrição |
|---|---|
| Comissão 15% | Retida a cada serviço concluído |
| Assinatura técnico | Mensalidade para acesso à plataforma |
| Cross-sell | Técnicos compram escovas Painel Clean com desconto |
| Planos recorrentes | Cliente assina pacote trimestral/anual com desconto |

---

## Tabela de preços dos serviços

| Faixa | Módulos | Preço |
|---|---|---|
| Pequena | Até 10 módulos | R$ 180 |
| Média | 11 a 30 módulos | R$ 300 ← mais comum |
| Grande | 31 a 60 módulos | R$ 520 |
| Usina | 61+ módulos | Sob consulta |

**Tempo médio por serviço:** 2–3 horas
**Repasse ao técnico:** 85% do valor (ex: R$255 de R$300)
**Pagamento ao técnico:** PIX automático após conclusão e confirmação do pagamento

---

## Perfis de usuário

### 1. Cliente (dono das placas)
- Cadastra endereço e dados da instalação
- Solicita agendamento (cidade, quantidade de módulos, data, período)
- Acompanha status do serviço
- Recebe relatório fotográfico com diagnóstico
- Paga via PIX / cartão / boleto (somente após conclusão)
- Avalia o técnico (1–5 estrelas)
- Acessa histórico completo de serviços

### 2. Técnico (prestador de serviço)
**Requisitos para cadastro:**
- Experiência prévia como eletricista ou técnico em elétrica
- Conclusão do treinamento online obrigatório da Painel Clean
- Aprovação manual pelo admin

**Fluxo de trabalho:**
- Liga/desliga disponibilidade para receber chamados
- Recebe notificação de chamados na sua cidade
- Visualiza detalhes (endereço, distância, módulos, repasse)
- Aceita ou recusa o chamado
- Navega até o endereço
- Preenche relatório fotográfico (fotos antes + depois + diagnóstico)
- Confirma conclusão → recebe PIX automaticamente

### 3. Admin (equipe Painel Clean)
- Aprova ou recusa cadastros de técnicos
- Bloqueia aprovação se treinamento incompleto
- Monitora todos os serviços em tempo real
- Dashboard: receita, serviços por cidade, avaliações
- Gestão financeira e comissões
- Suporte a clientes e técnicos

---

## Fluxo principal do serviço

```
1. Cliente solicita → informa cidade, endereço, nº módulos, data, período
2. Sistema faz matching → notifica técnicos disponíveis na região
3. Técnico aceita → cliente é notificado via WhatsApp
4. Técnico executa → preenche relatório fotográfico (antes/depois + diagnóstico)
5. Técnico conclui → cliente recebe relatório e é cobrado
6. Pagamento confirmado → PIX automático para o técnico (85%)
7. Cliente avalia → feedback visível no perfil do técnico
```

---

## Funcionalidades do MVP (Fase 1)

- [x] Autenticação (email + Google) via Supabase Auth
- [x] Cadastro de cliente com endereço de instalação
- [x] Cadastro de técnico com validação de documentos e treinamento
- [x] Solicitação de serviço com agendamento
- [x] Sistema de matching técnico por cidade
- [x] Relatório fotográfico (upload via Supabase Storage)
- [x] Pagamento in-app via Asaas (PIX, cartão, boleto)
- [x] Repasse automático ao técnico via PIX
- [x] Sistema de avaliação (1–5 estrelas)
- [x] Histórico de serviços para cliente e técnico
- [x] Notificações via WhatsApp
- [x] Dashboard admin com métricas básicas
- [x] Aprovação manual de técnicos pelo admin

---

## Estrutura de pastas sugerida

```
/app
  /cliente
    /home
    /agendar
    /historico
    /relatorio/[id]
    /perfil
  /tecnico
    /home
    /chamados
    /em-andamento
    /relatorio/[id]
    /ganhos
    /perfil
  /admin
    /dashboard
    /servicos
    /tecnicos
    /financeiro
  /auth
    /login
    /cadastro

/components
  /ui          ← botões, badges, cards, inputs reutilizáveis
  /cliente
  /tecnico
  /admin
  /shared      ← header, bottom-nav, modais

/lib
  /supabase    ← cliente supabase, helpers
  /asaas       ← integração pagamentos
  /zapi        ← integração whatsapp

/types         ← typescript types do projeto
```

---

## Schema do banco (Supabase / PostgreSQL)

```sql
-- Usuários (extende auth.users do Supabase)
profiles (
  id uuid references auth.users,
  role: 'cliente' | 'tecnico' | 'admin',
  nome, telefone, cidade, created_at
)

-- Instalações do cliente
instalacoes (
  id, cliente_id, endereco, cidade, numero_modulos,
  created_at
)

-- Técnicos
tecnicos (
  id, profile_id, cidade, status_aprovacao: 'pendente' | 'aprovado' | 'recusado',
  treinamento_concluido bool, documento_url, avaliacao_media,
  created_at
)

-- Serviços
servicos (
  id, cliente_id, tecnico_id, instalacao_id,
  status: 'buscando' | 'aceito' | 'em_andamento' | 'concluido' | 'cancelado',
  data_agendada, periodo: 'manha' | 'tarde',
  valor_total, valor_tecnico, valor_plataforma,
  forma_pagamento: 'pix' | 'cartao' | 'boleto',
  pagamento_status: 'pendente' | 'pago',
  created_at, concluido_at
)

-- Relatórios fotográficos
relatorios (
  id, servico_id,
  fotos_antes: text[],  -- URLs Supabase Storage
  fotos_depois: text[],
  estado_modulos: 'bom' | 'regular' | 'ruim',
  modulos_danificados int,
  observacoes text,
  created_at
)

-- Avaliações
avaliacoes (
  id, servico_id, cliente_id, tecnico_id,
  nota int (1-5), comentario text, created_at
)
```

---

## Regras de negócio importantes

1. Técnico só aparece nos chamados da sua cidade cadastrada
2. Técnico só pode ser aprovado se `treinamento_concluido = true`
3. Pagamento só é processado após técnico marcar serviço como concluído
4. PIX para o técnico é enviado automaticamente após confirmação do pagamento
5. Relatório fotográfico é obrigatório para concluir o serviço
6. Avaliação só pode ser feita após serviço concluído e pago
7. Técnico pode recusar chamado sem penalidade no MVP

---

## Referência visual

O protótipo navegável completo (3 perfis, todos os fluxos) foi desenvolvido
em HTML/CSS puro e pode ser usado como referência fiel de UI/UX.

Componentes-chave a replicar:
- Header: fundo `green-light`, logo real, texto "Painel Clean / Limpeza de Placa Solar"
- Bottom nav: fundo `green-light`, ativo em `green-dark`
- Hero banner: fundo `green-dark`, destaque em `green-vibe`
- Cards: fundo branco, borda `green-border`, radius 14px
- Botão primário: `green-vibe`, texto branco, Montserrat 700
- Botão outline: borda `green-dark`, texto `green-dark`
- Badges: sistema de cores (green=concluído, warn=pendente, blue=agendado)
- Tabela de preços: linha highlight em `green-light` para faixa mais comum
- Repasse box: fundo `green-dark`, valor final em `green-vibe`

---

## Tabelas do Banco de Dados

> ⚠️ **Importante:** As migrations em `supabase/migrations/` **não são aplicadas automaticamente**.
> Você precisa executá-las manualmente no **Supabase SQL Editor** do seu projeto.
> Acesse: [https://app.supabase.com](https://app.supabase.com) → seu projeto → **SQL Editor**

### Como aplicar as migrations

1. Acesse o Supabase Dashboard do projeto
2. Vá em **SQL Editor → New query**
3. Cole o conteúdo do arquivo `supabase/migrations/20260330_service_requests.sql` e execute

### Tabela: `service_requests`

Esta é a tabela central do fluxo de agendamento. Arquivo completo em `supabase/migrations/20260330_service_requests.sql`.

```sql
CREATE TABLE IF NOT EXISTS service_requests (
  id               UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id        UUID          REFERENCES auth.users(id) NOT NULL,
  technician_id    UUID          REFERENCES auth.users(id),
  city             VARCHAR(100)  NOT NULL,
  address          TEXT          NOT NULL,
  module_count     INTEGER       NOT NULL,
  price_estimate   DECIMAL(10,2) NOT NULL,
  preferred_date   DATE          NOT NULL,
  preferred_time   VARCHAR(20)   NOT NULL,
  status           VARCHAR(30)   DEFAULT 'pending'
    CHECK (status IN ('pending','accepted','in_progress','completed','cancelled')),
  notes                TEXT,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW(),
  accepted_at          TIMESTAMPTZ,
  completed_at         TIMESTAMPTZ,
  cancelled_at         TIMESTAMPTZ,
  cancellation_reason  TEXT
);
```

**RLS habilitado.** Políticas:
- Cliente: SELECT/INSERT próprios, UPDATE apenas `pending → cancelled`
- Técnico: SELECT pendentes + os seus; UPDATE para aceitar e atualizar status
- Admin: acesso total via policy que verifica `profiles.role = 'admin'`

### Colunas de Pagamento: `service_requests` (migration `20260330_payment_columns.sql`)

Execute no Supabase SQL Editor para adicionar o fluxo de pagamento PIX manual:

```sql
ALTER TABLE service_requests
  ADD COLUMN IF NOT EXISTS payment_status VARCHAR(30)
    DEFAULT 'pending'
    CHECK (payment_status IN (
      'pending',                -- aguardando pagamento do cliente
      'awaiting_confirmation',  -- cliente informou que pagou, aguardando admin confirmar
      'confirmed',              -- admin confirmou, pagamento OK
      'released'                -- repasse ao técnico liberado
    ));

ALTER TABLE service_requests
  ADD COLUMN IF NOT EXISTS payment_method VARCHAR(20) DEFAULT 'pix';

ALTER TABLE service_requests
  ADD COLUMN IF NOT EXISTS payment_proof_url TEXT;

ALTER TABLE service_requests
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

ALTER TABLE service_requests
  ADD COLUMN IF NOT EXISTS released_at TIMESTAMPTZ;
```

**Fluxo de pagamento:**
1. Serviço concluído → `payment_status = 'pending'`
2. Cliente faz PIX e clica "Já paguei" → `payment_status = 'awaiting_confirmation'` + `paid_at`
3. Admin confirma no `/admin/pagamentos` → `payment_status = 'confirmed'`
4. Admin marca repasse como realizado → `payment_status = 'released'` + `released_at`

**Chave PIX placeholder:** `pix@painelclean.com.br` — alterar em `components/cliente/PaymentCard.tsx`

### Tabela: `messages` — Chat in-app (migration `20260330_messages.sql`)

```sql
CREATE TABLE IF NOT EXISTS messages (
  id                   UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  service_request_id   UUID          REFERENCES service_requests(id) ON DELETE CASCADE NOT NULL,
  sender_id            UUID          REFERENCES auth.users(id) NOT NULL,
  content              TEXT          NOT NULL,
  read                 BOOLEAN       DEFAULT false,
  created_at           TIMESTAMPTZ   DEFAULT NOW(),
  is_system            BOOLEAN       DEFAULT false
);
```

**RLS habilitado.** Políticas:
- Cliente e técnico do serviço: SELECT + INSERT (só o próprio sender_id) + UPDATE (marcar como lido)
- Admin: acesso total

**Fluxo:**
- Chat só aparece quando `status IN ('accepted', 'in_progress', 'completed')`
- Mensagens automáticas do sistema (`is_system = true`) são inseridas quando status muda
- Polling a cada 5 s para novas mensagens
- Números de telefone e e-mails são bloqueados no input (alerta exibido)
- Chave de acesso: `/cliente/servico/[id]` (cliente) e `/tecnico/chamados/[id]` (técnico)

### Comportamento com tabela inexistente

O app funciona **sem a tabela criada** — todas as páginas usam dados mockados como fallback.
Quando a tabela existir e tiver dados reais, os dashboards exibem dados do banco automaticamente.
O admin dashboard mostra um badge verde "✅ Dados reais" ou âmbar "📊 Dados demonstrativos".

---

## Usuário Admin de Teste

Para criar um admin de teste no Supabase, execute os passos abaixo:

### Via Supabase Dashboard (Authentication → Users)

1. Acesse o projeto no [Supabase Dashboard](https://app.supabase.com)
2. Vá em **Authentication → Users → Invite user**
3. Preencha:
   - Email: `admin@painelclean.com.br`
   - Senha: `PainelClean2025!`
4. Após o usuário ser criado, anote o `uuid` gerado

### Via SQL Editor (atualizar o role para admin)

```sql
-- Substitua <uuid-do-usuario> pelo ID gerado no passo 4
UPDATE public.profiles
SET role = 'admin'
WHERE user_id = '<uuid-do-usuario>';
```

### Via Script Supabase (seed completo)

```sql
-- Inserir direto com role admin (requer service_role key)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, role)
VALUES (
  gen_random_uuid(),
  'admin@painelclean.com.br',
  crypt('PainelClean2025!', gen_salt('bf')),
  now(),
  'authenticated'
);

-- Atualizar role na tabela profiles (o trigger já cria o registro)
UPDATE public.profiles
SET role = 'admin'
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'admin@painelclean.com.br'
);
```

### Criar novos admins

Para promover qualquer usuário existente a admin, execute no Supabase SQL Editor:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'email@dominio.com'
);
```

### Permissões RLS necessárias para o admin

Execute no SQL Editor para garantir que admins possam ler todos os dados:

```sql
-- Admin pode ler todos os profiles
CREATE POLICY "Admin can read all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = auth.uid() AND p.role = 'admin'
    )
  );

-- Admin pode ler todos os serviços
CREATE POLICY "Admin can read all servicos"
  ON servicos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = auth.uid() AND p.role = 'admin'
    )
  );
```
- Repasse box: fundo `green-dark`, valor final em `green-vibe`
