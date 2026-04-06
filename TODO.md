# Painel Clean Plataforma — TODO & Histórico de Decisões

> Arquivo vivo. Atualizar a cada sessão.
> Formato: data + o que foi feito/decidido/pendente + por quê.

---

## PENDENTES (a fazer)

### Funcionais
- [ ] Fluxo completo end-to-end com dados reais: cliente cria → paga → técnico aceita → executa → relatório → admin libera → repasse
- [ ] Agenda técnico (`/tecnico/agenda`) — 100% mock, integrar com DB real

### Dados / Banco
- [ ] `last_seen` dos técnicos demo expira após 5min — rodar `scripts/reset-presenca-demo.sql` antes de demos
- [ ] Expandir para corredor completo de 13 cidades na fase 2

### Próximas sessões
- [ ] Discutir com o cunhado: certificação dos técnicos, política de cancelamento, SLA sem técnico, reativar assinatura pós-MVP

---

## EM ANDAMENTO

Nada em andamento — sessão 2026-04-05 concluída e mergeada na `main`.

---

## CONCLUÍDO — Sessão 2026-04-05

### Google OAuth
- [x] Redirect URI corrigida no Google Cloud Console (`/auth/v1/callback`)
- [x] Site URL e Redirect URLs atualizados no Supabase para domínio Vercel
- [x] Fluxo de completar cadastro após OAuth — redireciona para `/completar-cadastro` quando `role` é null
- [x] `full_name` digitado pelo usuário no step 2, nunca pego do metadata do Google
- [x] `/cliente/perfil` convertido para Client Component editável com botão Editar/Salvar/Cancelar
- [x] Toast auto-dismiss em 3.5s no perfil do técnico e cliente

### RLS e Banco
- [x] Migration `20260405_fix_profiles_update_rls.sql` — policies UPDATE criadas corretamente
- [x] Recursão infinita (erro 42P17) corrigida — todas as policies admin agora usam `auth.jwt() -> 'user_metadata' ->> 'role'` em vez de subquery em `profiles`
- [x] Migration `20260404_technician_presence_location.sql` aplicada — colunas `last_seen`, `cep`, `lat`, `lng` criadas em `profiles`
- [x] `NOTIFY pgrst, 'reload schema'` executado após migrations

### Chamados do técnico
- [x] Link `→` na lista de chamados agora usa UUID real (`service_requests.id`)
- [x] `/tecnico/chamados/[id]` — botão "Aceitar chamado" para chamados `pending` sem técnico
- [x] `/tecnico/chamados/[id]` — seção de relatório visível para chamados `completed`
- [x] Agenda: badge "Dados demonstrativos" + "Ver detalhes" redireciona para `/tecnico/chamados`

### Mapa admin
- [x] Pins de serviço clicáveis — link "Ver →" no popup aponta para `/admin/servicos/[id]`
- [x] `scripts/reset-presenca-demo.sql` criado — 4 online / 4 offline

### Decisões desta sessão
- **RLS admin sem recursão:** usar `auth.jwt() -> 'user_metadata' ->> 'role'` — nunca subquery em `profiles`
- **Colunas de presença/localização:** migration aplicada manualmente no Supabase SQL Editor
- **Agenda:** permanece mock por enquanto, integração com banco fica para próxima sessão

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
