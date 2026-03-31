import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AdminReceitaChart from "@/components/admin/AdminReceitaChart";
import AdminDonut from "@/components/admin/AdminDonut";
import AdminTecnicosAba from "@/components/admin/AdminTecnicosAba";
import { MOCK_ADMIN } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/server";
import type { ServiceRequestDB } from "@/lib/types";

export const metadata: Metadata = { title: "Painel Admin | Painel Clean" };

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const STATIC_ALERTAS = [
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

export default async function AdminDashboardPage() {
  const mesAtual = new Date().toLocaleString("pt-BR", { month: "long" });
  const anoAtual = new Date().getFullYear();

  // ── Try real Supabase data; fall back to mock if table not ready ──────
  let realServices: ServiceRequestDB[] = [];
  let awaitingPaymentCount = 0;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("service_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (data && data.length > 0) {
      realServices = data as ServiceRequestDB[];
      awaitingPaymentCount = realServices.filter(
        (s) => s.payment_status === "awaiting_confirmation"
      ).length;
    }
  } catch { /* table not yet created — use mock */ }

  const hasReal = realServices.length > 0;

  // Derived real metrics
  const realCompleted  = realServices.filter((s) => s.status === "completed");
  const realReceita    = realCompleted.reduce((a, s) => a + s.price_estimate * 0.15, 0);
  const realTotal      = realServices.length;
  const realCities     = Array.from(new Set(realServices.map((s) => s.city)));

  // KPIs: prefer real data, fall back to mock
  const kpis = [
    {
      emoji: "💰",
      label: "Receita do mês",
      value: fmt(hasReal ? realReceita : MOCK_ADMIN.receitaMes),
      trend: `+${MOCK_ADMIN.tendencia.receita}%`,
      up: true,
      sub: hasReal ? "dados reais · comissão 15%" : "vs mês anterior · comissão 15%",
    },
    {
      emoji: "📋",
      label: "Serviços concluídos",
      value: String(hasReal ? realCompleted.length : MOCK_ADMIN.totalServicos),
      trend: `+${MOCK_ADMIN.tendencia.servicos}`,
      up: true,
      sub: hasReal ? "dados reais" : "vs mês anterior",
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

  // Recent services table: prefer real, fall back to mock shape
  const ultimosServicos = hasReal
    ? realServices.slice(0, 10).map((s) => ({
        id:       s.id,
        data:     new Date(s.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
        cidade:   s.city,
        cliente:  s.client_id.slice(0, 8),
        tecnico:  s.technician_id ? s.technician_id.slice(0, 8) : "—",
        modulos:  s.module_count,
        valor:    s.status === "completed" ? s.price_estimate : 0,
        comissao: s.status === "completed" ? s.price_estimate * 0.15 : 0,
        status:   s.status === "completed" ? "concluido"
                : s.status === "in_progress" ? "andamento"
                : s.status === "accepted"    ? "agendado"
                : s.status === "cancelled"   ? "cancelado"
                : "agendado",
        nota:     null as number | null,
      }))
    : MOCK_ADMIN.ultimosServicos;

  const cidades    = MOCK_ADMIN.porCidade;
  const maxServicos = Math.max(...cidades.map((c) => c.servicos));

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
        {hasReal ? (
          <span className="inline-block mt-1 text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
            ✅ Dados reais ({realTotal} serviços no banco)
          </span>
        ) : (
          <span className="inline-block mt-1 text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
            📊 Dados demonstrativos (tabela ainda não criada)
          </span>
        )}
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
          {/* Dynamic payment alert */}
          {awaitingPaymentCount > 0 && (
            <Link
              href="/admin/pagamentos"
              className="flex items-center gap-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2 hover:shadow-sm transition-shadow"
            >
              <span>💰</span>
              <span>
                {awaitingPaymentCount} pagamento{awaitingPaymentCount > 1 ? "s" : ""} aguardando confirmação — clientes esperando
              </span>
              <ArrowRight size={12} className="opacity-50 ml-auto" />
            </Link>
          )}
          {STATIC_ALERTAS.map(({ icon, texto, href, cor }) => (
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

      {/* ── Seção 0b: Bypass Alerts ── */}
      <div className="rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 space-y-3">
        <p className="text-xs font-bold text-amber-700 uppercase tracking-widest">
          🔍 Alertas de possível bypass
        </p>
        <div className="space-y-2">
          {[
            { msg: "Cliente Ana Silva fez 2 serviços com Carlos S. e não solicitou mais há 60 dias", href: "#" },
            { msg: "Técnico Pedro M. teve 3 cancelamentos nos últimos 30 dias", href: "#" },
            { msg: "Cliente Fazenda Verde estava ativo semanalmente e ficou inativo há 45 dias", href: "#" },
          ].map(({ msg, href }) => (
            <a
              key={msg}
              href={href}
              className="flex items-start gap-2.5 bg-white border border-amber-200 rounded-xl px-4 py-3 hover:shadow-sm transition-shadow"
            >
              <span className="text-amber-500 text-sm mt-0.5 flex-shrink-0">⚠️</span>
              <p className="text-sm font-medium text-amber-800 leading-snug">{msg}</p>
            </a>
          ))}
        </div>
        <p className="text-[10px] text-amber-600">
          Dados demonstrativos — quando o banco tiver histórico real, estas análises serão calculadas automaticamente.
        </p>
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

      {/* ── Seção 5b: Métricas de precificação ── */}
      <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-sm space-y-5">
        <h2 className="font-heading font-bold text-brand-dark text-base">
          📊 Métricas de precificação
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Ticket médio",           value: fmt(347),  sub: "últimos 30 dias",        color: "text-brand-dark"   },
            { label: "% aceitas na faixa",     value: "87%",     sub: "dentro de preco_min/max", color: "text-emerald-600" },
            { label: "Tempo médio aceitação",  value: "1h 24m",  sub: "do pagamento ao técnico", color: "text-brand-dark"   },
            { label: "% fora da faixa",        value: "13%",     sub: "com justificativa",       color: "text-orange-500"  },
          ].map(({ label, value, sub, color }) => (
            <div key={label} className="bg-brand-bg rounded-2xl p-4 space-y-1">
              <p className={`font-heading font-bold text-2xl ${color}`}>{value}</p>
              <p className="text-xs font-semibold text-brand-dark leading-tight">{label}</p>
              <p className="text-[10px] text-brand-muted">{sub}</p>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-brand-muted">
          * Dados demonstrativos — calculados automaticamente quando houver histórico real no banco.
        </p>
      </div>

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
                {["Data", "Cidade", "Cliente", "Técnico", "Placas", "Valor", "Comissão", "Status", "Nota"].map(
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
                📍 {s.cidade} · {s.data} · ☀️ {s.modulos} placas
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
