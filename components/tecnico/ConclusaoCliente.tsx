"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, CheckCircle2, TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";
import Toast, { useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";

export interface PrevistoData {
  valorServico: number;
  repasse: number;
  custoCombustivel: number;
  custoPedagio: number;
  totalCustos: number;
  lucroLiquido: number;
  margem: number;
}

interface ConclusaoClienteProps {
  servicoId: string;
  modulos: number;
  endereco: string;
  previsto: PrevistoData;
}

type EstadoModulos = "bom" | "regular" | "ruim";

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function DeltaBadge({ previsto, realizado }: { previsto: number; realizado: number }) {
  const delta = realizado - previsto;
  if (Math.abs(delta) < 0.01)
    return <span className="text-xs text-brand-muted flex items-center gap-1"><Minus size={11} /> igual</span>;
  if (delta > 0)
    return (
      <span className="text-xs text-red-500 flex items-center gap-1">
        <TrendingUp size={11} /> +{fmt(delta)}
      </span>
    );
  return (
    <span className="text-xs text-brand-green flex items-center gap-1">
      <TrendingDown size={11} /> {fmt(delta)}
    </span>
  );
}

export default function ConclusaoCliente({ servicoId, modulos, endereco, previsto }: ConclusaoClienteProps) {
  const router = useRouter();

  // Relatório
  const [estado, setEstado] = useState<EstadoModulos>("bom");
  const [modulosDanificados, setModulosDanificados] = useState(0);
  const [observacoes, setObservacoes] = useState("");

  // Custos reais
  const [realCombustivel, setRealCombustivel] = useState(previsto.custoCombustivel);
  const [realPedagio, setRealPedagio] = useState(previsto.custoPedagio);

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const { toast, show: showToast, hide: hideToast } = useToast();

  // Cálculo realizado
  const realTotalCustos = realCombustivel + realPedagio;
  const realLucro = previsto.repasse - realTotalCustos;
  const realMargem = (realLucro / previsto.valorServico) * 100;

  const margemColor = (m: number) =>
    m >= 30 ? "text-brand-green" : m >= 10 ? "text-yellow-600" : "text-red-600";

  const custosForamMenores = realTotalCustos < previsto.totalCustos;
  const custosForamMaiores = realTotalCustos > previsto.totalCustos;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        showToast("Sessão expirada. Faça login novamente.", "error");
        setSubmitting(false);
        return;
      }

      const { error } = await supabase
        .from("service_requests")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", servicoId)
        .eq("technician_id", user.id);

      if (error) {
        console.error("Complete service error:", error);
        showToast("Erro ao concluir serviço. Tente novamente.", "error");
        setSubmitting(false);
        return;
      }

      setDone(true);
      showToast("Serviço concluído! Aguardando avaliação do cliente.", "success");
      setTimeout(() => router.push("/tecnico"), 2000);
    } catch (err) {
      console.error(err);
      showToast("Erro inesperado. Tente novamente.", "error");
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="card text-center py-12">
        <div className="h-16 w-16 rounded-full bg-brand-green/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={36} className="text-brand-green" />
        </div>
        <h2 className="font-heading font-bold text-brand-dark text-xl mb-2">Serviço concluído!</h2>
        <p className="text-brand-muted text-sm">Relatório enviado. Seu PIX será processado em breve.</p>
      </div>
    );
  }

  const inputBase =
    "w-full rounded-xl border border-brand-border bg-white px-4 py-2.5 text-sm text-brand-dark " +
    "placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all";

  const numInput = `${inputBase} [appearance:textfield]`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {toast && <Toast key={toast.key} message={toast.message} type={toast.type} onClose={hideToast} />}

      {/* ── Relatório fotográfico ── */}
      <div className="card space-y-5">
        <h2 className="font-heading font-bold text-brand-dark text-base flex items-center gap-2">
          <Camera size={17} className="text-brand-green" />
          Relatório do serviço
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {/* Fotos antes */}
          <div>
            <p className="text-xs font-semibold text-brand-muted mb-2 uppercase tracking-wide">
              Fotos — antes
            </p>
            <label className="flex flex-col items-center justify-center h-28 rounded-xl border-2 border-dashed border-brand-border bg-brand-bg cursor-pointer hover:border-brand-green/50 transition-colors">
              <Camera size={20} className="text-brand-muted mb-1" />
              <span className="text-xs text-brand-muted">Adicionar fotos</span>
              <input type="file" accept="image/*" multiple className="hidden" />
            </label>
          </div>
          {/* Fotos depois */}
          <div>
            <p className="text-xs font-semibold text-brand-muted mb-2 uppercase tracking-wide">
              Fotos — depois
            </p>
            <label className="flex flex-col items-center justify-center h-28 rounded-xl border-2 border-dashed border-brand-border bg-brand-bg cursor-pointer hover:border-brand-green/50 transition-colors">
              <Camera size={20} className="text-brand-muted mb-1" />
              <span className="text-xs text-brand-muted">Adicionar fotos</span>
              <input type="file" accept="image/*" multiple className="hidden" />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wide mb-2">
            Estado dos módulos
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["bom", "regular", "ruim"] as EstadoModulos[]).map((op) => (
              <button
                key={op}
                type="button"
                onClick={() => setEstado(op)}
                className={`rounded-xl border py-2.5 text-sm font-semibold capitalize transition-colors ${
                  estado === op
                    ? "bg-brand-green text-white border-brand-green"
                    : "bg-white text-brand-dark border-brand-border hover:border-brand-green/50"
                }`}
              >
                {op}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wide mb-2">
            Módulos danificados
          </label>
          <input
            type="number"
            min={0}
            max={modulos}
            value={modulosDanificados}
            onChange={(e) => setModulosDanificados(parseInt(e.target.value) || 0)}
            className={numInput}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wide mb-2">
            Observações
          </label>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Descreva condições, problemas encontrados, recomendações…"
            rows={3}
            className={`${inputBase} resize-none`}
          />
        </div>
      </div>

      {/* ── Previsto × Realizado ── */}
      <div className="card space-y-5">
        <div>
          <h2 className="font-heading font-bold text-brand-dark text-base flex items-center gap-2">
            <TrendingUp size={17} className="text-brand-green" />
            Previsto × Realizado
          </h2>
          <p className="text-xs text-brand-muted mt-1">
            Informe os custos reais do serviço para calcular sua margem real.
          </p>
        </div>

        {/* Custos reais editáveis */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wide mb-2">
              Combustível gasto (R$)
            </label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={realCombustivel}
              onChange={(e) => setRealCombustivel(parseFloat(e.target.value) || 0)}
              className={numInput}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wide mb-2">
              Pedágio gasto (R$)
            </label>
            <input
              type="number"
              min={0}
              step={0.5}
              value={realPedagio}
              onChange={(e) => setRealPedagio(parseFloat(e.target.value) || 0)}
              className={numInput}
            />
          </div>
        </div>

        {/* Tabela comparativa */}
        <div className="rounded-xl border border-brand-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-brand-bg">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">Item</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">Previsto</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">Realizado</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">Δ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              <tr>
                <td className="px-4 py-3 text-brand-dark">Combustível</td>
                <td className="px-4 py-3 text-right text-brand-muted">{fmt(previsto.custoCombustivel)}</td>
                <td className="px-4 py-3 text-right text-brand-dark font-medium">{fmt(realCombustivel)}</td>
                <td className="px-4 py-3 text-right">
                  <DeltaBadge previsto={previsto.custoCombustivel} realizado={realCombustivel} />
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-brand-dark">Pedágio</td>
                <td className="px-4 py-3 text-right text-brand-muted">{fmt(previsto.custoPedagio)}</td>
                <td className="px-4 py-3 text-right text-brand-dark font-medium">{fmt(realPedagio)}</td>
                <td className="px-4 py-3 text-right">
                  <DeltaBadge previsto={previsto.custoPedagio} realizado={realPedagio} />
                </td>
              </tr>
              <tr className="bg-brand-bg/60">
                <td className="px-4 py-3 font-semibold text-brand-dark">Total custos</td>
                <td className="px-4 py-3 text-right font-semibold text-brand-muted">{fmt(previsto.totalCustos)}</td>
                <td className="px-4 py-3 text-right font-semibold text-brand-dark">{fmt(realTotalCustos)}</td>
                <td className="px-4 py-3 text-right">
                  <DeltaBadge previsto={previsto.totalCustos} realizado={realTotalCustos} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Resumo margem real */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-brand-bg rounded-xl border border-brand-border px-4 py-4">
            <p className="text-xs text-brand-muted mb-1">Lucro previsto</p>
            <p className={`font-heading font-bold text-xl ${margemColor(previsto.margem)}`}>
              {fmt(previsto.lucroLiquido)}
            </p>
            <p className={`text-xs font-semibold mt-0.5 ${margemColor(previsto.margem)}`}>
              {previsto.margem.toFixed(1)}% margem
            </p>
          </div>
          <div className="bg-brand-dark rounded-xl px-4 py-4">
            <p className="text-xs text-white/50 mb-1">Lucro real</p>
            <p className={`font-heading font-bold text-xl ${
              realMargem >= 30 ? "text-brand-green" : realMargem >= 10 ? "text-yellow-400" : "text-red-400"
            }`}>
              {fmt(realLucro)}
            </p>
            <p className={`text-xs font-semibold mt-0.5 ${
              realMargem >= 30 ? "text-brand-green" : realMargem >= 10 ? "text-yellow-400" : "text-red-400"
            }`}>
              {realMargem.toFixed(1)}% margem
            </p>
          </div>
        </div>

        {/* Resultado comparativo */}
        {(custosForamMenores || custosForamMaiores) && (
          <div className={`flex items-start gap-2.5 rounded-xl px-4 py-3 ${
            custosForamMenores
              ? "bg-brand-green/10 border border-brand-green/30"
              : "bg-yellow-50 border border-yellow-200"
          }`}>
            {custosForamMenores ? (
              <TrendingDown size={16} className="text-brand-green flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
            )}
            <p className={`text-sm font-medium ${custosForamMenores ? "text-brand-dark" : "text-yellow-800"}`}>
              {custosForamMenores
                ? `Ótimo! Você gastou ${fmt(previsto.totalCustos - realTotalCustos)} menos do que o previsto.`
                : `Custos ${fmt(realTotalCustos - previsto.totalCustos)} acima do estimado. Use isso para calibrar chamados futuros.`}
            </p>
          </div>
        )}
      </div>

      {/* ── Submit ── */}
      <Button type="submit" size="lg" className="w-full" loading={submitting}>
        <CheckCircle2 size={18} />
        {submitting ? "Enviando relatório…" : "Concluir serviço e enviar relatório"}
      </Button>
    </form>
  );
}
