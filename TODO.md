# Painel Clean Plataforma v2 — TODO & Histórico de Decisões

> Arquivo vivo. Atualizar a cada sessão.
> Versão: v2 — modelo assinatura (Netflix)
> Última atualização: 2026-04-18

---

## PENDENTES (a fazer)

### Landing page
- [ ] Aplicar interface-design skill nos dashboards quando iniciar área interna
- [ ] Aplicar web-design-guidelines (auditoria acessibilidade) antes do lançamento
- [ ] Explorar Claude Design para protótipos das telas internas

### Dashboards (pós-landing)
- [ ] Dashboard cliente: home com status do plano + próxima limpeza + último relatório
- [ ] Dashboard cliente: nova página "Meu Plano"
- [ ] Dashboard cliente: nova página "Relatórios"
- [ ] Dashboard admin: nova seção "Assinaturas" (MRR, churn, ativos)
- [ ] Dashboard técnico: agenda separando assinatura vs avulso

### Banco de dados
- [ ] Rodar migrations v2 no Supabase (subscriptions, monthly_reports, service_requests_v2) — arquivos criados, ainda não aplicados

### Pós-MVP
- [ ] Integração API inversores (Fronius, SolarEdge, Growatt, Sungrow, Hoymiles, Deye)
- [ ] Débito automático recorrente
- [ ] App mobile

---

## CONCLUÍDO — Sessão 2026-04-18

### Mobile hero
- [x] background-position 30% center no mobile para mostrar técnico na foto
- [x] Trust badges: grid 2x2 no mobile, 5º badge centralizado em col-span-2
- [x] Ícone "Checkup técnico" trocado para ✅
- [x] Botões hero mobile: max-width 320px, centralizados
- [x] Overlay direcional mais escuro no mobile para legibilidade
- [x] Título hero mobile: 2rem / line-height 1.2
- [x] Círculos numerados do passo a passo: 32px no mobile
- [x] Prova social mobile: números em coluna única + título "Resultados que falam por si"
- [x] Card "Em breve" full-width no mobile

### Refinamento visual (Impeccable + interaction-design embutidos)
- [x] Hover states em cards de plano (translateY -4px + sombra)
- [x] Hover states em depoimentos (translateY -2px)
- [x] Hover states em botões primários (translateY + scale + sombra verde)
- [x] Hover states em botões outline (swap para fundo verde)
- [x] FAQ accordion com transição suave (max-height + opacity 300ms)
- [x] Contador animado na prova social (IntersectionObserver, 0→500/100/fade)
- [x] Tipografia: h2 800 weight, -0.02em tracking, badges 11px/0.1em

### Estrutura e conteúdo da landing
- [x] Ordem final das seções: Hero → Payback → Calculadora → Planos → Como funciona → Prova social → Diferenciais → Técnico → Onde atuamos → CTA Final → FAQ → Footer
- [x] Prova social: 500+ / 100% / 4 dias + 3 depoimentos com avatar
- [x] FAQ accordion com 6 perguntas
- [x] Seção "Onde atuamos": 2 colunas, cidades ativas + em breve com ícones e contadores de fila
- [x] Seção "Como funciona": 4 passos atualizados para modelo assinatura
- [x] Seção diferenciais: 4 cards SVG (Técnicos certificados, Relatório fotográfico, Seguro na limpeza, Preço transparente)
- [x] CTA Final: fundo #EBF3E8, dois botões
- [x] Divisor gradiente entre calculadora e seção de planos

---

## CONCLUÍDO — Sessão 2026-04-17

### Setup v2
- [x] Repo painel-clean-v2 criado no GitHub a partir da v1
- [x] Novo Supabase painel-clean-v2 criado e migrations v1 aplicadas
- [x] Usuários demo criados (6 técnicos + 6 clientes + admin)
- [x] Deploy no Vercel painel-clean-v2.vercel.app
- [x] Google OAuth configurado para novo domínio
- [x] CLAUDE.md e TODO.md atualizados para v2

### Migrations v2
- [x] 20260416_subscriptions.sql — tabela subscriptions
- [x] 20260416_monthly_reports.sql — tabela monthly_reports
- [x] 20260416_service_requests_v2.sql — origin + subscription_id
- [x] lib/config.ts — SUBSCRIPTION_ENABLED = true
- [x] lib/pricing.ts — faixas v2 + calcularEntrada + calcularLimpezaExtra + sugerirPlano

### Landing page v2
- [x] Nova imagem hero: técnico limpando placas com escova (hero-solar-v2.png)
- [x] Hero: novo copy modelo assinatura, trust badges atualizados
- [x] Animações hero: Ken Burns + shimmer (2s delay, 8s repeat) + fade sequencial + pulso 30%
- [x] Seção "Investimento que se paga rápido": 3 cards topo escuro + partículas + ícones SVG distintos
- [x] Calculadora: slider + mini cards clicáveis + kWh perdidos + economia 3 anos + "Garantir minha assinatura"
- [x] Seção de planos: fundo claro, 3 cards iguais sem favorecimento, limpeza avulsa discreta
- [x] Logo: "Painel Clean" maior, subtítulo "Limpeza e cuidado para usinas solares"
- [x] Partículas: BannerParticles nos cards, TecnicoParticles na seção técnico, LoginBackground no login
- [x] Admin/usuarios: corrigido para usar createServiceClient() — dados reais

---

## DECISÕES TOMADAS — v2

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
- **Sem favorecimento de plano:** todos os cards com mesmo visual, sem "Mais Popular"
- **Skills de design:** Impeccable + interaction-design embutidos nos prompts; interface-design para dashboards; web-design-guidelines para auditoria pré-lançamento

---

## PRÓXIMAS SESSÕES

- [ ] Explorar Claude Design para protótipos dos dashboards
- [ ] Certificação dos técnicos — online, presencial ou híbrido?
- [ ] Política de cancelamento — multa além da carência?
- [ ] O que cobre o seguro contra danos — termos, limite, processo
- [ ] SLA sem técnico disponível — lista de espera? reembolso?
- [ ] Precificação Pro e Business
- [ ] Validar preços com clientes reais
