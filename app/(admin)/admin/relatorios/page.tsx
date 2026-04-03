"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// ── Mock data (consistent with lib/mock-data.ts) ─────────────────────────

const RECEITA_DIARIA = [
  { dia: "01/03", valor: 45  }, { dia: "02/03", valor: 0   }, { dia: "03/03", valor: 90  },
  { dia: "04/03", valor: 45  }, { dia: "05/03", valor: 135 }, { dia: "06/03", valor: 45  },
  { dia: "07/03", valor: 0   }, { dia: "08/03", valor: 45  }, { dia: "09/03", valor: 78  },
  { dia: "10/03", valor: 78  }, { dia: "11/03", valor: 45  }, { dia: "12/03", valor: 27  },
  { dia: "13/03", valor: 45  }, { dia: "14/03", valor: 132 }, { dia: "15/03", valor: 45  },
  { dia: "16/03", valor: 45  }, { dia: "17/03", valor: 0   }, { dia: "18/03", valor: 45  },
  { dia: "19/03", valor: 78  }, { dia: "20/03", valor: 0   }, { dia: "21/03", valor: 45  },
  { dia: "22/03", valor: 27  }, { dia: "23/03", valor: 45  }, { dia: "24/03", valor: 78  },
  { dia: "25/03", valor: 45  }, { dia: "26/03", valor: 78  }, { dia: "27/03", valor: 123 },
  { dia: "28/03", valor: 45  }, { dia: "29/03", valor: 0   }, { dia: "30/03", valor: 45  },
];

const SERVICOS_SEMANA = [
  { sem: "Sem 1", qtd: 7 },
  { sem: "Sem 2", qtd: 9 },
  { sem: "Sem 3", qtd: 11 },
  { sem: "Sem 4", qtd: 11 },
];

const FAIXAS_MODULOS = [
  { label: "Até 10",  pct: 28, cor: "#3DC45A" },
  { label: "11–30",   pct: 45, cor: "#1B3A2D" },
  { label: "31–60",   pct: 20, cor: "#7A9A84" },
  { label: "61+",     pct: 7,  cor: "#C8DFC0" },
];

const STATUS_SERVICOS = [
  { label: "Concluídos",   pct: 84, cor: "#3DC45A" },
  { label: "Cancelados",   pct: 10, cor: "#EF4444" },
  { label: "Em andamento", pct: 6,  cor: "#3B82F6" },
];

const RANKING_NOTA = [
  { nome: "Carlos Souza",   nota: 4.9, servicos: 22 },
  { nome: "Pedro Santos",   nota: 4.7, servicos: 15 },
  { nome: "Roberto Lima",   nota: 4.5, servicos: 8  },
  { nome: "Lucas Martins",  nota: 0,   servicos: 0  },
  { nome: "Diego Ferreira", nota: 0,   servicos: 0  },
];

const CADASTROS_SEMANA = [
  { sem: "Sem 1 Jan", qtd: 4 },
  { sem: "Sem 2 Jan", qtd: 6 },
  { sem: "Sem 3 Jan", qtd: 3 },
  { sem: "Sem 4 Jan", qtd: 5 },
  { sem: "Sem 1 Fev", qtd: 8 },
  { sem: "Sem 2 Fev", qtd: 7 },
  { sem: "Sem 3 Fev", qtd: 6 },
  { sem: "Sem 4 Fev", qtd: 9 },
  { sem: "Sem 1 Mar", qtd: 11 },
  { sem: "Sem 2 Mar", qtd: 8 },
  { sem: "Sem 3 Mar", qtd: 12 },
];

const CIDADES_CLIENTES = [
  { cidade: "Jaraguá do Sul", qtd: 32 },
  { cidade: "Florianópolis",  qtd: 28 },
  { cidade: "Pomerode",       qtd: 15 },
];

// ── Helpers ───────────────────────────────────────────────────────────────

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ── Line chart (SVG) ──────────────────────────────────────────────────────

function LineChart({ data, height = 120 }: { data: { dia: string; valor: number }[]; height?: number }) {
  const W = 600;
  const H = height;
  const PAD = { t: 10, r: 10, b: 24, l: 10 };
  const max = Math.max(...data.map((d) => d.valor), 1);
  const pts = data.map((d, i) => {
    const x = PAD.l + (i / (data.length - 1)) * (W - PAD.l - PAD.r);
    const y = PAD.t + (1 - d.valor / max) * (H - PAD.t - PAD.b);
    return { x, y, ...d };
  });
  const polyline = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const area = [
    `${pts[0].x},${H - PAD.b}`,
    ...pts.map((p) => `${p.x},${p.y}`),
    `${pts[pts.length - 1].x},${H - PAD.b}`,
  ].join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3DC45A" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#3DC45A" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#areaGrad)" />
      <polyline points={polyline} fill="none" stroke="#3DC45A" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {pts.filter((_, i) => i % 4 === 0).map((p) => (
        <text key={p.dia} x={p.x} y={H - 4} textAnchor="middle" fontSize="8" fill="#7A9A84">{p.dia.slice(0, 5)}</text>
      ))}
    </svg>
  );
}

// ── Bar chart (SVG) ───────────────────────────────────────────────────────

function BarChart({ data, color = "#3DC45A" }: { data: { sem: string; qtd: number }[]; color?: string }) {
  const max = Math.max(...data.map((d) => d.qtd), 1);
  return (
    <div className="flex items-end gap-2" style={{ height: 100 }}>
      {data.map((d) => {
        const pct = Math.max(Math.round((d.qtd / max) * 100), 4);
        return (
          <div key={d.sem} className="flex-1 flex flex-col items-center gap-1" style={{ height: "100%" }}>
            <span className="text-[10px] font-bold text-brand-dark">{d.qtd}</span>
            <div className="w-full flex items-end flex-1">
              <div className="w-full rounded-t-lg" style={{ height: `${pct}%`, backgroundColor: color }} />
            </div>
            <span className="text-[9px] text-brand-muted text-center leading-tight">{d.sem}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Donut chart (SVG) ─────────────────────────────────────────────────────

function DonutChart({ slices }: { slices: { label: string; pct: number; cor: string }[] }) {
  const R = 40;
  const CX = 60;
  const CY = 60;
  let cumulative = 0;
  const segments = slices.map((s) => {
    const startAngle = (cumulative / 100) * 2 * Math.PI - Math.PI / 2;
    cumulative += s.pct;
    const endAngle = (cumulative / 100) * 2 * Math.PI - Math.PI / 2;
    const x1 = CX + R * Math.cos(startAngle);
    const y1 = CY + R * Math.sin(startAngle);
    const x2 = CX + R * Math.cos(endAngle);
    const y2 = CY + R * Math.sin(endAngle);
    const largeArc = s.pct > 50 ? 1 : 0;
    return { ...s, d: `M ${CX} ${CY} L ${x1} ${y1} A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2} Z` };
  });

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 120 120" className="w-24 h-24 flex-shrink-0">
        {segments.map((s) => (
          <path key={s.label} d={s.d} fill={s.cor} />
        ))}
        <circle cx={CX} cy={CY} r={R * 0.55} fill="white" />
      </svg>
      <div className="space-y-2">
        {slices.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: s.cor }} />
            <span className="text-brand-dark font-medium">{s.label}</span>
            <span className="text-brand-muted font-bold">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Horizontal bar ────────────────────────────────────────────────────────

function HBar({ label, value, max, suffix = "", color = "#3DC45A" }: {
  label: string; value: number; max: number; suffix?: string; color?: string;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-brand-dark font-medium">{label}</span>
        <span className="text-brand-muted font-bold">{value}{suffix}</span>
      </div>
      <div className="h-2 bg-brand-bg rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

const PERIODOS = ["Últimos 7 dias", "Últimos 30 dias", "Últimos 3 meses", "Customizado"];
const CIDADES_FILTRO = ["Todas", "Jaraguá do Sul", "Pomerode", "Florianópolis"];

export default function RelatoriosPage() {
  const [periodo, setPeriodo] = useState("Últimos 30 dias");
  const [cidade, setCidade] = useState("Todas");

  const totalReceita = RECEITA_DIARIA.reduce((a, d) => a + d.valor, 0);
  const receitaAnterior = Math.round(totalReceita * 0.82);
  const variacaoPct = Math.round(((totalReceita - receitaAnterior) / receitaAnterior) * 100);

  return (
    <div className="page-container space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-brand-muted hover:text-brand-dark transition-colors" aria-label="Voltar">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-heading text-2xl font-bold text-brand-dark">📈 Relatórios</h1>
            <p className="text-brand-muted text-sm mt-0.5">Métricas e desempenho da plataforma</p>
          </div>
        </div>
        <div className="relative group">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-border text-sm font-semibold text-brand-muted bg-white cursor-not-allowed opacity-60">
            📄 Exportar PDF
          </button>
          <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-brand-dark text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap z-10 shadow-lg">
            Em breve
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-brand-border text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-green/30 bg-white"
          >
            {PERIODOS.map((p) => <option key={p}>{p}</option>)}
          </select>
          <select
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-brand-border text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-green/30 bg-white"
          >
            {CIDADES_FILTRO.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* ── Relatório 1: Receita ─────────────────────────────────────────── */}
      <div className="card space-y-4">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <h2 className="font-heading font-bold text-brand-dark text-base">💰 Receita da Plataforma</h2>
            <p className="text-brand-muted text-xs mt-0.5">Comissão 25% — receita diária no período</p>
          </div>
          <div className="text-right">
            <p className="font-heading font-bold text-brand-dark text-xl">{fmt(totalReceita)}</p>
            <p className="text-xs text-emerald-600 font-semibold">↑ +{variacaoPct}% vs período anterior</p>
          </div>
        </div>
        <LineChart data={RECEITA_DIARIA} height={130} />
        <div className="flex gap-6 pt-2 border-t border-brand-border text-xs text-brand-muted">
          <span>Período anterior: <strong className="text-brand-dark">{fmt(receitaAnterior)}</strong></span>
          <span>Média/dia: <strong className="text-brand-dark">{fmt(Math.round(totalReceita / 30))}</strong></span>
          <span>Melhor dia: <strong className="text-brand-dark">14/03 — {fmt(132)}</strong></span>
        </div>
      </div>

      {/* ── Relatório 2: Serviços ────────────────────────────────────────── */}
      <div className="card space-y-6">
        <div>
          <h2 className="font-heading font-bold text-brand-dark text-base">📋 Serviços</h2>
          <p className="text-brand-muted text-xs mt-0.5">Volume, faixas e taxas de conclusão</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Barras por semana */}
          <div>
            <p className="text-xs font-semibold text-brand-muted mb-3 uppercase tracking-wide">Por semana</p>
            <BarChart data={SERVICOS_SEMANA} color="#3DC45A" />
          </div>

          {/* Donut faixas */}
          <div>
            <p className="text-xs font-semibold text-brand-muted mb-3 uppercase tracking-wide">Faixas de placas</p>
            <DonutChart slices={FAIXAS_MODULOS} />
          </div>

          {/* Taxa de conclusão */}
          <div>
            <p className="text-xs font-semibold text-brand-muted mb-3 uppercase tracking-wide">Taxa de conclusão</p>
            <div className="space-y-3">
              {STATUS_SERVICOS.map((s) => (
                <HBar key={s.label} label={s.label} value={s.pct} max={100} suffix="%" color={s.cor} />
              ))}
            </div>
            <div className="mt-4 p-3 bg-brand-bg rounded-xl text-center">
              <p className="text-2xl font-heading font-bold text-brand-green">84%</p>
              <p className="text-xs text-brand-muted">taxa de conclusão geral</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Relatório 3: Técnicos ────────────────────────────────────────── */}
      <div className="card space-y-6" style={{ backgroundColor: "#F4F8F2" }}>
        <div>
          <h2 className="font-heading font-bold text-brand-dark text-base">🔧 Técnicos</h2>
          <p className="text-brand-muted text-xs mt-0.5">Rankings e desempenho operacional</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Ranking por nota */}
          <div className="bg-white rounded-2xl p-4 border border-brand-border">
            <p className="text-xs font-semibold text-brand-muted mb-4 uppercase tracking-wide">Top 5 — Nota média</p>
            <div className="space-y-3">
              {RANKING_NOTA.map((t, i) => (
                <div key={t.nome} className="flex items-center gap-3">
                  <span className="w-5 text-xs font-bold text-brand-muted text-center">{i + 1}</span>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-brand-dark font-medium">{t.nome}</span>
                      <span className="text-amber-500 font-bold">
                        {t.nota > 0 ? `⭐ ${t.nota.toFixed(1)}` : "—"}
                      </span>
                    </div>
                    <div className="h-1.5 bg-brand-bg rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-amber-400" style={{ width: `${(t.nota / 5) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ranking por volume */}
          <div className="bg-white rounded-2xl p-4 border border-brand-border">
            <p className="text-xs font-semibold text-brand-muted mb-4 uppercase tracking-wide">Top 5 — Volume de serviços</p>
            <div className="space-y-3">
              {[...RANKING_NOTA].sort((a, b) => b.servicos - a.servicos).map((t, i) => (
                <div key={t.nome} className="flex items-center gap-3">
                  <span className="w-5 text-xs font-bold text-brand-muted text-center">{i + 1}</span>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-brand-dark font-medium">{t.nome}</span>
                      <span className="text-brand-green font-bold">{t.servicos} serv.</span>
                    </div>
                    <div className="h-1.5 bg-brand-bg rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-brand-green"
                        style={{ width: `${(t.servicos / 22) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KPIs operacionais */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { emoji: "⏱️", label: "Tempo médio de resposta", value: "8 min" },
            { emoji: "✅", label: "Taxa de aceite média",     value: "85%" },
            { emoji: "⭐", label: "Nota média geral",         value: "4.7" },
            { emoji: "🔧", label: "Técnicos aprovados",       value: "3" },
          ].map(({ emoji, label, value }) => (
            <div key={label} className="bg-white border border-brand-border rounded-xl p-3 text-center">
              <span className="text-xl">{emoji}</span>
              <p className="font-heading font-bold text-brand-dark text-lg mt-1">{value}</p>
              <p className="text-[10px] text-brand-muted mt-0.5 leading-tight">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Relatório 4: Clientes ────────────────────────────────────────── */}
      <div className="card space-y-6">
        <div>
          <h2 className="font-heading font-bold text-brand-dark text-base">👤 Clientes</h2>
          <p className="text-brand-muted text-xs mt-0.5">Crescimento da base e fidelização</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Novos cadastros por semana */}
          <div>
            <p className="text-xs font-semibold text-brand-muted mb-3 uppercase tracking-wide">Novos cadastros por semana</p>
            <BarChart data={CADASTROS_SEMANA} color="#1B3A2D" />
          </div>

          {/* Cidades + recompra */}
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-brand-muted mb-3 uppercase tracking-wide">Clientes por cidade</p>
              <div className="space-y-2">
                {CIDADES_CLIENTES.map((c) => (
                  <HBar key={c.cidade} label={c.cidade} value={c.qtd} max={75} color="#3DC45A" />
                ))}
              </div>
            </div>

            <div className="p-4 bg-brand-bg rounded-2xl border border-brand-border">
              <p className="text-xs font-semibold text-brand-muted uppercase tracking-wide mb-2">Taxa de recompra</p>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-2xl font-heading font-bold text-brand-green">38%</p>
                  <p className="text-[10px] text-brand-muted">clientes com 2+ serviços</p>
                </div>
                <div className="flex-1 h-2 bg-white rounded-full overflow-hidden border border-brand-border">
                  <div className="h-full rounded-full bg-brand-green" style={{ width: "38%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
