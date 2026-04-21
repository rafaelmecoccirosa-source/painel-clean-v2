export type HeroState = 'healthy' | 'post_cleaning' | 'soon' | 'drop' | 'report';

export const MOCK_CLIENTE = {
  nome: 'Fernanda Alves',
  email: 'fernanda.alves@demo.painelclean.com.br',
  plano: 'Padrão',
  mensalidade: 44,
  mensalidadeOriginal: 50,
  modulos: 20,
  potencia: 11,
  inversor: 'Fronius Symo 10.0',
  cidade: 'Jaraguá do Sul',
  tecnico: 'Carlos Souza',
  proximaLimpeza: '2026-06-15',
  proximaLimpezaTurno: 'Turno da manhã',
  eficienciaAtual: 94,
  geracao: 438,
  geracaoMeta: 460,
  economiaAcumulada: 1248,
  limpezasUsadas: 1,
  limpezasTotal: 2,
  descontoIndicacao: 12,
  indicacoesAtivas: 2,
  assinaturaInicio: '2026-04-01',
  contratoFim: '2027-04-01',
  heroState: 'healthy' as HeroState,
} as const;

export type HistoricoRow = {
  id: string;
  tipo: 'assinatura' | 'avulso';
  titulo: string;
  data: string;
  tecnico: string;
  ganho: string;
  status: 'concluido';
};

export const MOCK_HISTORICO: HistoricoRow[] = [
  {
    id: 'srv-04',
    tipo: 'assinatura',
    titulo: 'Limpeza profissional · Assinatura Padrão',
    data: '2026-03-12',
    tecnico: 'Carlos Souza',
    ganho: '+11%',
    status: 'concluido',
  },
  {
    id: 'srv-03',
    tipo: 'assinatura',
    titulo: 'Limpeza profissional · Assinatura Padrão',
    data: '2025-09-10',
    tecnico: 'Carlos Souza',
    ganho: '+9%',
    status: 'concluido',
  },
  {
    id: 'srv-02',
    tipo: 'avulso',
    titulo: 'Limpeza avulsa · emergência granizo',
    data: '2025-06-22',
    tecnico: 'Lucas Martins',
    ganho: '+14%',
    status: 'concluido',
  },
  {
    id: 'srv-01',
    tipo: 'assinatura',
    titulo: 'Limpeza profissional · Assinatura Padrão',
    data: '2025-03-05',
    tecnico: 'Carlos Souza',
    ganho: '+8%',
    status: 'concluido',
  },
];

export type RelatorioMensal = {
  mes: string;
  kwh: number;
  eficiencia: number;
  status: 'novo' | 'lido';
};

export const MOCK_RELATORIOS: RelatorioMensal[] = [
  { mes: 'Março 2026', kwh: 438, eficiencia: 94, status: 'novo' },
  { mes: 'Fevereiro 2026', kwh: 412, eficiencia: 90, status: 'lido' },
  { mes: 'Janeiro 2026', kwh: 398, eficiencia: 87, status: 'lido' },
  { mes: 'Dezembro 2025', kwh: 356, eficiencia: 82, status: 'lido' },
];

export type Indicacao = {
  nome: string;
  status: 'ativo' | 'pendente';
  data: string;
  expira: string;
  desconto: string;
};

export const MOCK_INDICACOES: Indicacao[] = [
  { nome: 'João Pereira', status: 'ativo', data: '2026-03-15', expira: 'mar 2027', desconto: '6%' },
  { nome: 'Mariana Costa', status: 'ativo', data: '2026-02-02', expira: 'fev 2027', desconto: '6%' },
  { nome: 'Rafael Mendes', status: 'pendente', data: '2026-04-18', expira: '—', desconto: '—' },
];

export function initialsOf(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function formatDateBR(iso: string): string {
  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const d = new Date(iso + 'T00:00:00');
  const dow = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][d.getDay()];
  return `${dow}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function daysUntil(iso: string): number {
  const target = new Date(iso + 'T00:00:00').getTime();
  const now = Date.now();
  return Math.max(0, Math.ceil((target - now) / 86400000));
}
