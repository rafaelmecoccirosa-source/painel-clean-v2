import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "Dashboard — Admin" };

// ── Mock data ──────────────────────────────────────────────────────────────

const stats = [
  { emoji: "💰", label: "Receita do mês",     value: "R$ 3.066", sub: "comissão 15%"        },
  { emoji: "🔧", label: "Serviços realizados", value: "87",       sub: "este mês"             },
  { emoji: "👥", label: "Técnicos ativos",     value: "28",       sub: "online esta semana"   },
  { emoji: "⭐", label: "Avaliação média",     value: "4.8",      sub: "últimos 30 dias"      },
];

const semanas = [
  { label: "Sem 1", receita: 3420 },
  { label: "Sem 2", receita: 5680 },
  { label: "Sem 3", receita: 4200 },
  { label: "Sem 4", receita: 7140 },
];

const cidades = [
  { nome: "Jaraguá do Sul", servicos: 33, pct: 38 },
  { nome: "Florianópolis",  servicos: 30, pct: 35 },
  { nome: "Pomerode",       servicos: 24, pct: 27 },
];

const ultimosServicos = [
  { id: 1, cliente: "João Silva",       cidade: "Jaraguá do Sul", modulos: 24, valor: 300, status: "pago"        },
  { id: 2, cliente: "Empresa Solar",    cidade: "Pomerode",       modulos: 48, valor: 520, status: "andamento"   },
  { id: 3, cliente: "Maria Oliveira",   cidade: "Jaraguá do Sul", modulos: 8,  valor: 180, status: "pago"        },
  { id: 4, cliente: "Fazenda Verde",    cidade: "Florianópolis",  modulos: 52, valor: 520, status: "pendente"    },
  { id: 5, cliente: "Residência Costa", cidade: "Pomerode",       modulos: 15, valor: 300, status: "pago"        },
];

const tecnicosPendentes = [
  { nome: "Carlos Mendes",  cidade: "Jaraguá do Sul", treinamento: 100 },
  { nome: "Ana Rodrigues",  cidade: "Pomerode",       treinamento: 75  },
  { nome: "Pedro Santos",   cidade: "Florianópolis",  treinamento: 40  },
];

const tecnicosInfo = { total: 31, ativosHoje: 12, aguardando: 3 };

const maxReceita = Math.max(...semanas.map((s) => s.receita));
const totalServicos = semanas.reduce((a, s) => a + s.receita / (s.receita / 87 * 87), 0);
const totalReceita = semanas.reduce((a, s) => a + s.receita, 0);
const valorMedio = Math.round(totalReceita / 87);

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function StatusBadge({ status }: { status: string }) {
  if (status === "pago")
    return <span className="text-xs font-semibold text-brand-green bg-brand-green/10 px-2.5 py-1 rounded-full">✅ Pago</span>;
  if (status === "pendente")
    return <span className="text-xs font-semibold text-yellow-700 bg-yellow-100 px-2.5 py-1 rounded-full">⏳ Pendente</span>;
  return <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full">🔄 Em andamento</span>;
}

export default function AdminDashboardPage() {
  return (
    <div className="page-container space-y-8">

      {/* ── Header ── */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-brand-dark">
          🛠️ Painel Administrativo
        </h1>
        <p className="text-brand-muted text-sm mt-1">Visão geral da plataforma Painel Clean — março 2026</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Gráfico receita ── */}
        <div className="card">
          <h2 className="font-heading font-bold text-brand-dark text-base mb-6">
            📊 Receita por semana (comissão 15%)
          </h2>
          <div className="flex items-end gap-3 h-36">
            {semanas.map((s) => {
              const pct = Math.round((s.receita / maxReceita) * 100);
              return (
                <div key={s.label} className="flex-1 flex flex-col items-center gap-2">
                  <p className="text-[10px] font-bold text-brand-dark text-center">
                    {fmt(s.receita)}
                  </p>
                  <div className="w-full flex items-end" style={{ height: "72px" }}>
                    <div
                      className="w-full rounded-t-lg bg-brand-green transition-all"
                      style={{ height: `${pct}%`, minHeight: "6px" }}
                    />
                  </div>
                  <p className="text-xs font-semibold text-brand-dark">{s.label}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-brand-border flex items-center justify-between text-xs text-brand-muted">
            <span>💵 Valor médio por serviço: <strong className="text-brand-dark">{fmt(valorMedio)}</strong></span>
            <span>Total: <strong className="text-brand-dark">{fmt(totalReceita)}</strong></span>
          </div>
        </div>

        {/* ── Área de maior demanda ── */}
        <div className="card space-y-5">
          <h2 className="font-heading font-bold text-brand-dark text-base">
            🗺️ Área de maior demanda
          </h2>
          <div className="space-y-4">
            {cidades.map(({ nome, servicos, pct }) => (
              <div key={nome}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-brand-dark">📍 {nome}</span>
                  <span className="text-xs text-brand-muted">{servicos} serviços · {pct}%</span>
                </div>
                <div className="h-2.5 bg-brand-bg rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-green rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Card técnicos */}
          <div className="bg-brand-bg rounded-xl border border-brand-border p-4 mt-2">
            <p className="text-xs font-semibold text-brand-muted uppercase tracking-wide mb-3">
              🧑‍🔧 Técnicos na base
            </p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="font-heading font-bold text-brand-dark text-xl">{tecnicosInfo.total}</p>
                <p className="text-[10px] text-brand-muted">total</p>
              </div>
              <div>
                <p className="font-heading font-bold text-brand-green text-xl">{tecnicosInfo.ativosHoje}</p>
                <p className="text-[10px] text-brand-muted">ativos hoje</p>
              </div>
              <div>
                <p className="font-heading font-bold text-yellow-600 text-xl">{tecnicosInfo.aguardando}</p>
                <p className="text-[10px] text-brand-muted">aguardando</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Últimos serviços ── */}
      <div className="card !p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-brand-border flex items-center justify-between">
          <h2 className="font-heading font-bold text-brand-dark text-base">
            🕐 Últimos serviços
          </h2>
          <Link
            href="/admin/servicos"
            className="text-xs text-brand-green font-semibold hover:underline flex items-center gap-1"
          >
            Ver todos <ArrowRight size={12} />
          </Link>
        </div>

        {/* Desktop */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-brand-bg">
              <tr>
                {["Cliente", "Cidade", "Módulos", "Valor", "Status"].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {ultimosServicos.map((s) => (
                <tr key={s.id} className="hover:bg-brand-bg/50 transition-colors">
                  <td className="px-6 py-3 font-medium text-brand-dark">{s.cliente}</td>
                  <td className="px-6 py-3 text-brand-muted">📍 {s.cidade}</td>
                  <td className="px-6 py-3 text-brand-muted">☀️ {s.modulos}</td>
                  <td className="px-6 py-3 font-semibold text-brand-dark">{fmt(s.valor)}</td>
                  <td className="px-6 py-3"><StatusBadge status={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="sm:hidden divide-y divide-brand-border">
          {ultimosServicos.map((s) => (
            <div key={s.id} className="px-4 py-3 flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-brand-dark text-sm">{s.cliente}</p>
                <p className="text-xs text-brand-muted mt-0.5">📍 {s.cidade} · ☀️ {s.modulos} módulos</p>
              </div>
              <div className="text-right flex-shrink-0 space-y-1">
                <p className="font-bold text-brand-dark text-sm">{fmt(s.valor)}</p>
                <StatusBadge status={s.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Técnicos aguardando aprovação ── */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-brand-dark text-base">
            ⏳ Técnicos aguardando aprovação
          </h2>
          <Link
            href="/admin/usuarios"
            className="text-xs text-brand-green font-semibold hover:underline flex items-center gap-1"
          >
            Gerenciar <ArrowRight size={12} />
          </Link>
        </div>

        <div className="space-y-3">
          {tecnicosPendentes.map(({ nome, cidade, treinamento }) => (
            <div
              key={nome}
              className="flex items-center justify-between gap-3 bg-brand-bg rounded-xl border border-brand-border px-4 py-3"
            >
              <div>
                <p className="font-medium text-brand-dark text-sm">🧑‍🔧 {nome}</p>
                <p className="text-xs text-brand-muted mt-0.5">📍 {cidade}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {treinamento === 100 ? (
                  <span className="text-xs font-semibold text-brand-green bg-brand-green/10 border border-brand-green/20 px-2.5 py-1 rounded-full">
                    ✅ Treinamento 100%
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-yellow-700 bg-yellow-100 border border-yellow-200 px-2.5 py-1 rounded-full">
                    ⏳ {treinamento}% concluído
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
