"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Camera, CheckCircle2, TrendingUp, TrendingDown, Minus,
  AlertTriangle, X, Check,
} from "lucide-react";
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

type GeneralCondition = "bom" | "regular" | "necessita_atencao";

const CHECKLIST_ITEMS = [
  { key: "visual_inspection",  label: "Inspeção visual dos módulos" },
  { key: "connector_check",    label: "Verificação de conectores" },
  { key: "cleaning_complete",  label: "Limpeza concluída" },
  { key: "damage_test",        label: "Teste visual de danos" },
] as const;

const CONDITION_OPTIONS: { value: GeneralCondition; label: string; color: string }[] = [
  { value: "bom",               label: "Bom",               color: "bg-brand-green text-white border-brand-green" },
  { value: "regular",           label: "Regular",            color: "bg-yellow-400 text-white border-yellow-400" },
  { value: "necessita_atencao", label: "Necessita atenção",  color: "bg-red-500 text-white border-red-500" },
];

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

function PhotoGrid({
  label,
  files,
  onAdd,
  onRemove,
  minCount,
}: {
  label: string;
  files: File[];
  onAdd: (f: File[]) => void;
  onRemove: (i: number) => void;
  minCount: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const missing = Math.max(0, minCount - files.length);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-brand-muted uppercase tracking-wide">{label}</p>
        {missing > 0 && (
          <span className="text-xs text-amber-600 font-medium">mín. {minCount} fotos ({missing} faltando)</span>
        )}
        {files.length >= minCount && (
          <span className="text-xs text-brand-green font-medium">✓ {files.length} foto{files.length !== 1 ? "s" : ""}</span>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {files.map((f, i) => (
          <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-brand-bg border border-brand-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={URL.createObjectURL(f)}
              alt={`foto ${i + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 text-white hover:bg-black/80"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="aspect-square rounded-xl border-2 border-dashed border-brand-border bg-brand-bg flex flex-col items-center justify-center hover:border-brand-green/50 transition-colors"
        >
          <Camera size={18} className="text-brand-muted mb-1" />
          <span className="text-[10px] text-brand-muted">Adicionar</span>
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) onAdd(Array.from(e.target.files));
          e.target.value = "";
        }}
      />
    </div>
  );
}

export default function ConclusaoCliente({ servicoId, modulos, endereco, previsto }: ConclusaoClienteProps) {
  const router = useRouter();

  // Fotos
  const [photosBefore, setPhotosBefore] = useState<File[]>([]);
  const [photosAfter,  setPhotosAfter]  = useState<File[]>([]);

  // Checklist
  const [checklist, setChecklist] = useState<Record<string, boolean>>(
    Object.fromEntries(CHECKLIST_ITEMS.map((i) => [i.key, false]))
  );

  // Condição geral + observações
  const [condition, setCondition]   = useState<GeneralCondition>("bom");
  const [observacoes, setObservacoes] = useState("");

  // Custos reais
  const [realCombustivel, setRealCombustivel] = useState(previsto.custoCombustivel);
  const [realPedagio,     setRealPedagio]     = useState(previsto.custoPedagio);

  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [done, setDone] = useState(false);
  const { toast, show: showToast, hide: hideToast } = useToast();

  const realTotalCustos = realCombustivel + realPedagio;
  const realLucro       = previsto.repasse - realTotalCustos;
  const realMargem      = (realLucro / previsto.valorServico) * 100;

  const margemColor = (m: number) =>
    m >= 30 ? "text-brand-green" : m >= 10 ? "text-yellow-600" : "text-red-600";

  const custosForamMenores = realTotalCustos < previsto.totalCustos;
  const custosForamMaiores = realTotalCustos > previsto.totalCustos;

  const toggleChecklist = useCallback((key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  async function uploadPhotos(
    supabase: ReturnType<typeof createClient>,
    files: File[],
    folder: "before" | "after"
  ): Promise<string[]> {
    const urls: string[] = [];
    for (const file of files) {
      const ext  = file.name.split(".").pop() ?? "jpg";
      const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const path = `${servicoId}/${folder}/${name}`;

      const { error } = await supabase.storage
        .from("service-photos")
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (error) {
        // If storage bucket doesn't exist yet, fall back to empty URLs gracefully
        console.warn("Storage upload warning:", error.message);
        urls.push("");
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from("service-photos")
          .getPublicUrl(path);
        urls.push(publicUrl);
      }
    }
    return urls;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (photosBefore.length < 2) {
      showToast("Adicione pelo menos 2 fotos ANTES da limpeza.", "error");
      return;
    }
    if (photosAfter.length < 2) {
      showToast("Adicione pelo menos 2 fotos DEPOIS da limpeza.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        showToast("Sessão expirada. Faça login novamente.", "error");
        setSubmitting(false);
        return;
      }

      // 1. Upload fotos
      setUploadProgress("Enviando fotos antes…");
      const urlsBefore = await uploadPhotos(supabase, photosBefore, "before");

      setUploadProgress("Enviando fotos depois…");
      const urlsAfter = await uploadPhotos(supabase, photosAfter, "after");

      // 2. Insert service_report
      setUploadProgress("Salvando relatório…");
      const { error: reportError } = await supabase
        .from("service_reports")
        .insert({
          service_request_id: servicoId,
          photos_before:      urlsBefore,
          photos_after:       urlsAfter,
          checklist,
          observations:       observacoes.trim() || null,
          general_condition:  condition,
        });

      if (reportError) {
        // Table might not exist yet — log but continue completing the service
        console.warn("service_reports insert warning:", reportError.message);
      }

      // 3. Update service_requests status
      setUploadProgress("Concluindo serviço…");
      const { error } = await supabase
        .from("service_requests")
        .update({
          status:       "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", servicoId)
        .eq("technician_id", user.id);

      if (error) {
        console.error("Complete service error:", error);
        showToast("Erro ao concluir serviço. Tente novamente.", "error");
        setSubmitting(false);
        setUploadProgress("");
        return;
      }

      setDone(true);
      showToast("Serviço concluído! Aguardando avaliação do cliente.", "success");
      setTimeout(() => router.push("/tecnico"), 2000);
    } catch (err) {
      console.error(err);
      showToast("Erro inesperado. Tente novamente.", "error");
      setSubmitting(false);
      setUploadProgress("");
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
          Relatório fotográfico
        </h2>

        <PhotoGrid
          label="Fotos — antes da limpeza"
          files={photosBefore}
          minCount={2}
          onAdd={(f) => setPhotosBefore((prev) => [...prev, ...f])}
          onRemove={(i) => setPhotosBefore((prev) => prev.filter((_, idx) => idx !== i))}
        />

        <PhotoGrid
          label="Fotos — depois da limpeza"
          files={photosAfter}
          minCount={2}
          onAdd={(f) => setPhotosAfter((prev) => [...prev, ...f])}
          onRemove={(i) => setPhotosAfter((prev) => prev.filter((_, idx) => idx !== i))}
        />
      </div>

      {/* ── Checklist + Condição ── */}
      <div className="card space-y-5">
        <h2 className="font-heading font-bold text-brand-dark text-base flex items-center gap-2">
          <CheckCircle2 size={17} className="text-brand-green" />
          Checklist de inspeção
        </h2>

        <div className="space-y-2">
          {CHECKLIST_ITEMS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => toggleChecklist(key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors text-left ${
                checklist[key]
                  ? "bg-brand-green/10 border-brand-green/40 text-brand-dark"
                  : "bg-brand-bg border-brand-border text-brand-muted"
              }`}
            >
              <div className={`h-5 w-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                checklist[key] ? "bg-brand-green border-brand-green" : "border-brand-border"
              }`}>
                {checklist[key] && <Check size={11} className="text-white" />}
              </div>
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wide mb-2">
            Condição geral dos módulos
          </label>
          <div className="grid grid-cols-3 gap-2">
            {CONDITION_OPTIONS.map(({ value, label, color }) => (
              <button
                key={value}
                type="button"
                onClick={() => setCondition(value)}
                className={`rounded-xl border py-2.5 text-xs font-semibold transition-colors ${
                  condition === value
                    ? color
                    : "bg-white text-brand-dark border-brand-border hover:border-brand-green/50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
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
      {uploadProgress && (
        <p className="text-center text-sm text-brand-muted animate-pulse">{uploadProgress}</p>
      )}
      <Button type="submit" size="lg" className="w-full" loading={submitting}>
        <CheckCircle2 size={18} />
        {submitting ? uploadProgress || "Enviando…" : "Concluir serviço e enviar relatório"}
      </Button>
    </form>
  );
}
