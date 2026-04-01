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

## Tabela de preços dos serviços (faixas regressivas por escala)

> ⚠️ **Valores atualizados** — economia de escala: quanto mais placas, menor o valor unitário.
> Preços representam a média do mercado SC (2025). Valor mínimo por serviço: **R$ 300**.

| Faixa | Placas | Valor por placa | Exemplo (solo, sujeira normal) |
|---|---|---|---|
| Residencial pequeno | Até 30 | R$ 20 a R$ 35/placa (média R$ 27,50) | 20 placas ≈ R$ 550 |
| Residencial médio | 31–50 | R$ 15 a R$ 25/placa (média R$ 20,00) | 40 placas ≈ R$ 800 |
| Comercial | 51–100 | R$ 10 a R$ 18/placa (média R$ 14,00) | 80 placas ≈ R$ 1.120 |
| Industrial pequeno | 101–200 | R$ 7 a R$ 12/placa (média R$ 9,50) | 150 placas ≈ R$ 1.425 |
| Usina | 200+ | Sob consulta | — |

**Multiplicadores aplicados no algoritmo:**
- Tipo de instalação: Solo ×1.0 / Telhado padrão ×1.25 / Telhado difícil ×1.5
- Sujeira pesada: +20%
- Acesso difícil: +20%
- Deslocamento: R$ 2/km
- Boost MVP: ×1.15

**Repasse ao técnico:** 85% do valor final
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

> ⚠️ **Fluxo atualizado: Pagamento ANTECIPADO** — o técnico só vê o chamado após o pagamento ser confirmado pelo admin.

```
1. Cliente solicita → informa cidade, endereço, nº módulos, data, período
2. Sistema cria serviço com status = 'pending' + payment_status = 'pending'
3. Cliente paga via PIX → payment_status = 'awaiting_confirmation'
4. Admin confirma pagamento → payment_status = 'confirmed'
   └─ AGORA o chamado aparece na lista de disponíveis para os técnicos
5. Técnico aceita → status = 'accepted', cliente é notificado via WhatsApp
6. Técnico inicia → status = 'in_progress'
7. Técnico executa → preenche relatório fotográfico (antes/depois + diagnóstico)
8. Técnico conclui → status = 'completed'
9. Admin libera repasse → payment_status = 'released', PIX para o técnico (85%)
10. Cliente avalia → feedback visível no perfil do técnico
```

**Regra crítica:** O técnico NUNCA vê chamados com `payment_status != 'confirmed'`.
Isso elimina o risco de calote — o técnico nunca sai de casa sem pagamento confirmado.

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

---

## Barra de Progresso (ServiceProgressBar)

Nova ordem dos passos (fluxo pós pagamento antecipado):
```
Solicitado → Pago → Aceito → Em andamento → Concluído → Repasse
```

Mapeamento de estados:
- `pending + payment_status=pending`               → passo 1 (Solicitado) atual
- `pending + payment_status=awaiting_confirmation` → passo 1 done, passo 2 (Pago) atual
- `pending + payment_status=confirmed`             → passo 2 done, passo 3 (Aceito) atual
- `accepted`                                       → passo 3 done, passo 4 (Em andamento) atual
- `in_progress`                                    → passo 4 done, passo 5 (Concluído) atual
- `completed`                                      → passo 5 done, passo 6 (Repasse) atual
- `payment_status=released`                        → todos os passos concluídos

---

## Localização com Pin no Mapa

### Migration SQL (executar manualmente no Supabase SQL Editor)

Arquivo: `supabase/migrations/20260331_location_columns.sql`

```sql
ALTER TABLE service_requests
  ADD COLUMN IF NOT EXISTS latitude          DECIMAL(10,8),
  ADD COLUMN IF NOT EXISTS longitude         DECIMAL(11,8),
  ADD COLUMN IF NOT EXISTS location_description TEXT;
```

### Como funciona

- **Tela de solicitação** (`/cliente/solicitar`): o cliente escolhe entre "Digitar endereço" (texto) ou "Marcar no mapa" (Leaflet interativo). No modo mapa, clica para posicionar um pin arrastável. Botão "Usar minha localização atual" usa `navigator.geolocation`.
- **Mapa usa Leaflet + OpenStreetMap** (100% gratuito, sem API key). `react-leaflet@4` (compatível com React 18).
- **Componentes**:
  - `components/shared/MapPickerLeaflet.tsx` — mapa interativo com pin arrastável (solicitar)
  - `components/shared/MapViewLeaflet.tsx` — mapa read-only (ver localização)
  - Ambos importados via `dynamic(() => import(...), { ssr: false })` para evitar erro de SSR do Leaflet.
- **Validação**: precisa ter endereço textual OU pin no mapa (pelo menos um).
- **Tela do técnico** (`/tecnico/chamados/[id]`): se o serviço tem lat/lng, mostra mapa com pin + botões "Google Maps" (rota) e "Waze". Se só endereço textual, botão Google Maps por busca.
- **Lista de chamados** (`/tecnico/chamados`): badge "📍 Localização no mapa" nos cards que têm coordenadas.
- **Admin servicos**: coluna 📍 com link Google Maps por cidade.

### Centros das cidades piloto

| Cidade | Latitude | Longitude |
|--------|----------|-----------|
| Jaraguá do Sul | -26.4854 | -49.0713 |
| Pomerode | -26.7407 | -49.1764 |
| Florianópolis | -27.5954 | -48.5480 |

---

## Algoritmo de Precificação Dinâmica

Arquivo: `lib/pricing.ts`

### Constantes

```typescript
PRECO_MINIMO = 300   // mínimo absoluto por visita (atualizado para mercado SC)
CUSTO_KM     = 2     // R$/km de deslocamento
BOOST_MVP    = 1.15  // ajuste de mercado (+15%) no MVP
```

### Faixas de preço por placa (função getValorPorPlaca)

| Placas | Valor médio/placa | Faixa de mercado |
|--------|-------------------|-----------------|
| ≤ 30   | R$ 27,50          | R$ 20–35        |
| 31–50  | R$ 20,00          | R$ 15–25        |
| 51–100 | R$ 14,00          | R$ 10–18        |
| 101–200| R$ 9,50           | R$ 7–12         |
| 200+   | Sob consulta      | —               |

### Multiplicadores

| Parâmetro | Valor | Multiplicador |
|-----------|-------|---------------|
| `solo` | Instalação no solo | 1.0 |
| `telhado_padrao` | Telhado acessível | 1.25 |
| `telhado_dificil` | Telhado difícil/2 andares | 1.5 |
| `normal` (sujeira) | Sujeira leve | 1.0 |
| `pesada` (sujeira) | Sujeira pesada | 1.20 |
| `normal` (acesso) | Acesso fácil | 1.0 |
| `dificil` (acesso) | Acesso difícil | 1.20 |

### Faixa de preço exibida

O `calcularPreco()` retorna `precoMin` (−10%) e `precoMax` (+20%) do estimado.
Se `placas > 200`, retorna `sobConsulta: true` com todos os valores zerados.

### Colunas na tabela `service_requests` (migration `20260331_pricing_columns.sql`)

```sql
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
```

### Nomenclatura UI

A palavra "módulos" foi renomeada para **"placas"** em toda a interface do usuário
(dashboards, cards, tabelas, formulários). Colunas do banco de dados permanecem como
`module_count` para compatibilidade.

### Fluxo no cliente (`/cliente/solicitar`)

1. Cliente seleciona: tipo de instalação (3 opções), nível de sujeira (2 opções), nível de acesso (2 opções), distância estimada
2. Preview em tempo real mostra faixa de preço (preco_min a preco_max)
3. Submit salva: `tipo_instalacao`, `nivel_sujeira`, `nivel_acesso`, `distancia_km`, `preco_min`, `preco_max`

### Fluxo no técnico (`/tecnico/chamados/[id]`)

- Técnico vê a faixa aprovada pelo cliente
- Pode ajustar o preço final dentro da faixa
- Se fora da faixa: deve preencher justificativa obrigatória
- Preço final salvo ao aceitar o chamado

---

## Feature Flags MVP (`lib/config.ts`)

Todas as flags ficam em `lib/config.ts`. Mudar de `false` → `true` para ativar.

| Flag | Valor | Descrição |
|---|---|---|
| `SUBSCRIPTION_ENABLED` | `false` | Assinatura mensal de técnicos desabilitada no MVP. Cadastro gratuito. |
| `MVP_PRICING_ACTIVE` | `true` | Preço exibido ao cliente = precoEstimado × 0.85 (15% desconto de lançamento). |

---

## Pricing MVP — Desconto para Cliente + Boost para Técnico

Arquivo: `lib/pricing.ts`

```typescript
REPASSE_MINIMO_TECNICO = 200   // técnico nunca recebe menos de R$ 200
DESCONTO_MVP_CLIENTE   = 0.85  // cliente paga 15% a menos (MVP_PRICING_ACTIVE=true)
BOOST_MVP_TECNICO      = 1.15  // mesmo que BOOST_MVP — documentado para clareza
```

**Fluxo de cálculo quando `MVP_PRICING_ACTIVE = true`:**
1. `precoEstimado` = preço interno cheio (com BOOST_MVP já aplicado)
2. `precoCliente` = `precoEstimado × 0.85` → armazenado em `price_estimate` no banco
3. `repasseTecnico` = `precoEstimado × 0.85` → 85% do preço INTERNO (não do desconto)
4. Plataforma absorve diferença como investimento em liquidez no MVP
5. `precoMin` / `precoMax` são baseados em `precoCliente` (faixa para o técnico)

**Badge "🏷️ Preço especial de lançamento"** aparece na tela de solicitação quando `MVP_PRICING_ACTIVE = true`.

**Garantia de repasse mínimo:**
- Se `repasseTecnico < REPASSE_MINIMO_TECNICO (R$ 200)`, o algoritmo ajusta `precoEstimado` para cima.

---

## Pré-disponibilidade (`lib/availability.ts`)

Antes do cliente enviar a solicitação, o sistema verifica se há técnicos disponíveis na cidade.

```typescript
getTecnicosDisponiveis(cidade, supabase): Promise<DisponibilidadeResult>
// Busca profiles com role='tecnico' e city=cidade
// Retorna: { quantidade, disponivel, mensagem }
```

**Comportamento na tela `/cliente/solicitar`:**
- Ao selecionar cidade → busca disponibilidade automaticamente
- `disponivel = true` → badge verde: "✅ X técnicos disponíveis na sua região"
- `disponivel = false` → alerta vermelho + campo para contato + botão submit desabilitado

**Fallback:** se a tabela `profiles` não existir, retorna `disponivel = true` para não bloquear o fluxo.

---

## Escalonamento Manual pelo Admin (`components/admin/ServicosEscalationAlert.tsx`)

Aparece no dashboard do admin quando há serviços com:
- `payment_status = 'confirmed'` + `technician_id IS NULL` + `created_at > 30min`

**Urgência:**
- > 30min: ⚠️ Aguardando aceite
- > 1h: 🔴 Urgente — considere aumentar preço
- > 2h: 💣 Crítico — baixa liquidez

**Ações manuais do admin:**
- **Aumentar preço +10%:** UPDATE `price_estimate` × 1.1 + `preco_min` + `preco_max` + `escalation_level++`
- **Marcar baixa liquidez:** seta flag em `notes`, alerta para recrutar técnicos

**As ações são 100% manuais** — o admin decide quando e como agir.

---

## SLA de Confirmação PIX (`payment_reported_at`)

- Quando cliente clica "Já paguei" → salva `payment_reported_at = NOW()`
- Na tela de pagamentos do admin (`/admin/pagamentos`):
  - Mostra timer desde que o cliente reportou
  - Se > 15 minutos: destaque vermelho "🚨 SLA estourado"
  - Ordenação: mais antigos primeiro (`payment_reported_at ASC`)
- SLA definido em `SLA_MINUTOS = 15` (constante na página de pagamentos)

---

## Colunas Novas: `service_requests` (migration `20260401_escalation_sla_columns.sql`)

Execute no Supabase SQL Editor:

```sql
ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS escalation_level INT DEFAULT 0;
ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS escalated_at TIMESTAMPTZ;
ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS payment_reported_at TIMESTAMPTZ;
NOTIFY pgrst, 'reload schema';
```

| Coluna | Tipo | Uso |
|---|---|---|
| `escalation_level` | INT | Quantas vezes o admin aumentou o preço |
| `escalated_at` | TIMESTAMPTZ | Última escalação manual |
| `payment_reported_at` | TIMESTAMPTZ | Quando o cliente clicou "Já paguei" (SLA) |

---

## Sem Assinatura para Técnicos (MVP)

- `SUBSCRIPTION_ENABLED = false` em `lib/config.ts`
- Dashboard do técnico mostra banner: "✅ Sem mensalidade — apenas 15% de comissão por serviço"
- Termos de uso: "Cadastro gratuito para técnicos — sem mensalidade"
- Ao ativar (`true`): re-habilitar card de assinatura no dashboard do técnico

---

## Google OAuth (Login e Cadastro)

### Ativação no Supabase

1. Acesse o Supabase Dashboard → **Authentication → Providers → Google**
2. Ative o provider e configure:
   - **Client ID**: obtido no Google Cloud Console (APIs & Services → Credentials)
   - **Client Secret**: obtido no Google Cloud Console
3. No Google Cloud Console, adicione a URL de callback autorizada:
   - `https://<seu-projeto>.supabase.co/auth/v1/callback`

### Fluxo

- **Login/Cadastro**: botão "Continuar com Google" chama `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: '/auth/callback' } })`
- **`/auth/callback`** (route handler): troca o `code` por sessão, verifica se o usuário tem perfil na tabela `profiles`
  - Se tem perfil → redireciona para `/cliente`, `/tecnico` ou `/admin`
  - Se não tem perfil (novo usuário Google) → redireciona para `/completar-cadastro`
- **`/completar-cadastro`**: usuário seleciona papel (cliente/técnico) + informa cidade e telefone → faz upsert na tabela `profiles`

### Rotas públicas (middleware.ts)

As seguintes rotas são públicas (sem autenticação):
- `/`, `/login`, `/cadastro`, `/completar-cadastro`, `/termos`
- `/auth/*` (callback do OAuth)

### Cadastro em 2 etapas (`/cadastro`)

- **Etapa 1**: dois cards clicáveis — "🏠 Sou cliente" / "🔧 Sou técnico" + botão Google OAuth
- **Etapa 2**: formulário com nome, email, senha, cidade, telefone
  - Técnico: campo extra de experiência + badge "Sem mensalidade"
  - Botão Google OAuth também disponível na etapa 2
