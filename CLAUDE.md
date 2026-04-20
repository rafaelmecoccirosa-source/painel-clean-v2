# CLAUDE.md — Painel Clean Plataforma v2

> Contexto completo do projeto para o Claude Code.
> Atualizado em: 2026-04-20
> Leia este arquivo inteiro antes de qualquer implementação.
> **Esta é a v2 — modelo assinatura (Netflix). A v1 está em github.com/rafaelmecoccirosa-source/painel-clean-plataforma**

---

## O que é o projeto

Plataforma de limpeza de placas solares no modelo **assinatura recorrente (Netflix)** com serviço avulso como opção secundária. Conecta **donos de painéis solares** com **técnicos certificados** em um corredor de 13 cidades entre Jaraguá do Sul e Florianópolis (SC).

**App v2:** painel-clean-v2.vercel.app
**Repo v2:** github.com/rafaelmecoccirosa-source/painel-clean-v2
**App v1 (referência):** painel-clean-plataforma.vercel.app

---

## Stack

- **Frontend:** Next.js 14 App Router + Tailwind CSS
- **Backend/DB:** Supabase (auth + banco + RLS + Storage)
- **Deploy:** Vercel
- **Dev:** Claude Code terminal no WSL (Ubuntu 24) via VS Code
- **Padrão de build:** 0 erros antes de mergear

---

## Identidade visual

| Token | Valor |
|-------|-------|
| Dark green | `#1B3A2D` |
| Vibrant green | `#3DC45A` |
| Light green | `#EBF3E8` |
| Pale green | `#F4F8F2` |
| Border green | `#C8DFC0` |
| Muted green | `#7A9A84` |
| Fonte título | Montserrat 800/900 |
| Fonte corpo | Open Sans |

**Referência visual:** landing `/v2` é o padrão de design. Dashboards devem alinhar com ela.

---

## Os 3 perfis

| Perfil | Rota | O que faz |
|--------|------|-----------|
| `cliente` | `/cliente` | Assina plano, agenda limpezas, vê relatórios |
| `tecnico` | `/tecnico` | Executa limpezas agendadas e avulsas |
| `admin` | `/admin` | Intermedia, confirma, libera repasse, gerencia assinaturas |

---

## Modelo financeiro

### Planos de assinatura

| Plano | Mensalidade | Módulos | Limpezas/ano |
|-------|-------------|---------|--------------|
| Básico | R$ 30/mês | até 15 | 2 |
| Padrão | R$ 50/mês | 16–30 | 2 |
| Plus | R$ 100/mês | 31–60 | 2 |
| Pro | sob consulta | 61–200 | customizado |
| Business | sob consulta | 200+ | customizado |

### Entrada e contrato
- 1ª limpeza com **50% do preço avulso equivalente**
- Contrato mínimo **12 meses com carência**
- Cancelamento: paga saldo devedor do período restante

### Preços avulso (base para cálculos)

| Faixa | Preço/placa |
|-------|-------------|
| Até 30 módulos | R$ 30,00 |
| 31–50 módulos | R$ 25,00 |
| 51–100 módulos | R$ 20,00 |
| 100+ | sob consulta |

### Limpeza extra para assinantes
- **40% mais barata** que o preço avulso equivalente

### Argumento de venda — "se paga em 4 dias"

| Plano | Módulos ref. | Prejuízo/mês (sujeira) | Mensalidade | Payback |
|-------|-------------|------------------------|-------------|---------|
| Básico | 12 | ~R$ 218/mês | R$ 30/mês | ~4 dias |
| Padrão | 20 | ~R$ 365/mês | R$ 50/mês | ~4 dias |
| Plus | 40 | ~R$ 729/mês | R$ 100/mês | ~4 dias |

### Comparativo 3 anos (20 módulos, Padrão)

| | Avulso 2x/ano | Assinatura Padrão |
|---|---|---|
| Ano 1 | R$ 1.200 | R$ 300 entrada + R$ 600 = R$ 900 |
| Ano 2 | R$ 1.200 | R$ 600 |
| Ano 3 | R$ 1.200 | R$ 600 |
| **Total** | **R$ 3.600** | **R$ 2.100** |
| **Economia** | — | **R$ 1.500 (42%)** |

---

## Calculadora de perda (landing /v2)

```typescript
// Premissas CORRETAS (130 kWh/kWp/mês — não usar 1,35/dia)
W_PER_MODULE = 550
KWH_PER_KWP_MONTH = 130   // média SC — IMPORTANTE: não é 1,35 * 30
TARIFF = 0.92              // R$/kWh

// Loss% por toggle de última limpeza
LOSS_PCT = {
  'nunca':  0.30,  // padrão (mais impactante visualmente)
  '18m+':   0.25,
  '1ano':   0.20,
  '6meses': 0.15,
}

// Cálculo
kWp = modules * W_PER_MODULE / 1000
generationPerMonth = kWp * KWH_PER_KWP_MONTH
lossKwh = generationPerMonth * lossPct
lossBRL_month = lossKwh * TARIFF
lossBRL_year = lossBRL_month * 12

// Comparativo 3 anos
assinatura_3anos = plan_price * 36 - (plan_price * 0.5)
avulso_3anos = 180 * modulos  // R$180/módulo em 3 anos (base empírica)
economia = avulso_3anos - assinatura_3anos
```

---

## Flags de config (`lib/config.ts`)

```typescript
SUBSCRIPTION_ENABLED = true
AVULSO_ENABLED = true
INVERTER_API_ENABLED = false  // pós-MVP
FIRST_SERVICE_DISCOUNT = 0.50
```

---

## Banco de dados — regras críticas

### Tabela `profiles`
- **SEMPRE** usar `.eq('user_id', user.id)` — nunca `.eq('id', user.id)`
- Email fica em `auth.users`, não em `profiles`

### Tabela `service_requests` — regra das placas
- Só existe `module_count` — `panel_count` foi removido
- **SEMPRE** usar `module_count`

### Tabela `subscriptions` (v2)
```
id, client_id, plan_type ('basic'|'standard'|'plus'), status ('active'|'cancelled'|'paused'),
price_monthly, modules_count, started_at, next_billing_at, next_service_at,
inverter_brand, inverter_api_key, created_at
```

### Tabela `monthly_reports` (v2)
```
id, subscription_id, client_id, period_month, period_year,
kwh_generated, kwh_expected, efficiency_pct, savings_estimated,
alert_message, report_pdf_url, sent_at, created_at
```

### Tabela `service_requests` — campos v2
```
origin: 'subscription' | 'avulso'
subscription_id: FK subscriptions (nullable)
```

### RLS crítico
- Admin: usar `auth.jwt() -> 'user_metadata' ->> 'role'` — nunca subquery em profiles (erro 42P17)

---

## Autenticação — regras críticas

### Supabase clients

| Contexto | Função | RLS |
|---|---|---|
| Server Component | `createClient()` de `@/lib/supabase/server` | aplica |
| Client Component | `createClient()` de `@/lib/supabase/client` | aplica |
| Admin (bypass RLS) | `createServiceClient()` de `@/lib/supabase/service` | não aplica |

### Middleware
- Verifica sessão ativa — sem sessão → redireciona para `/login`
- **Rotas públicas:** `/`, `/v2`, `/v2/*`, `/login`, `/cadastro`, `/completar-cadastro`
- **Não faz** verificação de role (Edge Runtime — falha silenciosamente)

### Redirect pós-login
```typescript
// CORRETO
window.location.href = '/api/auth/redirect'
// ERRADO (flash visual)
router.push('/cliente')
```

### redirect() — CRÍTICO
```typescript
// SEMPRE fora do try/catch
redirect('/admin')  // lança NEXT_REDIRECT internamente
```

---

## Landing page — estratégia de rotas

- `app/page.tsx` — landing atual em `/` — **NÃO ALTERAR**
- `app/v2/page.tsx` — nova landing em `/v2` — referência visual
- `components/landing-v2/` — componentes da nova landing
- **`'use client'` obrigatório** em todo componente com hooks ou event handlers
- Após aprovação: `/v2` → `/`, atual → `/v1`

---

## Particulas — padrão correto

```css
/* Ascending dots — estilo correto */
@keyframes pc-rise {
  0%   { transform: translateY(0);      opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateY(-120vh); opacity: 0; }
}
```

```typescript
// Características
const size = 3 + Math.random() * 5;  // 3-8px (pequenos!)
const duration = 6 + Math.random() * 6;  // 6-12s
const opacity = 0.2 + Math.random() * 0.2;  // sutil
const color = 'rgba(61,196,90,0.35)';  // verde vibrante sutil
// position: absolute, bottom: -10px, left: random %
```

---

## Dashboard cliente — estados do hero

O hero do dashboard cliente muda conforme o estado da usina:

1. **Tudo tranquilo** — "Sua usina está saudável e a X dias da próxima limpeza" + gauge verde 94%
2. **Relatório chegou** — "Seu relatório de [mês] chegou" + kWh gerados em destaque
3. **Queda detectada** — "Detectamos queda de X% na geração" + hero âmbar de alerta
4. **Limpeza em 3 dias** — "Sua limpeza é em 3 dias — [data]" + card do técnico
5. **Pós-limpeza** — "Sua geração subiu X% após a limpeza" + gauge verde 97%

---

## Mapa de técnicos (`/admin/mapa`)

- `last_seen` em `profiles` atualizado pelo `PresencePing` a cada 4min
- Online = `last_seen` nos últimos 5 minutos
- Leaflet: importar **apenas dentro de useEffect** — nunca no topo do arquivo

---

## Dados demo

Senha padrão: `Demo@2026!`

**Técnicos:** carlos.souza, lucas.martins, pedro.santos, diego.ferreira, roberto.lima, amanda.reis — todos `@demo.painelclean.com.br`

**Clientes com assinatura:** fernanda.alves (Padrão), ana.silva (Básico), ricardo.mendes (Plus), maria.oliveira (Padrão) — todos `@demo.painelclean.com.br`

**Admin:** `admin@painelclean.com.br`

---

## O que NÃO mostrar na landing

- % de comissão — só no dashboard do técnico pós-login
- "Sem fidelidade" — existe contrato de 12 meses
- Hierarquia de planos por popularidade — critério é tamanho da usina (módulos)

---

## Checklist antes de mergear

- [ ] `npm run build` com 0 erros
- [ ] Testado login com os 3 perfis
- [ ] Redirect por role sem flash
- [ ] Dados reais quando banco tem dados, mock com badge quando vazio
- [ ] Leaflet importado só dentro de useEffect
- [ ] RLS admin usando `auth.jwt()` — nunca subquery em profiles
- [ ] `'use client'` nos componentes de landing-v2 que usam hooks
- [ ] Rotas públicas (`/`, `/v2`) não bloqueadas pelo middleware
- [ ] Commits cirúrgicos sem CRLF churn
