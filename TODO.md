markdown# Painel Clean Plataforma v2 — TODO & Histórico de Decisões

> Arquivo vivo. Atualizar a cada sessão.
> Versão: v2 — modelo assinatura (Netflix)
> Iniciado em: 2026-04-16

---

## PENDENTES (a fazer)

### Banco de dados
- [ ] Migration: criar tabela `subscriptions`
- [ ] Migration: criar tabela `monthly_reports`
- [ ] Migration: adicionar `origin` e `subscription_id` em `service_requests`
- [ ] Migration: RLS para `subscriptions` e `monthly_reports`

### Fluxo do cliente (novo)
- [ ] Cadastro coleta módulos + cidade + modelo do inversor
- [ ] Plataforma sugere plano baseado no nº de módulos
- [ ] Tela de oferta: 1ª limpeza 50% + contrato 12 meses
- [ ] Pagamento de entrada
- [ ] Pós-serviço: confirmação de assinatura ativa
- [ ] Agendamento automático da 2ª limpeza do ano

### Dashboard cliente (refatorar)
- [ ] Home: status do plano ativo + próxima limpeza + último relatório
- [ ] Nova página "Meu Plano": detalhes, histórico de pagamentos, upgrade
- [ ] Nova página "Relatórios": relatórios mensais de performance
- [ ] "Solicitar serviço" → renomear para "Contratar limpeza avulsa"

### Dashboard admin
- [ ] Nova seção "Assinaturas": MRR, assinantes ativos, churn, planos por faixa
- [ ] Nova seção "Relatórios": envios pendentes, status integração inversores

### Dashboard técnico
- [ ] Agenda: separar serviços de assinantes vs avulsos
- [ ] Chamados: badge de origem (assinatura / avulso)

### Landing page (refatorar)
- [ ] Hero: novo argumento — "se paga em 4 dias"
- [ ] Seção de planos: Básico / Padrão / Plus com preços e benefícios
- [ ] Calculadora: mostrar prejuízo mensal por sujeira vs custo assinatura
- [ ] Remover referências ao modelo avulso como principal
- [ ] Seção de diferenciais: relatório mensal, API inversores, seguro na limpeza

### Config
- [ ] `lib/config.ts`: SUBSCRIPTION_ENABLED = true
- [ ] `lib/pricing.ts`: atualizar faixas de preço para v2

### Pós-MVP
- [ ] Integração real com API dos inversores (Fronius, SolarEdge, Growatt, Sungrow, Hoymiles, Deye)
- [ ] Relatório mensal automático via API
- [ ] Débito automático recorrente

---

## EM ANDAMENTO

Nada em andamento — setup v2 concluído em 2026-04-16.

---

## CONCLUÍDO — Setup v2 (2026-04-16)

- [x] Repo `painel-clean-v2` criado no GitHub a partir da v1
- [x] Novo projeto Supabase `painel-clean-v2` criado
- [x] Todas as migrations da v1 aplicadas no novo banco
- [x] Usuários demo criados (6 técnicos + 6 clientes + admin)
- [x] Deploy no Vercel `painel-clean-v2.vercel.app`
- [x] Env vars configuradas no Vercel
- [x] Google OAuth configurado para o novo domínio
- [x] CLAUDE.md e TODO.md atualizados para v2

---

## DECISÕES TOMADAS — v2 (2026-04-16)

- **Modelo:** assinatura mensal (Netflix) com avulso como secundário
- **Planos:** Básico R$30/15mod, Padrão R$50/30mod, Plus R$100/60mod, Pro/Business sob consulta
- **Limpezas:** 2 por ano incluídas em todos os planos
- **Entrada:** 1ª limpeza a 50% do avulso + contrato mínimo 12 meses
- **Cancelamento:** carência — paga saldo devedor, perde limpeza não realizada
- **Limpeza extra:** 40% mais barata que avulso para assinantes
- **Preço avulso:** R$30/placa (≤30), R$25 (31–50), R$20 (51–100), sob consulta (100+)
- **Custo técnico:** R$10/placa
- **Seguro:** cobre danos causados DURANTE a limpeza, não o ativo
- **API inversores:** pós-MVP, manual no início
- **Argumento central:** placas sujas = prejuízo ~R$218–729/mês, assinatura se paga em ~4 dias
- **Comparativo 3 anos (20 módulos):** avulso R$3.600 vs assinatura R$2.100 — economia 42%

---

## PRÓXIMAS SESSÕES — Pendências com o cunhado

- [ ] Certificação dos técnicos — online, presencial ou híbrido?
- [ ] Política de cancelamento — multa além da carência?
- [ ] O que cobre o seguro contra danos — termos, limite, processo de acionamento
- [ ] SLA sem técnico disponível na cidade — lista de espera? reembolso?
- [ ] Precificação do Pro e Business — quais variáveis definem o valor?
- [ ] Validar preços das faixas com clientes reais

---

## HISTÓRICO v1 (preservado para referência)

Ver repo `painel-clean-plataforma` e branch `main`.
Modelo avulso (Uber), comissão 25%/75%, faixas antigas de preço.

Salva (Ctrl+S) e depois no terminal:
bashcd C:\Users\Rafu\painel-clean-v2
git add CLAUDE.md TODO.md
git commit -m "docs: CLAUDE.md e TODO.md atualizados para modelo v2 assinatura"
git push origin main