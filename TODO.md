# Painel Clean Plataforma v2 — TODO & Histórico de Decisões

> Arquivo vivo. Atualizar a cada sessão.
> Versão: v2 — modelo assinatura (Netflix)
> Última atualização: 2026-04-20

---

## PENDENTES (a fazer)

### Landing /v2 — ajustes finais
- [ ] Partículas — replicar estilo ascending da v1 (em andamento no Claude Code)
- [ ] Promover /v2 → / após aprovação final (arquivar atual em /v1)

### Dashboards — próxima fase
- [ ] Dashboard cliente — alinhar layout com landing v3 (header, footer, tipografia, espaçamentos)
- [ ] Dashboard cliente — telas faltando: Meu Plano, Relatórios, Solicitar Avulsa, Histórico, Perfil
- [ ] Dashboard cliente — ícones do menu melhorar
- [ ] Dashboard cliente — implementar no Claude Code após protótipo aprovado
- [ ] Dashboard técnico — prototipar no Claude Design (agenda assinatura vs avulso, chamados, ganhos)
- [ ] Dashboard admin — prototipar no Claude Design (assinaturas MRR/churn, relatórios, mapa)
- [ ] Implementar dashboards no Claude Code após protótipos aprovados

### Banco de dados
- [ ] Testar fluxo end-to-end com dados reais (cliente → técnico → admin)

### Pré-lançamento
- [ ] Auditoria de acessibilidade (web-design-guidelines)
- [ ] Testar responsivo mobile em todas as páginas
- [ ] Configurar domínio customizado no Vercel

### Pós-MVP
- [ ] Integração API inversores (Fronius, SolarEdge, Growatt, Sungrow, Hoymiles, Deye)
- [ ] Débito automático recorrente
- [ ] App mobile (base responsiva sendo construída com isso em mente)

---

## CONCLUÍDO — Sessão 2026-04-20

### Landing /v2 — implementação via Claude Code terminal
- [x] Claude Code terminal instalado no WSL (Ubuntu 24) via npm install -g @anthropic-ai/claude-code
- [x] Claude Code extensão VS Code configurada (WSL terminal)
- [x] Workflow descoberto: cat HTML | claude "instruções" para arquivos grandes
- [x] HTML do Claude Design extraído via standalone export + Python bundle unpacker automático
- [x] Landing v3 implementada: 14 seções, 15+ componentes em components/landing-v2/
- [x] Assets copiados: hero-solar-v2.png (já existia), logos landing-v2-*
- [x] sc-municipios.ts criado com 295 municípios de SC para o mapa
- [x] Rota /v2 adicionada às rotas públicas no middleware.ts
- [x] Title/metadata: "Painel Clean — Sua usina solar no máximo, o ano inteiro"
- [x] Calculadora: premissa corrigida para 130 kWh/kWp/mês (era 1,35/dia ≈ 40/mês — muito baixo)
- [x] Calculadora: toggle padrão alterado para "Nunca" (30% perda, argumento mais forte)
- [x] Calculadora: sinal negativo na geração corrigido (~ 446 kWh/mês)
- [x] Calculadora: footnote premissas corrigido para "130 kWh/kWp/mês"
- [x] Payback section: dobra "Se paga em ~4 dias" adicionada (entre StatsBar e Calculadora)
- [x] Payback section: ícones diferenciados por plano (1, 2, 3 painéis solares SVG)
- [x] Git workflow: commits cirúrgicos sem CRLF churn, cherry-pick quando remoto divergiu

### Banco de dados v2
- [x] Migrations aplicadas: subscriptions, monthly_reports, service_requests_v2
- [x] Seed executado: 4 clientes com assinatura ativa + monthly_reports + service_requests
- [x] panel_count removido do seed (coluna não existe no banco atual)
- [x] Clientes demo com assinatura: Fernanda Alves (Padrão), Ana Silva (Básico), Ricardo Mendes (Plus), Maria Oliveira (Padrão)

---

## CONCLUÍDO — Sessão 2026-04-18

### Landing atual (/) — refinamentos mobile e visual
- [x] Hero mobile: background-position 30% center, overlay mais escuro, título 2rem
- [x] Trust badges: grid 2x2+1 no mobile, 5º badge centralizado
- [x] Hover states em cards de plano, depoimentos, botões
- [x] FAQ accordion com transição suave (max-height + opacity 300ms)
- [x] Contador animado na prova social (IntersectionObserver)
- [x] Seção "Onde atuamos" com cidades ativas + em breve

---

## CONCLUÍDO — Sessão 2026-04-17

### Setup v2
- [x] Repo painel-clean-v2 criado no GitHub
- [x] Supabase painel-clean-v2 configurado
- [x] 6 técnicos + 6 clientes + 1 admin demo criados
- [x] Deploy Vercel painel-clean-v2.vercel.app
- [x] Google OAuth configurado
- [x] lib/pricing.ts — faixas v2
- [x] lib/config.ts — SUBSCRIPTION_ENABLED = true

---

## DECISÕES TOMADAS — v2

- **Modelo:** assinatura mensal (Netflix) com avulso como secundário
- **Planos:** Básico R$30/≤15mod, Padrão R$50/16-30mod, Plus R$100/31-60mod, Pro/Business sob consulta
- **Limpezas:** 2/ano incluídas em todos os planos
- **Entrada:** 1ª limpeza 50% off + contrato mínimo 12 meses
- **Cancelamento:** paga saldo devedor do período restante
- **Limpeza extra:** 40% mais barata que avulso para assinantes
- **Calculadora:** 130 kWh/kWp/mês (média SC), tarifa R$0,92/kWh, toggle padrão "Nunca" (30% perda)
- **Sem % de comissão** na landing — só no dashboard técnico pós-login
- **Sem "sem fidelidade"** — existe contrato de 12 meses, não mencionar na landing
- **Planos por módulos** — sem "Mais Popular", critério é tamanho da usina
- **Landing:** /v2 nova isolada, / atual intacta até aprovação → depois /v2 vira /, antiga vira /v1
- **Claude Code terminal** (VS Code WSL) é o ambiente principal — web tem limitações de upload
- **Dashboard cliente:** hero dinâmico com 5 estados: tranquilo / relatório chegou / queda detectada / limpeza em 3 dias / pós-limpeza
- **Referência visual:** landing v3 é o padrão — dashboards devem alinhar com ela (header, footer, tipografia)

---

## PRÓXIMAS SESSÕES

- [ ] Fechar partículas na /v2 e fazer deploy
- [ ] Briefing pro Claude Design: dashboards técnico + admin
- [ ] Implementar dashboard cliente (Home já prototipado, faltam sub-páginas)
- [ ] Definir fluxo de avulsa dentro da plataforma
- [ ] Discussões pendentes: certificação técnicos, política cancelamento, SLA sem técnico, precificação Pro/Business
