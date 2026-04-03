import type { Metadata } from "next";
import { DollarSign, Star, CheckCircle2, Smartphone, TrendingUp } from "lucide-react";
import { MOCK_TECNICO } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Ganhos — Técnico" };

// ── Helpers ────────────────────────────────────────────────────────────────

function fmt(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function GanhosPage() {
  const resumo = MOCK_TECNICO.resumoMes;
  const semanas = MOCK_TECNICO.ganhosSemanal;
  const pagamentos = MOCK_TECNICO.pagamentos;

  const mesAtual = new Date().toLocaleString("pt-BR", { month: "long" });
  const mesCapitalized = mesAtual.charAt(0).toUpperCase() + mesAtual.slice(1);
  const anoAtual = new Date().getFullYear();

  const maxValor = Math.max(...semanas.map((s) => s.valor));

  return (
    <div className="page-container space-y-8">

      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-brand-dark">Meus ganhos</h1>
        <p className="text-brand-muted text-sm mt-1">
          {mesCapitalized} {anoAtual} · {resumo.servicos} serviços concluídos
        </p>
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
              <p className="text-xs text-white/50 mt-0.5">
                {resumo.servicos} serviços × valor cobrado ao cliente
              </p>
            </div>
            <p className="font-heading font-bold text-white text-lg">{fmt(resumo.totalBruto)}</p>
          </div>

          {/* Comissão */}
          <div className="flex items-center justify-between py-3 border-b border-white/10">
            <div>
              <p className="text-sm font-medium text-white/70">Comissão da plataforma</p>
              <p className="text-xs text-white/40 mt-0.5">25% retido pela Painel Clean</p>
            </div>
            <p className="font-heading font-bold text-red-400 text-lg">
              − {fmt(resumo.comissao)}
            </p>
          </div>

          {/* Repasse líquido */}
          <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-4 mt-2">
            <div>
              <p className="text-sm font-semibold text-white">Repasse líquido</p>
              <p className="text-xs text-white/50 mt-0.5">75% · pago via PIX automático</p>
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
          Ganhos por semana — {mesCapitalized} {anoAtual}
        </h2>

        <div className="flex items-end gap-3 sm:gap-5 h-40">
          {semanas.map((semana) => {
            const pct = maxValor > 0 ? Math.round((semana.valor / maxValor) * 100) : 0;
            return (
              <div key={semana.label} className="flex-1 flex flex-col items-center gap-2">
                <p className="text-xs font-semibold text-brand-dark">
                  {fmt(semana.valor).replace("R$\u00a0", "R$ ")}
                </p>
                <div className="w-full flex items-end" style={{ height: "80px" }}>
                  <div
                    className="w-full rounded-t-lg bg-brand-green transition-all"
                    style={{ height: `${pct}%`, minHeight: "8px" }}
                  />
                </div>
                <p className="text-xs font-semibold text-brand-dark">{semana.label}</p>
                <p className="text-[10px] text-brand-muted text-center leading-tight">
                  {semana.sub}
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
                <th className="text-left px-6 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">Local / placas</th>
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
                    <p className="text-xs text-brand-muted mt-0.5">{p.modulos} placas</p>
                  </td>
                  <td className="px-6 py-4 text-right text-brand-dark font-medium">
                    {fmt(p.bruto)}
                  </td>
                  <td className="px-6 py-4 text-right text-red-500 font-medium">
                    − {fmt(p.bruto * 0.25)}
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
                <p className="text-xs text-brand-muted mt-0.5">{p.modulos} placas</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <Smartphone size={11} className="text-brand-green" />
                  <span className="text-xs font-semibold text-brand-green">Pago · PIX</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-brand-muted">Repasse</p>
                <p className="font-heading font-bold text-brand-dark text-base">{fmt(p.repasse)}</p>
                <p className="text-xs text-red-400 mt-0.5">−{fmt(p.bruto * 0.25)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
