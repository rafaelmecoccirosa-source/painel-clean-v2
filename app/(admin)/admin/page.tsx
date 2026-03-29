import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AdminReceitaChart from "@/components/admin/AdminReceitaChart";
import AdminDonut from "@/components/admin/AdminDonut";
import AdminTecnicosAba from "@/components/admin/AdminTecnicosAba";
import { MOCK_ADMIN } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Painel Admin | Painel Clean" };

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ── Derived from centralized mock data ────────────────────────────────────

const kpis = [
  {
    emoji: "💰",
    label: "Receita do mês",
    value: fmt(MOCK_ADMIN.receitaMes),
    trend: `+${MOCK_ADMIN.tendencia.receita}%`,
    up: true,
    sub: "vs mês anterior · comissão 15%",
  },
  {
    emoji: "📋",
    label: "Serviços concluídos",
    value: String(MOCK_ADMIN.totalServicos),
    trend: `+${MOCK_ADMIN.tendencia.servicos}`,
    up: true,
    sub: "vs mês anterior",
  },
  {
    emoji: "👥",
    label: "Técnicos ativos",
    value: String(MOCK_ADMIN.tecnicosAtivos),
    trend: null,
    up: true,
    sub: "≥1 serviço em 30 dias",
  },
  {
    emoji: "👤",
    label: "Clientes cadastrados",
    value: String(MOCK_ADMIN.clientesCadastrados),
    trend: `+${MOCK_ADMIN.clientesNovosMes}`,
    up: true,
    sub: "novos este mês",
  },
  {
    emoji: "⭐",
    label: "Satisfação média",
    value: MOCK_ADMIN.satisfacaoMedia.toFixed(2),
    trend: null,
    up: true,
    sub: "últimos 30 dias",
  },
];

const alertas = [
  {
    icon: "🔔",
    texto: "2 técnicos aguardando aprovação",
    href: "#tecnicos",
    cor: "text-yellow-700",
  },
  {
    icon: "⚠️",
    texto: "Florianópolis sem técnico online agora",
    href: "#cidades",
    cor: "text-orange-700",
  },
  {
    icon: "📈",
    texto: "Receita 15% acima da meta esta semana",
    href: "#receita",
    cor: "text-emerald-700",
  },
];

const cidades = MOCK_ADMIN.porCidade;
const maxServicos = Math.max(...cidades.map((c) => c.servicos));
const ultimosServicos = MOCK_ADMIN.ultimosServicos;

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    concluido:  { label: "✅ Concluído",     cls: "bg-emerald-100 text-emerald-700" },
    andamento:  { label: "🔄 Em andamento",  cls: "bg-blue-100 text-blue-700"       },
    agendado:   { label: "📅 Agendado",      cls: "bg-indigo-100 text-indigo-700"   },
    cancelado:  { label: "❌ Cancelado",     cls: "bg-red-100 text-red-600"         },
  };
  const s = map[status] ?? { label: status, cls: "bg-gray-100 text-gray-600" };
  return (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${s.cls}`}>
      {s.label}
    </span>
  );
}

export default function AdminDashboardPage() {
  const mesAtual = new Date().toLocaleString("pt-BR", { month: "long" });
  const anoAtual = new Date().getFullYear();

  return (
    <div className="page-container space-y-6">

      {/* ── Header ── */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-brand-dark">
          🛠️ Painel Administrativo
        </h1>
        <p className="text-brand-muted text-sm mt-1">
          Painel Clean · visão geral da plataforma — {mesAtual} {anoAtual}
        </p>
      </div>

      {/* ── Seção 7: Alertas ── */}
      <div
        id="alertas"
        className="rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 space-y-2"
      >
        <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-3">
          🔔 Alertas
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap">
          {alertas.map(({ icon, texto, href, cor }) => (
            <a
              key={texto}
              href={href}
              className={`flex items-center gap-2 text-sm font-medium ${cor} bg-white border border-amber-200 rounded-xl px-3 py-2 hover:shadow-sm transition-shadow`}
            >
              <span>{icon}</span>
              <span>{texto}</span>
              <ArrowRight size={12} className="opacity-50 ml-auto" />
            </a>
          ))}
        </div>
      </div>

      {/* ── Seção 1: KPIs ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpis.map(({ emoji, label, value, trend, up, sub }) => (
          <div
            key={label}
            className="bg-white border border-brand-border rounded-2xl p-4 flex flex-col gap-2 shadow-sm"
          >
            <span className="text-2xl leading-none">{emoji}</span>
            <div className="mt-1">
              <p className="font-heading text-[22px] font-bold text-brand-dark leading-tight">
                {value}
              </p>
              <p className="text-xs text-brand-muted mt-0.5">{label}</p>
            </div>
            {trend ? (
              <div className="flex items-center gap-1 flex-wrap">
                <span
                  className={`text-[11px] font-bold ${up ? "text-emerald-600" : "text-red-500"}`}
                >
                  {up ? "↑" : "↓"} {trend}
                </span>
                <span className="text-[10px] text-brand-muted">{sub}</span>
              </div>
            ) : (
              <p className="text-[10px] text-brand-muted">{sub}</p>
            )}
          </div>
        ))}
      </div>

      {/* ── Seção 2: Gráfico de receita ── */}
      <div id="receita">
        <AdminReceitaChart />
      </div>

      {/* ── Seção 3: Métricas por cidade ── */}
      <div id="cidades">
        <h2 className="font-heading font-bold text-brand-dark text-base mb-4">
          🗺️ Métricas por cidade
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cidades.map((c) => {
            const barPct = Math.round((c.servicos / maxServicos) * 100);
            return (
              <div
                key={c.nome}
                className={`bg-white rounded-2xl p-5 shadow-sm space-y-4 border-2 ${
                  c.destaque ? "border-brand-green" : "border-brand-border"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-heading font-bold text-brand-dark text-sm">
                    📍 {c.nome}
                  </p>
                  {c.destaque && (
                    <span className="text-[10px] bg-brand-green text-white font-bold px-2 py-0.5 rounded-full">
                      Líder
                    </span>
                  )}
                </div>

                {/* Progress bar for serviços */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-brand-muted">Serviços</span>
                    <span className="text-xs font-bold text-brand-dark">{c.servicos}</span>
                  </div>
                  <div className="h-2 bg-brand-light rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-green rounded-full"
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
                </div>

                {/* 2x2 metrics grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-brand-bg rounded-xl p-2.5">
                    <p className="text-[10px] text-brand-muted">Receita total</p>
                    <p className="font-heading font-bold text-brand-dark text-sm mt-0.5">
                      {fmt(c.receita)}
                    </p>
                  </div>
                  <div className="bg-brand-bg rounded-xl p-2.5">
                    <p className="text-[10px] text-brand-muted">Ticket médio</p>
                    <p className="font-heading font-bold text-brand-dark text-sm mt-0.5">
                      {fmt(c.ticket)}
                    </p>
                  </div>
                  <div className="bg-brand-bg rounded-xl p-2.5">
                    <p className="text-[10px] text-brand-muted">Técnicos ativos</p>
                    <p className="font-heading font-bold text-brand-green text-sm mt-0.5">
                      {c.tecnicos}
                    </p>
                  </div>
                  <div className="bg-brand-bg rounded-xl p-2.5">
                    <p className="text-[10px] text-brand-muted">Clientes</p>
                    <p className="font-heading font-bold text-brand-dark text-sm mt-0.5">
                      {c.clientes}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Seção 4: Donut distribuição por faixa ── */}
      <AdminDonut />

      {/* ── Seção 6: Últimos serviços ── */}
      <div className="card !p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-brand-border flex items-center justify-between flex-wrap gap-2">
          <h2 className="font-heading font-bold text-brand-dark text-base">
            🕐 Últimos serviços
          </h2>
          <div className="flex items-center gap-3">
            <button className="text-xs text-brand-muted hover:text-brand-dark flex items-center gap-1 transition-colors">
              Exportar CSV <ArrowRight size={11} />
            </button>
            <Link
              href="/admin/servicos"
              className="text-xs text-brand-green font-semibold hover:underline flex items-center gap-1"
            >
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-brand-bg">
              <tr>
                {["Data", "Cidade", "Cliente", "Técnico", "Módulos", "Valor", "Comissão", "Status", "Nota"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 font-semibold text-brand-muted uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {ultimosServicos.map((s) => (
                <tr key={s.id} className="hover:bg-brand-bg/50 transition-colors">
                  <td className="px-4 py-3 text-brand-muted">{s.data}</td>
                  <td className="px-4 py-3 text-brand-dark font-medium">📍 {s.cidade}</td>
                  <td className="px-4 py-3 text-brand-dark">{s.cliente}</td>
                  <td className="px-4 py-3 text-brand-dark">{s.tecnico}</td>
                  <td className="px-4 py-3 text-brand-muted text-center">{s.modulos}</td>
                  <td className="px-4 py-3 font-semibold text-brand-dark">
                    {s.valor > 0 ? fmt(s.valor) : "—"}
                  </td>
                  <td className="px-4 py-3 font-semibold text-brand-green">
                    {s.comissao > 0 ? fmt(s.comissao) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="px-4 py-3 text-amber-500 font-bold">
                    {s.nota !== null ? `⭐ ${s.nota.toFixed(1)}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-brand-border">
          {ultimosServicos.map((s) => (
            <div key={s.id} className="px-4 py-3 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-brand-dark text-sm">
                  {s.cliente} → {s.tecnico}
                </p>
                <StatusBadge status={s.status} />
              </div>
              <p className="text-xs text-brand-muted">
                📍 {s.cidade} · {s.data} · ☀️ {s.modulos} módulos
              </p>
              <div className="flex items-center gap-3 text-xs">
                <span className="font-bold text-brand-dark">
                  {s.valor > 0 ? fmt(s.valor) : "—"}
                </span>
                <span className="text-brand-green font-semibold">
                  comissão: {s.comissao > 0 ? fmt(s.comissao) : "—"}
                </span>
                {s.nota !== null && (
                  <span className="text-amber-500 font-bold">⭐ {s.nota.toFixed(1)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Seção 5: Aprovação de técnicos ── */}
      <div id="tecnicos">
        <AdminTecnicosAba />
      </div>

    </div>
  );
}
