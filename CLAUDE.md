# CLAUDE.md — Painel Clean Plataforma

> Contexto completo do projeto para o Claude Code.
> Atualizado em: 2026-04-04
> Leia este arquivo inteiro antes de qualquer implementação.

---

## O que é o projeto

Marketplace de limpeza de placas solares no modelo Uber/iFood. Conecta **donos de painéis solares** com **técnicos certificados** em um corredor de 13 cidades entre Jaraguá do Sul e Florianópolis (SC). Operado pela Painel Clean (painelclean.com.br), empresa que vende escovas profissionais para limpeza de painéis.

**App:** painel-clean-plataforma.vercel.app
**Repo:** github.com/rafaelmecoccirosa-source/painel-clean-plataforma
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
| `cliente` | `(cliente)` | `/cliente` | Solicita e paga o serviço |
| `tecnico` | `(tecnico)` | `/tecnico` | Executa a limpeza |
| `admin` | `(admin)` | `/admin` | Intermedia, confirma, libera repasse |

---

## Estrutura de arquivos chave

```
app/
  (auth)/login, cadastro, completar-cadastro
  (cliente)/layout.tsx
  (cliente)/cliente/
    page.tsx                    <- dashboard cliente (Client Component)
    solicitar/page.tsx          <- formulário + MapPickerLeaflet
    historico/page.tsx
    perfil/page.tsx             <- usa createServiceClient()
    servico/[id]/page.tsx
  (tecnico)/layout.tsx          <- inclui <PresencePing />
  (tecnico)/tecnico/
    page.tsx                    <- dashboard (usa createServiceClient())
    chamados/page.tsx
    chamados/[id]/page.tsx
    agenda/page.tsx             <- AVISO: 100% mock (MOCK_AGENDA_TECNICO), não integrado
    ganhos/page.tsx
    perfil/page.tsx             <- campo CEP com geocodificação
    conclusao/[id]/page.tsx
  (admin)/layout.tsx
  (admin)/admin/
    page.tsx
    mapa/page.tsx               <- mapa de técnicos + serviços
    mapa/AdminMapaView.tsx      <- Client Component com Leaflet
    servicos/page.tsx, [id]/page.tsx
    pagamentos/page.tsx
    usuarios/page.tsx
    relatorios/page.tsx
  page.tsx                      <- landing page pública

lib/
  supabase/
    server.ts     <- createClient() para Server Components (anon key, RLS aplica)
    client.ts     <- createClient() para Client Components (browser, anon key)
    service.ts    <- createServiceClient() para server-side bypass RLS
  types/index.ts
  pricing.ts      <- calcularPreco() com faixas regressivas e BOOST_MVP
  config.ts       <- SUBSCRIPTION_ENABLED=false, MVP_PRICING_ACTIVE=true
  mock-data.ts
  availability.ts <- getTecnicosDisponiveis()
  geocode.ts      <- geocodeCEP() via ViaCEP + Nominatim

components/
  PresencePing.tsx              <- pinga last_seen a cada 4min (no layout do técnico)
  layout/HeaderCliente, HeaderTecnico, HeaderAdmin, Logo
  shared/ServiceProgressBar, ChatBox, MapPickerLeaflet, MapViewLeaflet, ServiceReport
  cliente/PaymentCard, ServicoCard, TecnicosRegiao
  tecnico/DisponibilidadeToggle, GanhosChart
  admin/ServicosEscalationAlert, AdminDonut, AdminReceitaChart
  ui/Button, Badge, Toast
```

---

## Modelo financeiro

```
Comissão plataforma: 25%
Repasse técnico:     75%
Repasse mínimo:      R$ 200 (garantido)
Preço mínimo:        R$ 300 por serviço
Ticket médio SC:     R$ 618
```

**AVISO:** qualquer valor de 15% comissão / 85% repasse encontrado no código está DESATUALIZADO. Os valores corretos são 25% / 75%.

**Flags MVP (`lib/config.ts`):**
```typescript
SUBSCRIPTION_ENABLED = false  // assinatura técnico desativada no MVP
MVP_PRICING_ACTIVE = true     // desconto 15% pro cliente (plataforma absorve)
```

---

## Algoritmo de precificação (`lib/pricing.ts`)

```typescript
// 1. Faixas por placa (médias do mercado SC)
ate 30 placas  -> R$ 27,50/placa
31-50 placas   -> R$ 20,00/placa
51-100 placas  -> R$ 14,00/placa
101-200 placas -> R$ 9,50/placa
200+ placas    -> sob consulta

// 2. Preco base
preco_base = max(300, placas x valor_da_faixa)

// 3. Multiplicadores
mult_tipo  = solo(x1.0) | telhado_padrao(x1.25) | telhado_dificil(x1.5)
mult_extra = 1.0 + (0.2 se sujeira pesada) + (0.2 se acesso dificil)
deslocamento = km x R$2

// 4. Preco final
preco_estimado  = (preco_base x mult_tipo x mult_extra + deslocamento) x 1.15
preco_cliente   = preco_estimado x 0.85   // desconto MVP
repasse_tecnico = preco_estimado x 0.75   // 75% do interno
faixa_exibida   = [preco_cliente x 0.9, preco_cliente x 1.2]

// 5. Garantia de repasse minimo
if (repasse_tecnico < 200) ajustar preco_estimado para cima
```

---

## Fluxo do serviço

```
1.  Cliente preenche solicitacao (cidade, placas, tipo, sujeira, acesso, distancia)
2.  Plataforma calcula preco e verifica disponibilidade de tecnicos
3.  Cliente paga 100% via PIX antecipado
4.  Cliente clica "Ja paguei" -> payment_status = 'awaiting_confirmation'
5.  Admin confirma -> payment_status = 'confirmed' (SLA: 15min)
6.  Chamado aparece para tecnicos elegiveis
7.  Tecnico aceita (se nenhum aceitar em 30min -> alerta admin, >1h -> escalonamento +10%)
8.  Tecnico executa e envia relatorio fotografico (antes/depois + checklist)
9.  Admin revisa e aprova
10. Cliente avalia (1-5 estrelas)
11. Admin libera repasse via PIX para tecnico (75%)
```

---

## Banco de dados — regras críticas

### Tabela `profiles`
- Tem DUAS colunas de ID: `id` (UUID próprio) e `user_id` (FK para `auth.users`)
- **SEMPRE** usar `.eq('user_id', user.id)` para buscar o profile do usuário logado
- **NUNCA** usar `.eq('id', user.id)` — vai retornar NULL
- O email fica em `auth.users`, não em `profiles`

### Colunas de `profiles`
```
id           -> UUID proprio
user_id      -> FK auth.users  <- SEMPRE usar este em queries e RLS
role         -> 'cliente' | 'tecnico' | 'admin'
full_name    -> nome completo
phone        -> telefone
city         -> cidade (deve ser exatamente igual ao nome da cidade no sistema)
avatar_url
cep          -> CEP do tecnico (varchar 9, ex: "89251-000")
lat          -> latitude geocodificada (double precision)
lng          -> longitude geocodificada (double precision)
last_seen    -> ultimo ping de presenca do tecnico (timestamptz)
created_at
```

### Tabela `service_requests` — regra das placas
- Coluna de placas: existe `panel_count` (schema original) E `module_count` (migrations)
- **SEMPRE** salvar em ambas: `{ panel_count: n, module_count: n }`
- **SEMPRE** ler com: `module_count ?? panel_count ?? 0`

### Colunas importantes de `service_requests`
```
id                   -> UUID PK
client_id            -> UUID do cliente (FK auth.users)
technician_id        -> UUID do tecnico (FK auth.users), NULL quando disponivel
city                 -> cidade
address              -> endereco completo
module_count         -> nr de placas (novo)
panel_count          -> nr de placas (legado — manter por compatibilidade)
price_estimate       -> preco final cobrado do cliente
status               -> pending | accepted | in_progress | completed | cancelled
payment_status       -> pending | awaiting_confirmation | confirmed | released
payment_reported_at  -> quando cliente clicou "Ja paguei" (SLA)
latitude             -> coordenada do servico (salva pelo MapPickerLeaflet)
longitude            -> coordenada do servico (salva pelo MapPickerLeaflet)
tipo_instalacao      -> solo | telhado_padrao | telhado_dificil
nivel_sujeira        -> normal | pesada
nivel_acesso         -> normal | dificil
distancia_km         -> distancia em km
preco_min, preco_max -> faixa exibida ao tecnico
escalation_level     -> quantas vezes admin aumentou o preco
escalated_at         -> ultima escalacao manual
```

---

## RLS (Row Level Security) — regras vigentes

### Tabela `profiles`
```sql
-- Usuario le/atualiza o proprio profile
USING (auth.uid() = user_id)

-- Admin le/atualiza todos
USING (EXISTS (SELECT 1 FROM profiles p WHERE p.user_id = auth.uid() AND p.role = 'admin'))
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
USING (EXISTS (SELECT 1 FROM profiles p WHERE p.user_id = auth.uid() AND p.role = 'admin'))
```

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

### Redirect por role — nos layouts

```typescript
// CRITICO: redirect() lanca excecao NEXT_REDIRECT internamente
// Se estiver dentro de try/catch, o catch engole e o redirect nao acontece
// SEMPRE colocar redirect() FORA do try/catch

let userRole: string | null = null
try {
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role, full_name')
    .eq('user_id', user.id)   // <- SEMPRE user_id, nunca id
    .single()
  userRole = profile?.role ?? null
} catch {}

// Fora do try/catch:
if (userRole === 'admin') redirect('/admin')
if (userRole === 'tecnico') redirect('/tecnico')
```

---

## Mapa de técnicos e serviços (`/admin/mapa`)

### Fonte das coordenadas
- **Servicos/clientes:** `latitude`/`longitude` em `service_requests`, salvo pelo `MapPickerLeaflet` no fluxo de criacao — **ja existe, nao recriar**
- **Tecnicos:** CEP no perfil -> geocodificado via `lib/geocode.ts` (ViaCEP + Nominatim) -> `lat`/`lng` em `profiles`

### Presenca online/offline
- `last_seen` em `profiles` atualizado pelo `PresencePing` a cada 4min
- Online = `last_seen` nos ultimos 5 minutos
- `PresencePing` esta incluido no `app/(tecnico)/layout.tsx`

### Leaflet — regra critica
```typescript
// CORRETO — importar APENAS dentro de useEffect
useEffect(() => {
  import('leaflet').then(L => { ... })
}, [])

// ERRADO — quebra o build (window is not defined no SSR)
import L from 'leaflet'
```

---

## Padrão de dados mock

```typescript
// CORRETO
if (error?.code === 'PGRST116') return mockData  // tabela nao existe
if (!data || data.length === 0) return []          // vazio = estado vazio real, nao mock

// ERRADO — mistura erro com vazio
if (error || !data || data.length === 0) return mockData
```

Sempre exibir badge "Dados demonstrativos" quando usando mock.

---

## Variáveis de ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   <- necessaria para layouts e server components
```

Configurar no Vercel -> Settings -> Environment Variables -> All Environments.

---

## Migrations aplicadas (ordem)

1. `20260330_service_requests.sql`
2. `20260330_payment_columns.sql`
3. `20260331_location_columns.sql` — lat/lng em service_requests
4. `20260331_pricing_columns.sql` — tipo_instalacao, nivel_sujeira, nivel_acesso, distancia_km, preco_min, preco_max
5. `20260401_escalation_sla_columns.sql` — escalation_level, escalated_at, payment_reported_at
6. `20260401_fix_rls_policies.sql`
7. `20260403_profiles_rls.sql` — RLS com user_id
8. `20260403_fix_technician_rls.sql`
9. `20260404_technician_presence_location.sql` — last_seen, cep, lat, lng em profiles

---

## Cidades — corredor Jaraguá -> Florianópolis

| Fase | Cidades |
|------|---------|
| Piloto (MVP ativo) | Jaraguá do Sul, Pomerode, Florianópolis |
| Fase 2 (mês 3–6) | Blumenau, Gaspar, Brusque, Itajaí |
| Fase 3 (ano 2) | Balneário Camboriú, Navegantes, Itapema, Tijucas, São José, Palhoça |

---

## Componentes notáveis

- **`MapPickerLeaflet`** — mapa com pin arrastavel, salva lat/lng em service_requests. Importar com `dynamic(..., { ssr: false })`
- **`MapViewLeaflet`** — visualizacao estatica de localizacao
- **`PresencePing`** — client component invisivel, atualiza last_seen a cada 4min
- **`ServiceProgressBar`** — barra de progresso 6 etapas (props: status, paymentStatus, role)
- **`PaymentCard`** — instrucao PIX + botao "Ja paguei"
- **`ChatBox`** — chat polling 5s, bloqueia telefone/email no input
- **`ServicosEscalationAlert`** — alerta admin quando chamado sem tecnico >30min
- **`DisponibilidadeToggle`** — toggle online/offline do tecnico

---

## O que NAO mostrar na landing page

- Percentual de comissao (25%) ou repasse (75%) — so aparece no dashboard do tecnico apos login
- Motivo: evitar objecao antes do cadastro

---

## Checklist antes de mergear

- [ ] `npm run build` com 0 erros
- [ ] Testado login com os 3 perfis (cliente, tecnico, admin)
- [ ] Redirect por role funcionando sem flash
- [ ] Dados reais aparecem quando existem no banco
- [ ] Mock so aparece quando banco vazio, com badge "Dados demonstrativos"
- [ ] Leaflet importado so dentro de useEffect (nunca no topo do arquivo)
