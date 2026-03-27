# Painel Clean — Plataforma MVP

## O que é este projeto

Marketplace de limpeza de placas solares, modelo similar ao Uber/iFood.
Donos de usinas solares contratam técnicos qualificados para limpar e diagnosticar seus painéis.
Projeto paralelo à empresa **Painel Clean** (painelclean.com.br), que vende escovas profissionais para limpeza de placas solares.

---

## Stack técnica

- **Framework:** Next.js 14 (App Router)
- **Estilização:** Tailwind CSS
- **Backend/DB/Auth:** Supabase (PostgreSQL + Auth + Storage)
- **Pagamentos:** Asaas (PIX, cartão, boleto — melhor opção para Brasil)
- **Notificações:** WhatsApp via Z-API ou Twilio
- **Storage de fotos:** Supabase Storage
- **Deploy:** Vercel

---

## Identidade visual

Baseada no site oficial painelclean.com.br.

```css
--green-dark:   #1B3A2D;  /* cor principal — textos, headers, botões secundários */
--green-vibe:   #3DC45A;  /* verde vibrante — botões primários, destaques, logo */
--green-light:  #EBF3E8;  /* fundo de navbars, cards suaves, chips */
--green-pale:   #F4F8F2;  /* fundo geral da página */
--green-border: #C8DFC0;  /* bordas */
--muted:        #7A9A84;  /* textos secundários */
```

**Tipografia:**
- Títulos e labels: `Montserrat` (700–900)
- Corpo e inputs: `Open Sans` (400–600)

**Logo:** ícone verde vibrante com losangos + "Painel Clean" em verde escuro.
Subtítulo no header: "Limpeza de Placa Solar".

---

## Operação

- **Cidades piloto:** Jaraguá do Sul (SC), Pomerode (SC), Florianópolis (SC)
- **Fase 1 — MVP:** somente web responsivo (mobile-first)
- **Fase 2 — futuro:** app React Native

---

## Modelo de negócio

**Híbrido: comissão por serviço + assinatura do técnico**

| Receita | Descrição |
|---|---|
| Comissão 15% | Retida a cada serviço concluído |
| Assinatura técnico | Mensalidade para acesso à plataforma |
| Cross-sell | Técnicos compram escovas Painel Clean com desconto |
| Planos recorrentes | Cliente assina pacote trimestral/anual com desconto |

---

## Tabela de preços dos serviços

| Faixa | Módulos | Preço |
|---|---|---|
| Pequena | Até 10 módulos | R$ 180 |
| Média | 11 a 30 módulos | R$ 300 ← mais comum |
| Grande | 31 a 60 módulos | R$ 520 |
| Usina | 61+ módulos | Sob consulta |

**Tempo médio por serviço:** 2–3 horas
**Repasse ao técnico:** 85% do valor (ex: R$255 de R$300)
**Pagamento ao técnico:** PIX automático após conclusão e confirmação do pagamento

---

## Perfis de usuário

### 1. Cliente (dono das placas)
- Cadastra endereço e dados da instalação
- Solicita agendamento (cidade, quantidade de módulos, data, período)
- Acompanha status do serviço
- Recebe relatório fotográfico com diagnóstico
- Paga via PIX / cartão / boleto (somente após conclusão)
- Avalia o técnico (1–5 estrelas)
- Acessa histórico completo de serviços

### 2. Técnico (prestador de serviço)
**Requisitos para cadastro:**
- Experiência prévia como eletricista ou técnico em elétrica
- Conclusão do treinamento online obrigatório da Painel Clean
- Aprovação manual pelo admin

**Fluxo de trabalho:**
- Liga/desliga disponibilidade para receber chamados
- Recebe notificação de chamados na sua cidade
- Visualiza detalhes (endereço, distância, módulos, repasse)
- Aceita ou recusa o chamado
- Navega até o endereço
- Preenche relatório fotográfico (fotos antes + depois + diagnóstico)
- Confirma conclusão → recebe PIX automaticamente

### 3. Admin (equipe Painel Clean)
- Aprova ou recusa cadastros de técnicos
- Bloqueia aprovação se treinamento incompleto
- Monitora todos os serviços em tempo real
- Dashboard: receita, serviços por cidade, avaliações
- Gestão financeira e comissões
- Suporte a clientes e técnicos

---

## Fluxo principal do serviço

```
1. Cliente solicita → informa cidade, endereço, nº módulos, data, período
2. Sistema faz matching → notifica técnicos disponíveis na região
3. Técnico aceita → cliente é notificado via WhatsApp
4. Técnico executa → preenche relatório fotográfico (antes/depois + diagnóstico)
5. Técnico conclui → cliente recebe relatório e é cobrado
6. Pagamento confirmado → PIX automático para o técnico (85%)
7. Cliente avalia → feedback visível no perfil do técnico
```

---

## Funcionalidades do MVP (Fase 1)

- [x] Autenticação (email + Google) via Supabase Auth
- [x] Cadastro de cliente com endereço de instalação
- [x] Cadastro de técnico com validação de documentos e treinamento
- [x] Solicitação de serviço com agendamento
- [x] Sistema de matching técnico por cidade
- [x] Relatório fotográfico (upload via Supabase Storage)
- [x] Pagamento in-app via Asaas (PIX, cartão, boleto)
- [x] Repasse automático ao técnico via PIX
- [x] Sistema de avaliação (1–5 estrelas)
- [x] Histórico de serviços para cliente e técnico
- [x] Notificações via WhatsApp
- [x] Dashboard admin com métricas básicas
- [x] Aprovação manual de técnicos pelo admin

---

## Estrutura de pastas sugerida

```
/app
  /cliente
    /home
    /agendar
    /historico
    /relatorio/[id]
    /perfil
  /tecnico
    /home
    /chamados
    /em-andamento
    /relatorio/[id]
    /ganhos
    /perfil
  /admin
    /dashboard
    /servicos
    /tecnicos
    /financeiro
  /auth
    /login
    /cadastro

/components
  /ui          ← botões, badges, cards, inputs reutilizáveis
  /cliente
  /tecnico
  /admin
  /shared      ← header, bottom-nav, modais

/lib
  /supabase    ← cliente supabase, helpers
  /asaas       ← integração pagamentos
  /zapi        ← integração whatsapp

/types         ← typescript types do projeto
```

---

## Schema do banco (Supabase / PostgreSQL)

```sql
-- Usuários (extende auth.users do Supabase)
profiles (
  id uuid references auth.users,
  role: 'cliente' | 'tecnico' | 'admin',
  nome, telefone, cidade, created_at
)

-- Instalações do cliente
instalacoes (
  id, cliente_id, endereco, cidade, numero_modulos,
  created_at
)

-- Técnicos
tecnicos (
  id, profile_id, cidade, status_aprovacao: 'pendente' | 'aprovado' | 'recusado',
  treinamento_concluido bool, documento_url, avaliacao_media,
  created_at
)

-- Serviços
servicos (
  id, cliente_id, tecnico_id, instalacao_id,
  status: 'buscando' | 'aceito' | 'em_andamento' | 'concluido' | 'cancelado',
  data_agendada, periodo: 'manha' | 'tarde',
  valor_total, valor_tecnico, valor_plataforma,
  forma_pagamento: 'pix' | 'cartao' | 'boleto',
  pagamento_status: 'pendente' | 'pago',
  created_at, concluido_at
)

-- Relatórios fotográficos
relatorios (
  id, servico_id,
  fotos_antes: text[],  -- URLs Supabase Storage
  fotos_depois: text[],
  estado_modulos: 'bom' | 'regular' | 'ruim',
  modulos_danificados int,
  observacoes text,
  created_at
)

-- Avaliações
avaliacoes (
  id, servico_id, cliente_id, tecnico_id,
  nota int (1-5), comentario text, created_at
)
```

---

## Regras de negócio importantes

1. Técnico só aparece nos chamados da sua cidade cadastrada
2. Técnico só pode ser aprovado se `treinamento_concluido = true`
3. Pagamento só é processado após técnico marcar serviço como concluído
4. PIX para o técnico é enviado automaticamente após confirmação do pagamento
5. Relatório fotográfico é obrigatório para concluir o serviço
6. Avaliação só pode ser feita após serviço concluído e pago
7. Técnico pode recusar chamado sem penalidade no MVP

---

## Referência visual

O protótipo navegável completo (3 perfis, todos os fluxos) foi desenvolvido
em HTML/CSS puro e pode ser usado como referência fiel de UI/UX.

Componentes-chave a replicar:
- Header: fundo `green-light`, logo real, texto "Painel Clean / Limpeza de Placa Solar"
- Bottom nav: fundo `green-light`, ativo em `green-dark`
- Hero banner: fundo `green-dark`, destaque em `green-vibe`
- Cards: fundo branco, borda `green-border`, radius 14px
- Botão primário: `green-vibe`, texto branco, Montserrat 700
- Botão outline: borda `green-dark`, texto `green-dark`
- Badges: sistema de cores (green=concluído, warn=pendente, blue=agendado)
- Tabela de preços: linha highlight em `green-light` para faixa mais comum
- Repasse box: fundo `green-dark`, valor final em `green-vibe`
