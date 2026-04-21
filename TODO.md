# Painel Clean Plataforma v2 — TODO & Histórico de Decisões

> Arquivo vivo. Atualizar a cada sessão.
> Versão: v2 — modelo assinatura (Netflix)
> Última atualização: 2026-04-21

---

## PENDENTES (a fazer)

### Dashboard cliente — ajustes visuais
- [ ] Header — corrigir para seguir pixel-perfect o Header.jsx do handoff (fundo #EBF3E8, nav pills, avatar com plano)
- [ ] Menu — atualizar para ordem correta: Início · Relatórios · Histórico · Solicitar Limpeza · Indicações · Perfil
- [ ] Páginas internas — alinhar tipografia, eyebrows, cards com tokens do handoff
- [ ] Partículas e animações fade-up nas seções dark das páginas internas
- [ ] "Meu Plano" mover para dentro de Perfil (remover do menu)

### Login e cadastro — reimplementar
- [ ] Login — refinamento visual com tokens da landing v2 (protótipo aprovado em 2026-04-21)
- [ ] Cadastro — novo fluxo em steps:
  - Cliente: Dados pessoais → Dados da usina (+ adicionar mais usinas) → Escolha do plano → Confirmação
  - Técnico: Dados pessoais → Experiência/disponibilidade → Aguardando aprovação (admin aprova)
- [ ] Protótipo aprovado — pode implementar no Claude Code

### Dashboards técnico e admin
- [ ] Dashboard técnico — briefing pro Claude Design (agenda assinatura vs avulso, chamados, ganhos)
- [ ] Dashboard admin — briefing pro Claude Design (assinaturas MRR/churn, relatórios, mapa)
- [ ] Implementar dashboards no Claude Code após protótipos aprovados

### Landing /v2 — fechar
- [ ] Promover /v2 → / após aprovação final (arquivar atual em /v1)

### Banco de dados
- [ ] Testar fluxo end-to-end com dados reais (cliente → técnico → admin → repasse)
- [ ] Criar tabela `referrals` se ainda não existir

### Pré-lançamento
- [ ] Auditoria de acessibilidade
- [ ] Testar responsivo mobile em todas as páginas
- [ ] Configurar domínio customizado no Vercel
- [ ] Adicionar SUPABASE_SERVICE_ROLE_KEY no .env.local (2 erros de build em rotas admin)

### Pós-MVP
- [ ] Integração API inversores (Fronius, SolarEdge, Growatt, Sungrow, Hoymiles, Deye)
- [ ] Débito automático recorrente
- [ ] App mobile (base responsiva sendo construída com isso em mente)
- [ ] Certificação de técnicos (checklist admin + aprovação)
- [ ] Geração automática de PDF de relatório com fotos antes/depois

---

## CONCLUÍDO — Sessão 2026-04-21

### Dashboard cliente v2 — implementado via Claude Code
- [x] Layout base com header + proteção de role
- [x] Home — HeroCard (5 estados dinâmicos) + 3 StatCards + histórico resumido + CTA avulsa
- [x] ReagendarModal — calendário 14 dias + seleção de turno + confirmação
- [x] Meu Plano — hero dark, cobrança, contrato, comparativo planos, limpeza extra, cancelamento
- [x] Relatórios — 3 métricas + gráfico de barras Chart.js + lista PDFs + card informativo
- [x] Histórico — gráfico linha eficiência + barras antes/depois + tabela completa
- [x] Indicações — hero 12% + progress 5 níveis + link copia-cola + tabela indicados + como funciona
- [x] Perfil — dados pessoais + minha usina + assinatura + pagamento + toggles notificações
- [x] Avulsa — 3-step wizard (Detalhes → Resumo → Confirmação) com cálculo 40% off
- [x] lib/mock-cliente.ts criado com MOCK_CLIENTE, MOCK_HISTORICO, MOCK_RELATORIOS, MOCK_INDICACOES
- [x] Chart.js 4.5.1 + react-chartjs-2 5.3.1 instalados
- [x] Fix redirect pós-login — /api/auth/redirect usando createClient() (não service)

### Documentação
- [x] CLAUDE.md atualizado com identidade de marca, tagline, tom de voz, banco completo, fluxos
- [x] TODO.md atualizado

### Protótipos aprovados (prontos para implementar)
- [x] Login/cadastro — protótipo interativo aprovado em 2026-04-21
  - Login: fundo dark green + partículas + Google OAuth + email/senha
  - Cadastro cliente: 4 steps (dados → usina → plano → confirmação)
  - Cadastro técnico: 3 steps (dados → experiência → aguardando aprovação)

---

## CONCLUÍDO — Sessão 2026-04-20

### Landing /v2 — implementação via Claude Code terminal
- [x] Claude Code terminal instalado no WSL (Ubuntu 24) via npm install -g @anthropic-ai/claude-code
- [x] Landing v3 implementada: 14 seções, 15+ componentes em components/landing-v2/
- [x] Partículas corrigidas: canvas-based, opacidade 0.4–0.7, velocidade 10–18s
- [x] Calculadora: premissa 130 kWh/kWp/mês, toggle padrão "Nunca" (30% perda)
- [x] Dobra "Se paga em ~4 dias" adicionada com ícones por plano
- [x] sc-municipios.ts criado com 295 municípios de SC

### Banco de dados v2
- [x] Migrations aplicadas: subscriptions, monthly_reports, service_requests_v2
- [x] Seed: 4 clientes com assinatura ativa + monthly_reports + service_requests

---

## CONCLUÍDO — Sessão 2026-04-18

### Landing atual (/) — refinamentos
- [x] Hero mobile: background-position 30% center
- [x] FAQ accordion com transição suave
- [x] Contador animado na prova social
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
- **Calculadora:** 130 kWh/kWp/mês, tarifa R$0,92/kWh, toggle padrão "Nunca"
- **Sem % de comissão** na landing — só no dashboard técnico pós-login
- **Sem "sem fidelidade"** — existe contrato de 12 meses
- **Planos por módulos** — sem "Mais Popular"
- **Programa de indicações:** +6% por indicação, máximo 30% (5 indicações), válido 12 meses
- **Menu dashboard cliente:** Início · Relatórios · Histórico · Solicitar Limpeza · Indicações · Perfil
- **"Meu Plano"** fica dentro de Perfil — não é item de menu separado
- **Avulsa/Reagendar:** avulsa = página própria 3 steps | reagendar = modal na home
- **Claude Code terminal** (VS Code WSL) é o ambiente principal
- **Dashboard cliente:** hero dinâmico com 5 estados (healthy/post_cleaning/soon/drop/report)
- **Referência visual:** handoff do Claude Design é fonte de verdade — não protótipos do Claude.ai
- **Tagline oficial:** "Limpeza e Cuidado para Usinas Solares"
- **Nomenclatura:** "módulos" (não placas), "usina" (não sistema), "limpeza" (não serviço)

---

## PRÓXIMAS SESSÕES

1. Corrigir header + estilo visual páginas internas dashboard cliente (prompt pronto)
2. Implementar login/cadastro novo (protótipo aprovado)
3. Briefing Claude Design: dashboard técnico + admin
4. Testar fluxo end-to-end com dados reais
