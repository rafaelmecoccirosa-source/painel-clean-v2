import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import DisponibilidadeToggle from "@/components/tecnico/DisponibilidadeToggle";

export const metadata: Metadata = { title: "Dashboard — Técnico" };

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ── Mock data ──────────────────────────────────────────────────────────────

const stats = [
  { emoji: "💰", label: "Ganhos no mês",       value: "R$ 2.210",  sub: "+12% vs março"  },
  { emoji: "⭐", label: "Avaliação média",      value: "4.9",       sub: "últimos 30 dias" },
  { emoji: "🔧", label: "Serviços realizados",  value: "8",         sub: "este mês"        },
  { emoji: "📈", label: "Crescimento",          value: "+12%",      sub: "vs mês anterior" },
];

const semanas = [
  { label: "Sem 1", dias: "01–07", repasse: 595 },
  { label: "Sem 2", dias: "08–14", repasse: 510 },
  { label: "Sem 3", dias: "15–21", repasse: 408 },
  { label: "Sem 4", dias: "22–28", repasse: 697 },
];

const chamados = [
  {
    id: "cham-001",
    endereco: "Rua das Flores, 123",
    cidade: "Jaraguá do Sul, SC",
    data: "30/03",
    hora: "08:00",
    periodo: "manhã",
    distanciaKm: 12,
    modulos: 24,
    tempoH: 2.5,
    repasse: 255,
    urgente: false,
  },
  {
    id: "cham-002",
    endereco: "Av. Industrial, 500",
    cidade: "Pomerode, SC",
    data: "31/03",
    hora: "08:00",
    periodo: "manhã",
    distanciaKm: 34,
    modulos: 48,
    tempoH: 3.5,
    repasse: 442,
    urgente: true,
  },
  {
    id: "cham-003",
    endereco: "Rua do Sol, 77",
    cidade: "Jaraguá do Sul, SC",
    data: "01/04",
    hora: "13:00",
    periodo: "tarde",
    distanciaKm: 5,
    modulos: 8,
    tempoH: 1.5,
    repasse: 153,
    urgente: false,
  },
];

const maxRepasse = Math.max(...semanas.map((s) => s.repasse));

export default function TecnicoDashboardPage() {
  return (
    <div className="page-container space-y-8">

      {/* ── Header com toggle ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-brand-dark">
            Olá, Carlos! 👋
          </h1>
          <p className="text-brand-muted text-sm mt-0.5">Março 2026 · veja seus números</p>
        </div>
        <DisponibilidadeToggle cidade="Jaraguá do Sul, SC" />
      </div>

      {/* ── Métricas ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ emoji, label, value, sub }) => (
          <div key={label} className="card flex flex-col gap-2">
            <span className="text-2xl">{emoji}</span>
            <div>
              <p className="font-heading text-xl font-bold text-brand-dark">{value}</p>
              <p className="text-xs text-brand-muted mt-0.5">{label}</p>
              <p className="text-[10px] text-brand-green font-semibold mt-1">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Gráfico de ganhos por semana ── */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-brand-dark text-base">
            📊 Ganhos por semana — março
          </h2>
          <Link
            href="/tecnico/ganhos"
            className="text-xs text-brand-green font-semibold hover:underline flex items-center gap-1"
          >
            Ver detalhes <ArrowRight size={12} />
          </Link>
        </div>

        <div className="flex items-end gap-3 h-36">
          {semanas.map((s) => {
            const pct = Math.round((s.repasse / maxRepasse) * 100);
            return (
              <div key={s.label} className="flex-1 flex flex-col items-center gap-2">
                <p className="text-[10px] font-bold text-brand-dark text-center">
                  {fmt(s.repasse).replace("R$\u00a0", "R$")}
                </p>
                <div className="w-full flex items-end" style={{ height: "72px" }}>
                  <div
                    className="w-full rounded-t-lg bg-brand-green transition-all"
                    style={{ height: `${pct}%`, minHeight: "6px" }}
                  />
                </div>
                <p className="text-xs font-semibold text-brand-dark">{s.label}</p>
                <p className="text-[9px] text-brand-muted">{s.dias} mar</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Chamados disponíveis ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-brand-dark text-base">
            🔔 Chamados disponíveis
          </h2>
          <Link
            href="/tecnico/chamados"
            className="text-xs text-brand-green font-semibold hover:underline flex items-center gap-1"
          >
            Ver todos <ArrowRight size={12} />
          </Link>
        </div>

        <div className="space-y-3">
          {chamados.map((c) => (
            <Link
              key={c.id}
              href={`/tecnico/chamados/${c.id}`}
              className="card hover:shadow-card-hover transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-heading font-bold text-brand-dark text-sm">
                    📍 {c.endereco}
                  </span>
                  {c.urgente && (
                    <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                      🚨 Urgente
                    </span>
                  )}
                </div>
                <p className="text-xs text-brand-muted">{c.cidade}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-brand-muted">
                  <span>🕐 {c.data} · {c.hora} ({c.periodo})</span>
                  <span>📏 {c.distanciaKm} km</span>
                  <span>☀️ {c.modulos} módulos</span>
                  <span>⏱ ~{c.tempoH}h</span>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end gap-3 flex-shrink-0">
                <div className="text-right">
                  <p className="text-[10px] text-brand-muted">💵 Repasse líquido</p>
                  <p className="font-heading font-extrabold text-brand-green text-xl">
                    {fmt(c.repasse)}
                  </p>
                </div>
                <ArrowRight
                  size={16}
                  className="text-brand-muted group-hover:text-brand-green transition-colors"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
