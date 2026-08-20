# Runbook Supabase — pausa, restauração e reconstrução

> Criado em resposta ao aviso de *"project will be permanently frozen in 5 days"*
> recebido do Supabase (projeto `painel-clean`, ID `muewtsnjigszaxcsqrdl`).
> Guarde este arquivo: ele também serve para qualquer incidente futuro de banco.

---

## 1. Diagnóstico — qual projeto foi pausado?

| Projeto | Reference ID | Onde aparece |
|---|---|---|
| Do comunicado (pausado há 85 dias) | `muewtsnjigszaxcsqrdl` | e-mail do Supabase |
| **Usado pelo app MRR em produção** | `qprnhafgebfjnkadopge` | `README.md:95`, `MOBILE_BRIEFING.md:22`, `DESIGN_TOKENS.md:166` |

**Os IDs são diferentes.** Toda a documentação deste repo aponta para
`qprnhafgebfjnkadopge`, então o projeto do comunicado é, com alta probabilidade,
o banco da **v1 (`painel-clean-plataforma`)** ou um projeto antigo/de teste —
não o banco do MRR. Reforça essa leitura o fato de estar pausado há 85 dias: o
MRR tem cron diário na Vercel batendo no banco, o que impediria a pausa.

### Confirme em 30 segundos (não pule este passo)

1. **Vercel** → projeto `painel-clean-mrr` → Settings → Environment Variables →
   valor de `NEXT_PUBLIC_SUPABASE_URL`.
2. **Supabase** → dashboard → o projeto pausado → Project Settings → General →
   *Reference ID*.

- IDs **diferentes** → o app em produção está intacto; siga o cenário **B**.
- IDs **iguais** → o banco de produção está fora do ar; siga o cenário **A** agora.

---

## 2. O que fazer nos próximos 5 dias

### Cenário A — é o banco de produção do MRR
1. Supabase → dashboard → botão **Restore project**. Leva alguns minutos e é grátis.
2. Assim que voltar, faça o backup do item 4 deste runbook.
3. Confirme o smoke test do item 6.
4. Trate a causa (item 3) — plano Pro ou garantir atividade contínua.

### Cenário B — é o projeto legado da v1 (cenário provável)
Mesmo sendo legado, **restaure antes do prazo**: é a única forma de voltar a ter
o projeto funcional, e restaurar não custa nada.

1. **Restore project** no dashboard.
2. Baixe o backup completo (item 4) e guarde fora do Supabase.
3. Com o backup na mão, decida:
   - **Deletar o projeto legado** — libera a vaga do plano Free e elimina o risco
     de novos avisos (recomendado, já que a v1 é só referência histórica); ou
   - **Deixar pausar de novo** — sem custo, mas o aviso volta e o congelamento
     definitivo vira questão de tempo.

> ⚠️ Depois do congelamento permanente o projeto **não volta mais**. Ainda é
> possível baixar os dados, mas a URL, as chaves e o Storage se perdem.

---

## 3. Por que pausou e como não repetir

- No plano **Free**, o Supabase pausa projetos após ~7 dias sem atividade e
  limita a quantidade de projetos ativos por organização.
- O projeto do MRR se mantém "quente" pelos crons diários (`vercel.json`):
  `/api/cron/schedule-services` (08h) e `/api/cron/billing` (09h) — ambos batem
  no banco todo dia. **Atenção:** crons da Vercel só rodam em *produção*; se o
  deploy de produção for pausado ou o `CRON_SECRET` quebrar, o banco volta a
  ficar ocioso e elegível a pausa.
- Opções de blindagem: manter os crons vivos, **deletar projetos que não usa**
  ou subir a organização para **Pro** (sem pausa automática).

---

## 4. Backup — faça sempre antes de qualquer decisão

**Pelo dashboard:** Database → Backups (ou Settings → General → *Download backup*
em projetos pausados/congelados).

**Por linha de comando** (connection string em Project Settings → Database):

```bash
# schema + dados (public)
pg_dump "postgresql://postgres:[SENHA]@db.[REF].supabase.co:5432/postgres" \
  --schema=public --no-owner --no-privileges -f backup_public.sql

# usuários de autenticação
pg_dump "postgresql://postgres:[SENHA]@db.[REF].supabase.co:5432/postgres" \
  --schema=auth --no-owner --no-privileges -f backup_auth.sql
```

Storage (fotos do bucket `service-photos`) **não sai no `pg_dump`** — baixe pelo
dashboard (Storage → bucket → download) ou via API antes de deletar o projeto.

---

## 5. Reconstrução do zero em um projeto novo

Use se o projeto congelar ou se for preciso recriar o ambiente. Este repo tem
todo o SQL necessário — só a **ordem** importa.

### Passo 0 — criar o projeto
Novo projeto no Supabase → anote `Project URL`, `anon key` e `service_role key`.

### Passo 1 — base de `profiles`
Execute de `supabase/schema.sql` **apenas**: `create extension "uuid-ossp"`, o
enum `user_role`, a tabela `profiles`, a função `handle_new_user()` e o trigger
`on_auth_user_created`.

> ⚠️ **Não rode `schema.sql` inteiro.** As definições de `service_requests`,
> `reviews` e `quotes` ali são da v1 e estão desatualizadas (`panel_count`,
> `tecnico_id`, FK para `profiles(id)`). As migrations usam
> `CREATE TABLE IF NOT EXISTS` — se a tabela errada já existir, elas passam em
> silêncio e o app quebra em runtime.

### Passo 2 — migrations, nesta ordem
Cole cada arquivo inteiro no SQL Editor, um por vez:

```
 1. 20260328_fix_profiles_rls.sql
 2. 20260330_service_requests.sql       ← service_requests no formato atual
 3. 20260330_service_reports.sql
 4. 20260330_reviews.sql
 5. 20260330_messages.sql
 6. 20260330_payment_columns.sql
 7. 20260331_location_columns.sql
 8. 20260331_pricing_columns.sql
 9. 20260331_contact_attempt_logs.sql
10. 20260401_escalation_sla_columns.sql
11. 20260401_fix_rls_policies.sql
12. 20260403_profiles_rls.sql
13. 20260403_fix_technician_rls.sql
14. 20260403_report_columns.sql
15. 20260404_technician_presence_location.sql
16. 20260405_fix_profiles_update_rls.sql
17. 20260416_subscriptions.sql          ← ANTES dos dois de baixo
18. 20260416_monthly_reports.sql
19. 20260416_service_requests_v2.sql
20. 20260421_add_missing_fields.sql     ← cria referrals
21. 20260421_referrals_rls_policies.sql
22. 20260422_notifications.sql
23. 20260422_profiles_approved_at.sql
24. 20260430_fix_rls_profiles.sql
25. 20260612_business_model.sql         ← invoices, referral_code, bucket
```

> ⚠️ A ordem alfabética dos arquivos **não** é a ordem correta:
> `20260416_subscriptions.sql` vem por último no `ls`, mas
> `monthly_reports` e `service_requests_v2` têm FK para `subscriptions(id)`.

### Passo 3 — Storage
A migration 25 já cria o bucket público `service-photos` e as policies de
upload/leitura. Confirme em Storage → Buckets.

### Passo 4 — Auth
- Authentication → URL Configuration: `Site URL` = domínio de produção;
  `Redirect URLs` = domínio + `http://localhost:3000` para dev.
- Google OAuth: habilitar o provider e colar Client ID/Secret (login e cadastro
  usam `signInWithOAuth`).
- **Admin:** o RLS lê `auth.jwt() -> 'user_metadata' ->> 'role'`. Depois de criar
  o usuário admin, grave `role: "admin"` no `user_metadata` — sem isso o
  `/admin` não enxerga nada.

### Passo 5 — dados demo (opcional)
```
scripts/seed-users-demo.sql        (senha padrão Demo@2026!)
scripts/seed-v2-subscriptions.sql  (exige as migrations 17–19)
scripts/seed-location.sql          (ajustar e-mails marcados "← SUBSTITUIR")
scripts/reset-presenca-demo.sql    (antes de demos, deixa técnicos "online")
```

### Passo 6 — variáveis de ambiente
Na Vercel (Production + Preview + Development) e no `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY     # server-side apenas
CRON_SECRET                   # usado pelos dois crons
```
Depois de trocar qualquer uma: **redeploy** (variáveis `NEXT_PUBLIC_*` são
embutidas no build). Atualize também a URL citada em `README.md`,
`MOBILE_BRIEFING.md` e `DESIGN_TOKENS.md`.

---

## 6. Smoke test pós-restauração

- [ ] Login com os 3 perfis (cliente, técnico, admin) e redirect sem flash
- [ ] `/cliente` carrega hero com dados reais (não o mock com badge)
- [ ] `/tecnico/chamados` lista chamados pendentes
- [ ] `/admin/mapa` mostra técnicos (depende de `last_seen`)
- [ ] Upload de foto no relatório do técnico grava em `service-photos`
- [ ] `curl -H "Authorization: Bearer $CRON_SECRET" <app>/api/cron/billing` → 200
- [ ] `npm run build` com 0 erros
