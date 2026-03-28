import type { Metadata } from "next";
import { DollarSign, Star, CheckCircle2, Smartphone, TrendingUp } from "lucide-react";

export const metadata: Metadata = { title: "Ganhos — Técnico" };

// ── Mock data (substituir por query Supabase) ──────────────────────────────

const resumo = {
  totalBruto: 2600.0,
  comissao: 390.0,       // 15%
  totalRepasse: 2210.0,  // 85%
  servicos: 8,
  avaliacaoMedia: 4.9,
};

const semanas = [
  { label: "Sem 1", dias: "01–07 mar", repasse: 595 },
  { label: "Sem 2", dias: "08–14 mar", repasse: 510 },
  { label: "Sem 3", dias: "15–21 mar", repasse: 408 },
  { label: "Sem 4", dias: "22–28 mar", repasse: 697 },
];

const pagamentos = [
  {
    id: 1,
    data: "28/03/2026",
    endereco: "Residência — Jaraguá do Sul",
    modulos: 12,
    bruto: 300.0,
    repasse: 255.0,
  },
  {
    id: 2,
    data: "25/03/2026",
    endereco: "Comércio — Pomerode",
    modulos: 22,
    bruto: 300.0,
    repasse: 255.0,
  },
  {
    id: 3,
    data: "21/03/2026",
    endereco: "Residência — Florianópolis",
    modulos: 48,
    bruto: 520.0,
    repasse: 442.0,
  },
  {
    id: 4,
    data: "18/03/2026",
    endereco: "Sítio — Jaraguá do Sul",
    modulos: 8,
    bruto: 180.0,
    repasse: 153.0,
  },
  {
    id: 5,
    data: "14/03/2026",
    endereco: "Residência — Pomerode",
    modulos: 15,
    bruto: 300.0,
    repasse: 255.0,
  },
  {
    id: 6,
    data: "10/03/2026",
    endereco: "Empresa — Florianópolis",
    modulos: 28,
    bruto: 300.0,
    repasse: 255.0,
  },
  {
    id: 7,
    data: "06/03/2026",
    endereco: "Residência — Jaraguá do Sul",
    modulos: 9,
    bruto: 180.0,
    repasse: 153.0,
  },
  {
    id: 8,
    data: "03/03/2026",
    endereco: "Usina Solar — Pomerode",
    modulos: 52,
    bruto: 520.0,
    repasse: 442.0,
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────

function fmt(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function GanhosPage() {
  const maxRepasse = Math.max(...semanas.map((s) => s.repasse));

  return (
    <div className="page-container space-y-8">

      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-brand-dark">Meus ganhos</h1>
        <p className="text-brand-muted text-sm mt-1">Março 2026 · 8 serviços concluídos</p>
      </div>

      {/* ── Resumo do mês ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-brand-green/10 flex items-center justify-center flex-shrink-0">
            <DollarSign size={22} className="text-brand-green" />
          </div>
          <div>
            <p className="text-xs text-brand-muted mb-0.5">Recebido no mês</p>
            <p className="font-heading text-2xl font-bold text-brand-dark">
              {fmt(resumo.totalRepasse)}
            </p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={22} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-brand-muted mb-0.5">Serviços concluídos</p>
            <p className="font-heading text-2xl font-bold text-brand-dark">
              {resumo.servicos}
            </p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-yellow-50 flex items-center justify-center flex-shrink-0">
            <Star size={22} className="text-yellow-500" />
          </div>
          <div>
            <p className="text-xs text-brand-muted mb-0.5">Avaliação média</p>
            <p className="font-heading text-2xl font-bold text-brand-dark">
              {resumo.avaliacaoMedia.toFixed(1)}
              <span className="text-sm font-normal text-brand-muted ml-1">/ 5</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Breakdown financeiro ── */}
      <div className="bg-brand-dark rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp size={18} className="text-brand-green" />
          <h2 className="font-heading text-base font-bold text-white">
            Breakdown do mês
          </h2>
        </div>

        <div className="space-y-4">
          {/* Valor bruto */}
          <div className="flex items-center justify-between py-3 border-b border-white/10">
            <div>
              <p className="text-sm font-medium text-white">Valor bruto dos serviços</p>
              <p className="text-xs text-white/50 mt-0.5">8 serviços × valor cobrado ao cliente</p>
            </div>
            <p className="font-heading font-bold text-white text-lg">{fmt(resumo.totalBruto)}</p>
          </div>

          {/* Comissão */}
          <div className="flex items-center justify-between py-3 border-b border-white/10">
            <div>
              <p className="text-sm font-medium text-white/70">Comissão da plataforma</p>
              <p className="text-xs text-white/40 mt-0.5">15% retido pela Painel Clean</p>
            </div>
            <p className="font-heading font-bold text-red-400 text-lg">
              − {fmt(resumo.comissao)}
            </p>
          </div>

          {/* Repasse líquido */}
          <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-4 mt-2">
            <div>
              <p className="text-sm font-semibold text-white">Repasse líquido</p>
              <p className="text-xs text-white/50 mt-0.5">85% · pago via PIX automático</p>
            </div>
            <p className="font-heading font-extrabold text-brand-green text-2xl">
              {fmt(resumo.totalRepasse)}
            </p>
          </div>
        </div>
      </div>

      {/* ── Gráfico semanal ── */}
      <div className="card">
        <h2 className="font-heading text-base font-bold text-brand-dark mb-6">
          Ganhos por semana — março 2026
        </h2>

        <div className="flex items-end gap-3 sm:gap-5 h-40">
          {semanas.map((semana) => {
            const pct = Math.round((semana.repasse / maxRepasse) * 100);
            return (
              <div key={semana.label} className="flex-1 flex flex-col items-center gap-2">
                <p className="text-xs font-semibold text-brand-dark">
                  {fmt(semana.repasse).replace("R$\u00a0", "R$ ")}
                </p>
                <div className="w-full flex items-end" style={{ height: "80px" }}>
                  <div
                    className="w-full rounded-t-lg bg-brand-green transition-all"
                    style={{ height: `${pct}%`, minHeight: "8px" }}
                  />
                </div>
                <p className="text-xs font-semibold text-brand-dark">{semana.label}</p>
                <p className="text-[10px] text-brand-muted text-center leading-tight">
                  {semana.dias}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-sm bg-brand-green" />
          <p className="text-xs text-brand-muted">Repasse líquido recebido (R$)</p>
        </div>
      </div>

      {/* ── Lista de pagamentos ── */}
      <div className="card !p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-brand-border flex items-center justify-between">
          <h2 className="font-heading text-base font-bold text-brand-dark">
            Pagamentos recebidos
          </h2>
          <span className="text-xs bg-brand-green/10 text-brand-green font-semibold px-2.5 py-1 rounded-full">
            {pagamentos.length} pagamentos
          </span>
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-brand-bg">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">Data</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">Local / módulos</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">Bruto</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">Comissão</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">Repasse</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {pagamentos.map((p) => (
                <tr key={p.id} className="hover:bg-brand-bg/50 transition-colors">
                  <td className="px-6 py-4 text-brand-muted whitespace-nowrap">{p.data}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-brand-dark">{p.endereco}</p>
                    <p className="text-xs text-brand-muted mt-0.5">{p.modulos} módulos</p>
                  </td>
                  <td className="px-6 py-4 text-right text-brand-dark font-medium">
                    {fmt(p.bruto)}
                  </td>
                  <td className="px-6 py-4 text-right text-red-500 font-medium">
                    − {fmt(p.bruto * 0.15)}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-brand-dark">
                    {fmt(p.repasse)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <Smartphone size={12} className="text-brand-green" />
                      <span className="text-xs font-semibold text-brand-green bg-brand-green/10 px-2.5 py-1 rounded-full whitespace-nowrap">
                        Pago · PIX
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden divide-y divide-brand-border">
          {pagamentos.map((p) => (
            <div key={p.id} className="px-4 py-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-brand-muted mb-0.5">{p.data}</p>
                <p className="font-medium text-brand-dark text-sm truncate">{p.endereco}</p>
                <p className="text-xs text-brand-muted mt-0.5">{p.modulos} módulos</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <Smartphone size={11} className="text-brand-green" />
                  <span className="text-xs font-semibold text-brand-green">Pago · PIX</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-brand-muted">Repasse</p>
                <p className="font-heading font-bold text-brand-dark text-base">{fmt(p.repasse)}</p>
                <p className="text-xs text-red-400 mt-0.5">−{fmt(p.bruto * 0.15)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
