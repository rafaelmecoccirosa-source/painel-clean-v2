import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import DisponibilidadeToggle from "@/components/tecnico/DisponibilidadeToggle";
import GanhosChart from "@/components/tecnico/GanhosChart";
import { MOCK_TECNICO } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Dashboard — Técnico | Painel Clean" };

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function TecnicoDashboardPage() {
  let userName = "Técnico";
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", user.id)
        .single();
      userName = profile?.full_name?.split(" ")[0] ?? user.email?.split("@")[0] ?? "Técnico";
    }
  } catch { /* fallback */ }

  const mesAtual = new Date().toLocaleString("pt-BR", { month: "long" });
  const mesCapitalized = mesAtual.charAt(0).toUpperCase() + mesAtual.slice(1);
  const anoAtual = new Date().getFullYear();

  const resumo = [
    {
      emoji: "💰",
      label: "Ganhos do mês",
      value: fmt(MOCK_TECNICO.ganhosMes),
      trend: `+${MOCK_TECNICO.tendencia.ganhos}%`,
      up: true,
      sub: "vs mês anterior",
    },
    {
      emoji: "📋",
      label: "Serviços realizados",
      value: String(MOCK_TECNICO.servicosMes),
      trend: `+${MOCK_TECNICO.tendencia.servicos}`,
      up: true,
      sub: "vs mês anterior",
    },
    {
      emoji: "⭐",
      label: "Avaliação média",
      value: MOCK_TECNICO.avaliacaoMedia.toFixed(1),
      trend: null,
      up: true,
      sub: "últimos 30 dias",
    },
    {
      emoji: "⏱️",
      label: "Tempo médio",
      value: `${MOCK_TECNICO.tempoMedio}h`,
      trend: null,
      up: true,
      sub: "por serviço",
    },
  ];

  const { performance, proximosChamados, ultimosServicos: historico } = MOCK_TECNICO;

  return (
    <div className="page-container space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-brand-dark">
            Olá, {userName}! 👋
          </h1>
          <p className="text-brand-muted text-sm mt-0.5">{mesCapitalized} {anoAtual} · veja seus números</p>
        </div>
        <DisponibilidadeToggle cidade="Jaraguá do Sul, SC" />
      </div>

      {/* ── Seção 1: Cards de resumo ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {resumo.map(({ emoji, label, value, trend, up, sub }) => (
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
              <div className="flex items-center gap-1">
                <span
                  className={`text-[11px] font-bold flex items-center gap-0.5 ${
                    up ? "text-emerald-600" : "text-red-500"
                  }`}
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

      {/* ── Seção 2: Gráfico de ganhos (client component com toggle) ── */}
      <GanhosChart />

      {/* ── Seção 3: Desempenho ── */}
      <div className="card">
        <h2 className="font-heading font-bold text-brand-dark text-base mb-5">
          🎯 Desempenho — métricas vs meta
        </h2>
        <div className="space-y-4">
          {performance.map(({ label, pct, meta }) => {
            const aboveMeta = pct >= meta;
            return (
              <div key={label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-brand-dark">{label}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold ${
                        aboveMeta ? "text-emerald-600" : "text-amber-500"
                      }`}
                    >
                      {pct}%
                    </span>
                    <span className="text-[10px] text-brand-muted">meta {meta}%</span>
                  </div>
                </div>
                <div className="h-2.5 bg-brand-light rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      aboveMeta ? "bg-brand-green" : "bg-amber-400"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-[10px] text-brand-muted mt-4">
          ✅ Acima da meta &nbsp;|&nbsp; ⚠️ Abaixo da meta
        </p>
      </div>

      {/* ── Seção 4: Próximos chamados ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-brand-dark text-base">
            📅 Próximos chamados
          </h2>
          <Link
            href="/tecnico/chamados"
            className="text-xs text-brand-green font-semibold hover:underline flex items-center gap-1"
          >
            Ver todos <ArrowRight size={12} />
          </Link>
        </div>

        {proximosChamados.length === 0 ? (
          <div className="card flex flex-col items-center py-10 text-center gap-3">
            <span className="text-4xl">📭</span>
            <p className="font-heading font-bold text-brand-dark text-sm">Nenhum chamado agendado</p>
            <p className="text-xs text-brand-muted max-w-xs">
              Fique online para receber novos chamados na sua região!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {proximosChamados.map((c) => (
              <div
                key={c.id}
                className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-heading font-bold text-brand-dark text-sm">
                      📍 {c.cidade}
                    </span>
                    {"urgente" in c && c.urgente && (
                      <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                        🚨 Urgente
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-brand-muted">
                    <span>📅 {c.data} · {c.hora}</span>
                    <span>🔋 {c.modulos} módulos</span>
                    <span>💰 {fmt(c.valorServico)} (repasse: <strong className="text-brand-green">{fmt(c.repasse)}</strong>)</span>
                  </div>
                </div>
                <Link
                  href={`/tecnico/chamados/${c.id}`}
                  className="flex-shrink-0 text-xs font-semibold text-brand-dark border border-brand-border rounded-xl px-4 py-2 hover:bg-brand-light transition-colors flex items-center gap-1"
                >
                  Ver detalhes <ArrowRight size={12} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Seção 5: Histórico rápido ── */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-brand-dark text-base">
            🕘 Últimos serviços
          </h2>
          <Link
            href="/tecnico/ganhos"
            className="text-xs text-brand-green font-semibold hover:underline flex items-center gap-1"
          >
            Ver histórico completo <ArrowRight size={12} />
          </Link>
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border">
                <th className="text-left text-xs font-semibold text-brand-muted pb-2">Data</th>
                <th className="text-left text-xs font-semibold text-brand-muted pb-2">Cidade</th>
                <th className="text-right text-xs font-semibold text-brand-muted pb-2">Módulos</th>
                <th className="text-right text-xs font-semibold text-brand-muted pb-2">Recebido</th>
                <th className="text-right text-xs font-semibold text-brand-muted pb-2">Nota</th>
              </tr>
            </thead>
            <tbody>
              {historico.map((h, i) => (
                <tr key={i} className="border-b border-brand-border/50 last:border-0">
                  <td className="py-2.5 text-brand-dark font-medium">{h.data}</td>
                  <td className="py-2.5 text-brand-dark">{h.cidade}</td>
                  <td className="py-2.5 text-right text-brand-muted">{h.modulos}</td>
                  <td className="py-2.5 text-right font-bold text-brand-green">{fmt(h.recebido)}</td>
                  <td className="py-2.5 text-right">
                    <span className="inline-flex items-center gap-0.5 text-xs font-bold text-amber-500">
                      ⭐ {h.nota.toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile list */}
        <div className="sm:hidden space-y-3">
          {historico.map((h, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2.5 border-b border-brand-border/50 last:border-0"
            >
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-brand-dark">{h.cidade}</p>
                <p className="text-[11px] text-brand-muted">
                  {h.data} · {h.modulos} módulos
                </p>
              </div>
              <div className="text-right space-y-0.5">
                <p className="font-bold text-brand-green text-sm">{fmt(h.recebido)}</p>
                <p className="text-[11px] text-amber-500 font-semibold">⭐ {h.nota.toFixed(1)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
