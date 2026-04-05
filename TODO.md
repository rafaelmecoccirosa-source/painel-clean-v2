# Painel Clean Plataforma — TODO & Histórico de Decisões

> Arquivo vivo. Atualizar a cada sessão.
> Formato: data + o que foi feito/decidido/pendente + por quê.

---

## PENDENTES (a fazer)

### Funcionais
- [ ] Google OAuth — integração completa com Supabase
- [ ] Fluxo completo end-to-end com dados reais: cliente cria → paga → técnico aceita → executa → relatório → admin libera → repasse
- [ ] Página de detalhe do chamado (`/tecnico/chamados/[id]`) — verificar se existe
- [ ] Agenda técnico (`/tecnico/agenda`) — 100% mock data (`MOCK_AGENDA_TECNICO`), integrar com DB real

### Visuais
- [ ] Calculadora: boxes de mesma altura (pode ter ficado pendente ainda)
- [ ] Trust badges desktop: verificar se "Preço transparente" ainda corta em alguma resolução

### Dados / Banco
- [ ] `last_seen` dos técnicos demo expira após 5min — rodar SQL de presença antes de demos/reuniões (ver SQL útil abaixo)
- [ ] Expandir de 3 cidades piloto para corredor completo quando pronto para fase 2

---

## EM ANDAMENTO

Nada em andamento — sessão 2026-04-05 concluída e mergeada na `main`.

---

## CONCLUÍDO — Sessão 2026-04-05

### Mapa Admin (`/admin/mapa`) — continuação + fixes gerais
- [x] Merge da branch `claude/update-visual-identity-7zvCM` na `main` — produção atualizada
- [x] Fix flash de login — `login/page.tsx` agora faz hard navigate para `/api/auth/redirect` (server-side role redirect, sem flash visual)
- [x] Fix 404 `/admin/mapa` — era o middleware redirecionando admin para `/cliente`, resolvido com role check nos layouts
- [x] Chamados disponíveis no topo do dashboard do técnico — busca dados reais de `service_requests`
- [x] Layout do mapa corrigido — `page-container` + `min-w-0` no flex, mapa respeita container do admin
- [x] Zoom inicial ajustado para mostrar corredor completo
- [x] Tabs reordenadas: Técnicos / Clientes / Serviços / Todos — default "Técnicos"
- [x] Filtro real no mapa ao trocar tab — LayerGroup limpo e recriado por tab
- [x] Tab Clientes — avatar, nome, cidade, total de placas, badge "X usinas", clique faz pan/zoom nos serviços do cliente
- [x] Dados seed inseridos no banco via SQL direto:
  - 8 técnicos com lat/lng espalhados nas 3 cidades piloto
  - 11 clientes demo com city preenchida
  - 6 service_requests com latitude/longitude reais
- [x] `scripts/seed-users-demo.sql` e `scripts/seed-location.sql` no repo para referência

### Decisões desta sessão
- **Join client_id → profiles:** PostgREST não atravessa `auth.users → profiles` via FK — join feito em JS no Server Component
- **Técnicos demo online/offline:** `last_seen` setado manualmente via SQL — expiram após 5min sem login real
- **Mock vs banco real:** decidido inserir dados demo diretamente no banco (não mock no código) — mais realista, testável, deletável via ROLLBACK no `seed-users-demo.sql`

### SQL útil — resetar presença dos técnicos demo
```sql
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
```

---

## CONCLUÍDO — Sessão 2026-04-04

### Mapa Admin (`/admin/mapa`)
- [x] Página `/admin/mapa` com mapa Leaflet mostrando técnicos e serviços de clientes
- [x] Pins 🟢 verde (técnico online < 5min) / 🔴 vermelho (offline) com popup de nome, cidade, último acesso
- [x] Pins 🔵 azul para serviços de clientes — posição real via `latitude`/`longitude` já salvo pelo `MapPickerLeaflet`
- [x] Múltiplos serviços no mesmo endereço agrupados em pin único com contador e histórico completo no popup
- [x] KPIs no topo: técnicos online / offline / total serviços / serviços ativos / técnicos sem CEP
- [x] Lista lateral com tabs Todos / Técnicos / Serviços
- [x] Item "Mapa" adicionado no nav do admin
- [x] `PresencePing` — client component invisível no layout do técnico, pinga `last_seen` a cada 4min
- [x] Campo CEP no perfil do técnico: preenche cidade automaticamente via ViaCEP, geocodifica via Nominatim, salva `lat`/`lng` no profile
- [x] Banner no dashboard do técnico quando `lat` é null: "Complete seu perfil → Adicionar CEP"
- [x] `lib/geocode.ts` — utilitário de geocodificação gratuito, sem API key

### Decisões desta sessão
- **Serviços:** já tinham `latitude`/`longitude` do `MapPickerLeaflet` — nenhuma migration nova para clientes
- **Técnicos:** geocodificação via CEP no perfil → `lat`/`lng` no `profiles` (novo)
- **Online/offline:** `last_seen` com threshold de 5min, ping a cada 4min
- **Leaflet:** importado só via `import('leaflet')` dentro de `useEffect` — nunca no topo, evita erro `window is not defined` no build Next.js

---

## CONCLUÍDO — Sessão 2026-04-03

### Infraestrutura / Auth
- [x] **Redirect por role quebrado** — causa: `redirect()` dentro de `try/catch` no layout. Fix: redirect fora do try/catch.
- [x] **Edge Runtime não lê profiles** — middleware roda no Edge Runtime (V8), queries ao Supabase falhavam silenciosamente. Fix: lógica de role movida para layouts (Node.js Server Components).
- [x] **Service Role Key** — adicionada `SUPABASE_SERVICE_ROLE_KEY` no Vercel para bypass de RLS em server components.
- [x] **RLS profiles com coluna errada** — policies usavam `p.id = auth.uid()` mas a tabela usa `user_id`. Corrigidas todas as policies.

### Banco de Dados
- [x] **Dados sujos deletados** — 2 service_requests `pending/released` sem técnico removidos.
- [x] **full_name corrigido via SQL** — Rafael M Rosa, Rafu, Admin Painel Clean atualizados.
- [x] **panel_count vs module_count** — INSERT salva em ambas, displays usam `module_count ?? panel_count ?? 0`.

### RLS
- [x] **Técnico não via chamados** — filtro `.eq("payment_status", "confirmed")` bloqueava registros. Fix: `.is("technician_id", null)`.
- [x] **Migration `20260403_fix_technician_rls.sql`** — técnico pode ver chamados sem técnico OU os seus próprios.
- [x] **Migration `20260403_profiles_rls.sql`** — policies corrigidas com `user_id`.

### Visual / Landing Page
- [x] Trust badges: sem separadores, `flex-wrap` como fallback.
- [x] Calculadora: tom trocado para possibilidade ("pode estar perdendo").
- [x] Seção diferenciais: "Seguro contra danos" substituiu "Pagamento seguro".
- [x] Seção técnico: percentual de repasse removido da landing.
- [x] CTA final: fundo claro `#EBF3E8` para separar visualmente do footer.

---

## HISTÓRICO DE DECISÕES

### Modelo financeiro
- **Comissão:** 25% plataforma / 75% técnico
- **Assinatura técnico:** removida para MVP (`SUBSCRIPTION_ENABLED = false`)
- **Desconto MVP cliente:** 15% (`MVP_PRICING_ACTIVE = true`)
- **Repasse mínimo:** R$200 garantido ao técnico
- **Preço mínimo:** R$300 por serviço

### Precificação
- Faixas regressivas (dados reais do cunhado, mercado SC):
  - Até 30 placas: R$27,50/placa
  - 31–50: R$20,00/placa
  - 51–100: R$14,00/placa
  - 101–200: R$9,50/placa
  - 200+: sob consulta
- Multiplicadores: tipo instalação (solo 1.0 / telhado 1.25 / difícil 1.5), sujeira pesada +20%, acesso difícil +20%, deslocamento R$2/km

### Comissão na landing vs dashboard
- Percentual (25%/75%) **não aparece** na landing — evitar objeção antes do cadastro
- Aparece só no dashboard do técnico após login

### Profiles — user_id vs id
- Tabela `profiles` tem `id` (UUID próprio) e `user_id` (FK para `auth.users`)
- **Sempre** usar `.eq('user_id', user.id)` — nunca `.eq('id', user.id)`
- Policies RLS também usam `user_id`

### Mapa — fonte das coordenadas
- **Clientes/serviços:** `latitude`/`longitude` em `service_requests`, salvo pelo `MapPickerLeaflet` no fluxo de criação
- **Técnicos:** CEP informado no perfil → geocodificado via ViaCEP + Nominatim → `lat`/`lng` em `profiles`
- Técnicos sem CEP aparecem na lista com badge cinza "Sem CEP", mas não travam o mapa

### Dados demo vs mock
- Dados demo inseridos diretamente no banco (não mock no código)
- Emails demo no formato `nome.sobrenome@demo.painelclean.com.br` — fácil identificar e deletar
- Para limpar: usar bloco ROLLBACK no `scripts/seed-users-demo.sql`

---

## PRÓXIMAS SESSÕES — O que discutir com o cunhado

- [ ] Validar preços das faixas com dados de clientes reais
- [ ] Definir processo de certificação dos técnicos (online? presencial? híbrido?)
- [ ] Política de cancelamento e reembolso
- [ ] SLA de aceitação: o que acontece se nenhum técnico aceitar após escalonamento máximo?
- [ ] Quando reativar assinatura mensal do técnico (pós-MVP)
- [ ] Estratégia de expansão Fase 2 (Blumenau, Gaspar, Brusque, Itajaí)
