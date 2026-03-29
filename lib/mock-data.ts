// lib/mock-data.ts
// Fonte única de dados mockados para todos os dashboards.
// Substituir pelas queries Supabase quando as tabelas estiverem prontas.

// ── Técnico ───────────────────────────────────────────────────────────────

export const MOCK_TECNICO = {
  // Cards de resumo
  ganhosMes: 3825,
  servicosMes: 14,
  avaliacaoMedia: 4.8,
  tempoMedio: 2.3,
  tendencia: { ganhos: 12, servicos: 3 }, // % e qty vs mês anterior

  // Ganhos por semana (visão mensal do GanhosChart)
  ganhosSemanal: [
    { label: "Sem 1", sub: "01–07", valor: 1020 },
    { label: "Sem 2", sub: "08–14", valor: 850 },
    { label: "Sem 3", sub: "15–21", valor: 1105 },
    { label: "Sem 4", sub: "22–28", valor: 850 },
  ],

  // Ganhos por dia (visão semanal do GanhosChart)
  ganhosDiario: [
    { label: "Seg", sub: "24/03", valor: 420 },
    { label: "Ter", sub: "25/03", valor: 510 },
    { label: "Qua", sub: "26/03", valor: 300 },
    { label: "Qui", sub: "27/03", valor: 595 },
    { label: "Sex", sub: "28/03", valor: 520 },
    { label: "Sáb", sub: "29/03", valor: 255 },
    { label: "Dom", sub: "30/03", valor: 0 },
  ],

  // Últimos 5 serviços (dashboard + ganhos)
  ultimosServicos: [
    { data: "25/03", cidade: "Jaraguá do Sul", modulos: 22, recebido: 255, nota: 5.0 },
    { data: "21/03", cidade: "Pomerode",        modulos: 8,  recebido: 153, nota: 4.5 },
    { data: "18/03", cidade: "Florianópolis",   modulos: 35, recebido: 442, nota: 5.0 },
    { data: "14/03", cidade: "Jaraguá do Sul",  modulos: 15, recebido: 255, nota: 4.8 },
    { data: "10/03", cidade: "Pomerode",        modulos: 28, recebido: 255, nota: 5.0 },
  ],

  // Página de ganhos — resumo financeiro
  resumoMes: {
    totalBruto: 4500,    // 3825 / 0.85
    comissao: 675,       // 15%
    totalRepasse: 3825,  // 85%
    servicos: 14,
    avaliacaoMedia: 4.8,
  },

  // Pagamentos detalhados (página /tecnico/ganhos)
  pagamentos: [
    { id: 1,  data: "28/03/2026", endereco: "Residência — Jaraguá do Sul",  modulos: 22, bruto: 300, repasse: 255 },
    { id: 2,  data: "25/03/2026", endereco: "Comércio — Pomerode",          modulos: 8,  bruto: 180, repasse: 153 },
    { id: 3,  data: "21/03/2026", endereco: "Residência — Florianópolis",   modulos: 35, bruto: 520, repasse: 442 },
    { id: 4,  data: "18/03/2026", endereco: "Sítio — Jaraguá do Sul",       modulos: 8,  bruto: 180, repasse: 153 },
    { id: 5,  data: "14/03/2026", endereco: "Residência — Pomerode",        modulos: 15, bruto: 300, repasse: 255 },
    { id: 6,  data: "10/03/2026", endereco: "Empresa — Florianópolis",      modulos: 28, bruto: 300, repasse: 255 },
    { id: 7,  data: "06/03/2026", endereco: "Residência — Jaraguá do Sul",  modulos: 9,  bruto: 180, repasse: 153 },
    { id: 8,  data: "03/03/2026", endereco: "Usina Solar — Pomerode",       modulos: 52, bruto: 520, repasse: 442 },
    { id: 9,  data: "28/02/2026", endereco: "Comércio — Florianópolis",     modulos: 22, bruto: 300, repasse: 255 },
    { id: 10, data: "24/02/2026", endereco: "Residência — Jaraguá do Sul",  modulos: 12, bruto: 300, repasse: 255 },
    { id: 11, data: "20/02/2026", endereco: "Empresa — Pomerode",           modulos: 30, bruto: 300, repasse: 255 },
    { id: 12, data: "17/02/2026", endereco: "Residência — Florianópolis",   modulos: 6,  bruto: 180, repasse: 153 },
    { id: 13, data: "13/02/2026", endereco: "Sítio — Jaraguá do Sul",       modulos: 48, bruto: 520, repasse: 442 },
    { id: 14, data: "10/02/2026", endereco: "Residência — Pomerode",        modulos: 15, bruto: 300, repasse: 255 },
  ],

  // Próximos chamados agendados
  proximosChamados: [
    { id: "cham-001", cidade: "Jaraguá do Sul, SC", data: "30/03", hora: "08:00", modulos: 24, valorServico: 300, repasse: 255 },
    { id: "cham-002", cidade: "Pomerode, SC",       data: "31/03", hora: "08:00", modulos: 48, valorServico: 520, repasse: 442, urgente: true },
    { id: "cham-003", cidade: "Jaraguá do Sul, SC", data: "01/04", hora: "13:00", modulos: 8,  valorServico: 180, repasse: 153 },
  ],

  // Desempenho
  performance: [
    { label: "Pontualidade",   pct: 92, meta: 90 },
    { label: "Qualidade",      pct: 96, meta: 90 },
    { label: "Velocidade",     pct: 78, meta: 80 },
    { label: "Volume",         pct: 65, meta: 100 },
    { label: "Taxa de aceite", pct: 85, meta: 80 },
  ],
};

// ── Admin ─────────────────────────────────────────────────────────────────

export const MOCK_ADMIN = {
  // KPIs
  receitaMes: 1647,         // 15% de R$ 10.980
  totalServicos: 38,
  tecnicosAtivos: 9,
  clientesCadastrados: 75,
  clientesNovosMes: 12,
  satisfacaoMedia: 4.7,
  tendencia: { receita: 18, servicos: 6 }, // % e qty vs mês anterior

  // Receita semanal — últimas 8 semanas (AdminReceitaChart)
  receitaSemanal: [
    { label: "10/02", valor: 405 },
    { label: "17/02", valor: 540 },
    { label: "24/02", valor: 378 },
    { label: "03/03", valor: 621 },
    { label: "10/03", valor: 486 },
    { label: "17/03", valor: 567 },
    { label: "24/03", valor: 702 },
    { label: "31/03", valor: 648 },
  ],

  // Por cidade
  porCidade: [
    { nome: "Jaraguá do Sul", servicos: 18, receita: 4860, ticket: 270, tecnicos: 4, clientes: 32, destaque: true  },
    { nome: "Florianópolis",  servicos: 12, receita: 4200, ticket: 350, tecnicos: 3, clientes: 28, destaque: false },
    { nome: "Pomerode",       servicos: 8,  receita: 1920, ticket: 240, tecnicos: 2, clientes: 15, destaque: false },
  ],

  // Últimos serviços
  ultimosServicos: [
    { id: 1,  data: "28/03", cidade: "Jaraguá do Sul", cliente: "João",    tecnico: "Carlos",  modulos: 22, valor: 300, comissao: 45,  status: "concluido",   nota: 5.0  },
    { id: 2,  data: "27/03", cidade: "Pomerode",       cliente: "Empresa", tecnico: "Marcos",  modulos: 48, valor: 520, comissao: 78,  status: "concluido",   nota: 4.5  },
    { id: 3,  data: "27/03", cidade: "Florianópolis",  cliente: "Maria",   tecnico: "Rafael",  modulos: 8,  valor: 180, comissao: 27,  status: "concluido",   nota: 5.0  },
    { id: 4,  data: "26/03", cidade: "Jaraguá do Sul", cliente: "Fazenda", tecnico: "Luiz",    modulos: 52, valor: 520, comissao: 78,  status: "andamento",   nota: null },
    { id: 5,  data: "25/03", cidade: "Pomerode",       cliente: "Ana",     tecnico: "Marcos",  modulos: 15, valor: 300, comissao: 45,  status: "concluido",   nota: 4.8  },
    { id: 6,  data: "24/03", cidade: "Florianópolis",  cliente: "Roberto", tecnico: "Rafael",  modulos: 35, valor: 520, comissao: 78,  status: "concluido",   nota: 5.0  },
    { id: 7,  data: "22/03", cidade: "Jaraguá do Sul", cliente: "Cláudia", tecnico: "Carlos",  modulos: 10, valor: 180, comissao: 27,  status: "agendado",    nota: null },
    { id: 8,  data: "21/03", cidade: "Pomerode",       cliente: "Pedro",   tecnico: "Marcos",  modulos: 28, valor: 300, comissao: 45,  status: "concluido",   nota: 5.0  },
    { id: 9,  data: "20/03", cidade: "Florianópolis",  cliente: "Usina",   tecnico: "Rafael",  modulos: 80, valor: 0,   comissao: 0,   status: "cancelado",   nota: null },
    { id: 10, data: "18/03", cidade: "Jaraguá do Sul", cliente: "Sônia",   tecnico: "Luiz",    modulos: 18, valor: 300, comissao: 45,  status: "concluido",   nota: 4.5  },
  ],
};
