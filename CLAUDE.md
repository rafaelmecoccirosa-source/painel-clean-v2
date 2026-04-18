markdown# CLAUDE.md — Painel Clean Plataforma v2

> Contexto completo do projeto para o Claude Code.
> Atualizado em: 2026-04-16
> Leia este arquivo inteiro antes de qualquer implementação.
> **Esta é a v2 — modelo assinatura (Netflix). A v1 está em github.com/rafaelmecoccirosa-source/painel-clean-plataforma**

---

## O que é o projeto

Plataforma de limpeza de placas solares no modelo **assinatura recorrente (Netflix)** com serviço avulso como opção secundária. Conecta **donos de painéis solares** com **técnicos certificados** em um corredor de 13 cidades entre Jaraguá do Sul e Florianópolis (SC). Operado pela Painel Clean (painelclean.com.br), empresa que vende escovas profissionais para limpeza de painéis.

**App v2:** painel-clean-v2.vercel.app
**Repo v2:** github.com/rafaelmecoccirosa-source/painel-clean-v2
**App v1 (referência):** painel-clean-plataforma.vercel.app
**Parceiro:** painelclean.com.br

---

## Stack

- **Frontend:** Next.js 14 App Router + Tailwind CSS
- **Backend/DB:** Supabase (auth + banco + RLS + Storage)
- **Deploy:** Vercel
- **Padrão de build:** 0 erros, 0 warnings relevantes antes de mergear

---

## Identidade visual

| Token | Valor | Classe Tailwind |
|-------|-------|-----------------|
| Dark green | `#1B3A2D` | `brand-dark` |
| Vibrant green | `#3DC45A` | `brand-green` |
| Light green | `#EBF3E8` | `brand-light` |
| Pale green | `#F4F8F2` | `brand-bg` |
| Border green | `#C8DFC0` | `brand-border` |
| Muted green | `#7A9A84` | `brand-muted` |
| Fonte título | Montserrat | — |
| Fonte corpo | Open Sans | — |

---

## Os 3 perfis

| Perfil | Route Group | Rota | O que faz |
|--------|-------------|------|-----------|
| `cliente` | `(cliente)` | `/cliente` | Assina plano, agenda limpezas, vê relatórios |
| `tecnico` | `(tecnico)` | `/tecnico` | Executa limpezas agendadas e avulsas |
| `admin` | `(admin)` | `/admin` | Intermedia, confirma, libera repasse, gerencia assinaturas |

---

## Modelo financeiro

### Planos de assinatura (mensalidade)

| Plano | Mensalidade | Módulos | Limpezas/ano |
|-------|-------------|---------|--------------|
| Básico | R$ 30/mês | até 15 | 2 |
| Padrão | R$ 50/mês | 16–30 | 2 |
| Plus | R$ 100/mês | 31–60 | 2 |
| Pro | sob consulta | 61–200 | customizado |
| Business | sob consulta | 200+ usinas | customizado |

### Entrada no plano
- 1ª limpeza com **50% do preço avulso equivalente**
- Ao pagar entrada → contrato mínimo **12 meses com carência**
- Cancelamento: paga saldo devedor do período restante
- Limpeza não realizada no período → cliente perde, sem reembolso

### Serviço avulso (secundário)
- Preço cheio — objetivo estratégico é fazer assinatura parecer óbvia
- Sem contrato, sem recorrência

### Limpeza extra para assinantes
- Gatilhada por alerta de queda de performance via API do inversor
- **40% mais barata** que o preço avulso equivalente

### Tabela de preços avulso (base para todos os cálculos)

| Faixa | Preço/placa |
|-------|-------------|
| Até 30 módulos | R$ 30,00 |
| 31–50 módulos | R$ 25,00 |
| 51–100 módulos | R$ 20,00 |
| 100+ módulos | sob consulta |

### Margens
- Custo técnico: R$ 10/placa
- Margem bruta avulso faixa básica: ~67%
- Margem assinatura: ~60% sobre mensalidade

### Argumento de venda — "se paga em 4 dias"
Premissas: módulo 550W, geração média SC 130 kWh/mês/kWp, tarifa R$ 0,85/kWh, perda por sujeira 30%

| Plano | Módulos | Prejuízo/mês por sujeira | Assinatura | Payback |
|-------|---------|--------------------------|------------|---------|
| Básico | 12 | ~R$ 218/mês | R$ 30/mês | ~4 dias |
| Padrão | 20 | ~R$ 365/mês | R$ 50/mês | ~4 dias |
| Plus | 40 | ~R$ 729/mês | R$ 100/mês | ~4 dias |

### Comparativo assinatura vs avulso (3 anos, 20 módulos)

| | Avulso 2x/ano | Assinatura Padrão |
|---|---|---|
| Ano 1 | R$ 1.200 | R$ 300 entrada + R$ 600 = R$ 900 |
| Ano 2 | R$ 1.200 | R$ 600 |
| Ano 3 | R$ 1.200 | R$ 600 |
| **Total** | **R$ 3.600** | **R$ 2.100** |
| **Economia** | — | **R$ 1.500 (42%)** |

---

## Flags de config (`lib/config.ts`)

```typescript
SUBSCRIPTION_ENABLED = true       // modelo assinatura ativo
AVULSO_ENABLED = true             // serviço avulso mantido como secundário
INVERTER_API_ENABLED = false      // integração API inversores — pós-MVP
FIRST_SERVICE_DISCOUNT = 0.50    // 50% desconto na 1ª limpeza
```

---

## Algoritmo de precificação (`lib/pricing.ts`)

```typescript
// 1. Faixas por placa (preço avulso base)
ate 30 placas  -> R$ 30,00/placa
31-50 placas   -> R$ 25,00/placa
51-100 placas  -> R$ 20,00/placa
100+ placas    -> sob consulta

// 2. Preco avulso base
preco_avulso = placas x valor_da_faixa

// 3. Entrada assinatura (1ª limpeza)
preco_entrada = preco_avulso x 0.50

// 4. Limpeza extra assinante
preco_extra = preco_avulso x 0.60  // 40% desconto

// 5. Multiplicadores
mult_tipo  = solo(x1.0) | telhado_padrao(x1.25) | telhado_dificil(x1.5)
mult_extra = 1.0 + (0.2 se sujeira pesada) + (0.2 se acesso dificil)
deslocamento = km x R$2
```

---

## Fluxo do cliente (assinatura)

Cliente cadastra → informa nº de módulos, cidade, modelo do inversor
Plataforma sugere o plano (Básico / Padrão / Plus)
Oferta: 1ª limpeza com 50% de desconto
Cliente paga entrada (1ª limpeza)
Técnico executa → relatório fotográfico + checkup
Plataforma oferece assinatura mensal pós-serviço
Cliente assina → contrato 12 meses mínimo
Plataforma agenda próximas limpezas automaticamente (2x/ano)
Relatório de performance chega todo mês (via API ou manual)
Alertas de queda de performance → oferta de limpeza extra com 40% desconto


## Fluxo avulso (secundário)

Cliente solicita limpeza avulsa
Plataforma calcula preço cheio
Cliente paga 100% via PIX antecipado
Cliente clica "Já paguei" -> payment_status = 'awaiting_confirmation'
Admin confirma -> payment_status = 'confirmed' (SLA: 15min)
Chamado aparece para técnicos elegíveis
Técnico aceita (se nenhum aceitar em 30min -> alerta admin, >1h -> escalonamento +10%)
Técnico executa e envia relatório fotográfico (antes/depois + checklist)
Admin revisa e aprova
Cliente avalia (1-5 estrelas)
Admin libera repasse via PIX para técnico


---

## Banco de dados — regras críticas

### Tabela `profiles`
- Tem DUAS colunas de ID: `id` (UUID próprio) e `user_id` (FK para `auth.users`)
- **SEMPRE** usar `.eq('user_id', user.id)` para buscar o profile do usuário logado
- **NUNCA** usar `.eq('id', user.id)` — vai retornar NULL
- O email fica em `auth.users`, não em `profiles`

### Colunas de `profiles`
id           -> UUID proprio
user_id      -> FK auth.users  <- SEMPRE usar este em queries e RLS
role         -> 'cliente' | 'tecnico' | 'admin'
full_name    -> nome completo
phone        -> telefone
city         -> cidade
avatar_url
cep          -> CEP do tecnico (varchar 9, ex: "89251-000")
lat          -> latitude geocodificada (double precision)
lng          -> longitude geocodificada (double precision)
last_seen    -> ultimo ping de presenca do tecnico (timestamptz)
created_at

### Tabela `subscriptions` (nova no v2)
id               -> UUID PK
client_id        -> FK auth.users
plan_type        -> 'basic' | 'standard' | 'plus' | 'pro' | 'business'
status           -> 'active' | 'cancelled' | 'paused'
price_monthly    -> valor mensal
modules_count    -> nr de módulos
started_at       -> início da assinatura
next_billing_at  -> próxima cobrança
next_service_at  -> próxima limpeza agendada
inverter_brand   -> marca do inversor
inverter_api_key -> chave API inversor (pós-MVP)
created_at

### Tabela `monthly_reports` (nova no v2)
id               -> UUID PK
subscription_id  -> FK subscriptions
client_id        -> FK auth.users
period_month     -> mês de referência
period_year      -> ano de referência
kwh_generated    -> kWh gerados no período
kwh_expected     -> kWh esperados para a região
efficiency_pct   -> % de eficiência
savings_estimated -> economia estimada na conta
alert_message    -> alerta se painel caiu de performance
report_pdf_url   -> URL do PDF gerado
sent_at          -> quando foi enviado ao cliente
created_at

### Tabela `service_requests` — campos adicionados no v2
origin           -> 'subscription' | 'avulso'
subscription_id  -> FK subscriptions (nullable)

### Tabela `service_requests` — regra das placas
- Coluna de placas: existe `panel_count` (schema original) E `module_count` (migrations)
- **SEMPRE** salvar em ambas: `{ panel_count: n, module_count: n }`
- **SEMPRE** ler com: `module_count ?? panel_count ?? 0`

### Join client_id -> profiles
- `service_requests.client_id` é FK para `auth.users`, não para `profiles`
- PostgREST **nao** atravessa `auth.users -> profiles` automaticamente
- Para buscar nome do cliente junto com o serviço: fazer join em JS no Server Component
```typescript
const clienteMap = new Map(clientes.map(c => [c.user_id, c]))
const servicosComCliente = servicos.map(s => ({
  ...s,
  client_name: clienteMap.get(s.client_id)?.full_name ?? null,
}))
```

---

## RLS (Row Level Security) — regras vigentes

### Tabela `profiles`
```sql
-- Usuario le/atualiza o proprio profile
USING (auth.uid() = user_id)

-- Admin le/atualiza todos (usar JWT para evitar recursão)
USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin')
```

### Tabela `service_requests`
```sql
-- Cliente ve os seus
USING (client_id = auth.uid())

-- Tecnico ve disponiveis (sem tecnico) OU os seus proprios
USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.user_id = auth.uid() AND p.role = 'tecnico')
  AND (technician_id IS NULL OR technician_id = auth.uid())
)

-- Admin ve tudo
USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin')
```

**CRÍTICO — RLS admin:** usar `auth.jwt() -> 'user_metadata' ->> 'role'` em vez de subquery em `profiles` para evitar recursão infinita (erro 42P17).

---

## Arquitetura de autenticação — regras críticas

### Supabase clients

| Contexto | Importar de | Key usada | RLS |
|---|---|---|---|
| Server Component / Layout | `@/lib/supabase/server` -> `createClient()` | anon | aplica |
| Client Component | `@/lib/supabase/client` -> `createClient()` | anon | aplica |
| Server Component (bypass RLS) | `@/lib/supabase/service` -> `createServiceClient()` | service_role | nao aplica |

**NUNCA** usar `createServiceClient()` em Client Components.

### Middleware (`middleware.ts`)
- **Faz APENAS:** verifica sessão ativa. Sem sessão -> redireciona para `/login`
- **NAO FAZ:** verificacao de role
- **Motivo:** middleware roda no Edge Runtime (V8), queries ao Supabase falham silenciosamente

### Login — redirect server-side (CRITICO)
```typescript
// login/page.tsx — CORRETO
window.location.href = '/api/auth/redirect'

// login/page.tsx — ERRADO (gera flash visual)
router.push('/cliente')
```

### Redirect por role — nos layouts
```typescript
// CRITICO: redirect() SEMPRE fora do try/catch
let userRole: string | null = null
try {
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role, full_name')
    .eq('user_id', user.id)
    .single()
  userRole = profile?.role ?? null
} catch {}

if (userRole === 'admin') redirect('/admin')
if (userRole === 'tecnico') redirect('/tecnico')
```

---

## Mapa de técnicos e serviços (`/admin/mapa`)

### Fonte das coordenadas
- **Servicos/clientes:** `latitude`/`longitude` em `service_requests`
- **Tecnicos:** CEP no perfil -> geocodificado via `lib/geocode.ts` (ViaCEP + Nominatim) -> `lat`/`lng` em `profiles`

### Presenca online/offline
- `last_seen` em `profiles` atualizado pelo `PresencePing` a cada 4min
- Online = `last_seen` nos ultimos 5 minutos

### Leaflet — regra critica
```typescript
// CORRETO — importar APENAS dentro de useEffect
useEffect(() => {
  import('leaflet').then(L => { ... })
}, [])

// ERRADO — quebra o build
import L from 'leaflet'
```

---

## Dados demo no banco

Emails demo no formato `nome.sobrenome@demo.painelclean.com.br` / senha `Demo@2026!`

Técnicos demo:
- `carlos.souza@demo.painelclean.com.br` — Jaraguá do Sul
- `lucas.martins@demo.painelclean.com.br` — Jaraguá do Sul
- `pedro.santos@demo.painelclean.com.br` — Pomerode
- `diego.ferreira@demo.painelclean.com.br` — Pomerode
- `roberto.lima@demo.painelclean.com.br` — Florianópolis
- `amanda.reis@demo.painelclean.com.br` — Florianópolis

Admin: `admin@painelclean.com.br` / `Demo@2026!`

---

## Padrão de dados mock

```typescript
// CORRETO
if (error?.code === 'PGRST116') return mockData  // tabela nao existe
if (!data || data.length === 0) return []          // vazio = estado vazio real

// ERRADO
if (error || !data || data.length === 0) return mockData
```

Sempre exibir badge "Dados demonstrativos" quando usando mock.

---

## Variáveis de ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

---

## Migrations aplicadas (ordem)

1. `20260330_service_requests.sql`
2. `20260330_payment_columns.sql`
3. `20260330_reviews.sql`
4. `20260330_messages.sql`
5. `20260330_service_reports.sql`
6. `20260331_contact_attempt_logs.sql`
7. `20260331_location_columns.sql`
8. `20260331_pricing_columns.sql`
9. `20260401_escalation_sla_columns.sql`
10. `20260401_fix_rls_policies.sql`
11. `20260403_profiles_rls.sql`
12. `20260403_fix_technician_rls.sql`
13. `20260403_report_columns.sql`
14. `20260404_technician_presence_location.sql`
15. `20260405_fix_profiles_update_rls.sql`
16. `20260416_subscriptions.sql` — tabela subscriptions (v2)
17. `20260416_monthly_reports.sql` — tabela monthly_reports (v2)
18. `20260416_service_requests_v2.sql` — origin + subscription_id (v2)

---

## Cidades — corredor Jaraguá -> Florianópolis

| Fase | Cidades |
|------|---------|
| Piloto (MVP ativo) | Jaraguá do Sul, Pomerode, Florianópolis |
| Fase 2 (mês 3–6) | Blumenau, Gaspar, Brusque, Itajaí |
| Fase 3 (ano 2) | Balneário Camboriú, Navegantes, Itapema, Tijucas, São José, Palhoça |

---

## Estrutura de arquivos chave
app/
(auth)/login, cadastro, completar-cadastro
api/auth/redirect/route.ts
(cliente)/layout.tsx
(cliente)/cliente/
page.tsx                    <- dashboard cliente — status plano + próxima limpeza
meu-plano/page.tsx          <- detalhes assinatura, histórico pagamentos (v2, pendente)
relatorios/page.tsx         <- relatórios mensais de performance (v2, pendente)
solicitar/page.tsx          <- limpeza avulsa (secundário)
historico/page.tsx
perfil/page.tsx
servico/[id]/page.tsx
(tecnico)/layout.tsx
(tecnico)/tecnico/
page.tsx
chamados/page.tsx           <- separado por origem: assinatura / avulso
chamados/[id]/page.tsx
agenda/page.tsx
ganhos/page.tsx
perfil/page.tsx
conclusao/[id]/page.tsx
(admin)/layout.tsx
(admin)/admin/
page.tsx
assinaturas/page.tsx        <- MRR, assinantes ativos, churn (v2, pendente)
relatorios/page.tsx         <- envios pendentes, status inversores (v2)
mapa/page.tsx
servicos/page.tsx, [id]/page.tsx
pagamentos/page.tsx
usuarios/page.tsx
page.tsx                      <- landing page pública
lib/
supabase/server.ts, client.ts, service.ts
types/index.ts
pricing.ts                    <- faixas v2: R$30/R$25/R$20/sob consulta
config.ts                     <- SUBSCRIPTION_ENABLED=true
mock-data.ts
availability.ts
geocode.ts

---

## Componentes notáveis

- **`MapPickerLeaflet`** — mapa com pin arrastável, salva lat/lng. `dynamic(..., { ssr: false })`
- **`PresencePing`** — atualiza last_seen a cada 4min
- **`ServiceProgressBar`** — barra de progresso 6 etapas
- **`PaymentCard`** — instrução PIX + botão "Já paguei"
- **`ChatBox`** — chat polling 5s, bloqueia telefone/email
- **`BannerParticles`** — partículas animadas para banners internos
- **`TecnicoParticles`** — partículas subindo para seção técnico na landing
- **`LoginBackground`** — fundo animado da tela de login
- **`AnimatedCounter`** — contador animado com IntersectionObserver para prova social
- **`FAQ`** (`components/home/FAQ.tsx`) — accordion client component com 6 perguntas e transição suave
- **`CalculadoraEconomia`** (`components/home/CalculadoraEconomia.tsx`) — calculadora interativa com slider e mini cards clicáveis
- **`HeroSection`** (`components/home/HeroSection.tsx`) — hero com Ken Burns, shimmer, fade sequencial e counter animado

---

## O que NAO mostrar na landing page

- Percentual de comissão da plataforma — só no dashboard do técnico após login

---

## Checklist antes de mergear

- [ ] `npm run build` com 0 erros
- [ ] Testado login com os 3 perfis (cliente, tecnico, admin)
- [ ] Redirect por role funcionando sem flash
- [ ] Dados reais aparecem quando existem no banco
- [ ] Mock só aparece quando banco vazio, com badge "Dados demonstrativos"
- [ ] Leaflet importado só dentro de useEffect
- [ ] RLS admin usando `auth.jwt()` — nunca subquery em profiles