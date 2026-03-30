"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, Clock, Sun, AlertTriangle, ArrowRight, Play, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Toast, { useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";
import type { ServiceRequestDB } from "@/lib/types";

// ── Legacy interface kept for mock fallback ───────────────────────────────
export interface ChamadoData {
  id: string;
  cliente: string;
  endereco: string;
  cidade: string;
  modulos: number;
  valorServico: number;
  dataAgendada: string;
  periodo: "manhã" | "tarde" | string;
  distanciaKm: number;
  tempoEstimadoHoras: number;
  observacoes?: string;
}

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function tempoByModulos(n: number): number {
  if (n <= 10) return 1.5;
  if (n <= 30) return 2.5;
  if (n <= 60) return 3.5;
  return 5;
}

function fmtDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

// ── Props: either a real DB record OR the legacy mock shape ───────────────
interface Props {
  /** Real Supabase record — takes priority if provided */
  service?: ServiceRequestDB;
  /** Legacy mock fallback */
  chamado?: ChamadoData;
}

export default function ChamadoDetalheCliente({ service, chamado }: Props) {
  const router = useRouter();
  const { toast, show: showToast, hide: hideToast } = useToast();

  // Derive display values from whichever source is available
  const id            = service?.id ?? chamado?.id ?? "";
  const endereco      = service?.address ?? chamado?.endereco ?? "";
  const cidade        = service?.city ?? chamado?.cidade ?? "";
  const modulos       = service?.module_count ?? chamado?.modulos ?? 0;
  const valorServico  = service?.price_estimate ?? chamado?.valorServico ?? 0;
  const observacoes   = service?.notes ?? chamado?.observacoes ?? "";
  const status        = service?.status ?? "pending";
  const dataAgendada  = service
    ? fmtDate(service.preferred_date)
    : (chamado?.dataAgendada ?? "");
  const periodo       = service?.preferred_time ?? chamado?.periodo ?? "";
  const distanciaKm   = chamado?.distanciaKm ?? 10; // default when unknown

  const repasse   = valorServico * 0.85;
  const comissao  = valorServico * 0.15;
  const tempo     = service ? tempoByModulos(modulos) : (chamado?.tempoEstimadoHoras ?? tempoByModulos(modulos));

  // Calculadora state
  const [distancia, setDistancia]           = useState(distanciaKm);
  const [consumo, setConsumo]               = useState(10);
  const [precoCombustivel, setPrecoComb]    = useState(6.0);
  const [pracas, setPracas]                 = useState(0);
  const [valorPraca, setValorPraca]         = useState(8.0);
  const [busy, setBusy]                     = useState(false);

  const custoCombustivel  = ((distancia * 2) / consumo) * precoCombustivel;
  const custoPedagio      = pracas * valorPraca * 2;
  const totalCustos       = custoCombustivel + custoPedagio;
  const lucroLiquido      = repasse - totalCustos;
  const margem            = (lucroLiquido / (valorServico || 1)) * 100;

  const margemColor =
    margem >= 30 ? "text-brand-green" : margem >= 10 ? "text-yellow-400" : "text-red-400";
  const margemRingColor =
    margem >= 30 ? "ring-brand-green/40" : margem >= 10 ? "ring-yellow-400/40" : "ring-red-400/40";

  // ── Supabase actions ──────────────────────────────────────────────────

  async function handleAccept() {
    if (!service) {
      // Legacy mock fallback
      setBusy(true);
      await new Promise((r) => setTimeout(r, 1000));
      router.push("/tecnico/chamados");
      return;
    }
    setBusy(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { showToast("Sessão expirada. Faça login novamente.", "error"); setBusy(false); return; }

      const { error } = await supabase
        .from("service_requests")
        .update({
          technician_id: user.id,
          status: "accepted",
          accepted_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("status", "pending"); // race-condition guard

      if (error) {
        showToast("Este chamado já foi aceito por outro técnico.", "error");
        setTimeout(() => router.push("/tecnico/chamados"), 1800);
      } else {
        showToast("Chamado aceito! O cliente foi notificado.", "success");
        setTimeout(() => router.push("/tecnico/chamados"), 1600);
      }
    } catch {
      showToast("Erro inesperado. Tente novamente.", "error");
    } finally {
      setBusy(false);
    }
  }

  async function handleStartService() {
    setBusy(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("service_requests")
        .update({ status: "in_progress" })
        .eq("id", id)
        .eq("status", "accepted");

      if (error) {
        showToast("Erro ao iniciar serviço.", "error");
      } else {
        showToast("Serviço iniciado!", "success");
        setTimeout(() => router.refresh(), 800);
      }
    } catch {
      showToast("Erro inesperado.", "error");
    } finally {
      setBusy(false);
    }
  }

  const numInput =
    "w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-white text-sm " +
    "focus:outline-none focus:ring-2 focus:ring-brand-green placeholder:text-white/40";

  return (
    <div className="space-y-6">
      {toast && <Toast key={toast.key} message={toast.message} type={toast.type} onClose={hideToast} />}

      {/* ── Info do chamado ── */}
      <div className="card space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-brand-muted mb-1">Serviço #{id.slice(0, 8).toUpperCase()}</p>
            <p className="font-heading font-bold text-brand-dark text-lg">{cidade}</p>
          </div>
          <span className="flex-shrink-0 bg-brand-green/10 text-brand-green text-xs font-semibold px-3 py-1.5 rounded-full">
            {fmt(valorServico)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="flex items-start gap-2.5">
            <MapPin size={16} className="text-brand-muted mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-brand-dark">{endereco}</p>
              <p className="text-xs text-brand-muted">{cidade}</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Calendar size={16} className="text-brand-muted mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-brand-dark">{dataAgendada}</p>
              <p className="text-xs text-brand-muted capitalize">{periodo}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Sun size={16} className="text-brand-muted flex-shrink-0" />
            <p className="text-sm text-brand-dark">
              <span className="font-semibold">{modulos}</span> módulos
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock size={16} className="text-brand-muted flex-shrink-0" />
            <p className="text-sm text-brand-dark">
              ~<span className="font-semibold">{tempo}h</span> estimadas
            </p>
          </div>
        </div>

        {observacoes && (
          <div className="bg-brand-bg rounded-xl px-4 py-3 text-sm text-brand-muted">
            <span className="font-semibold text-brand-dark">Obs: </span>
            {observacoes}
          </div>
        )}
      </div>

      {/* ── Calculadora de custos ── */}
      <div className="bg-brand-dark rounded-2xl p-6 space-y-6">
        <div>
          <h2 className="font-heading font-bold text-white text-lg">⚡ Simule seu lucro real</h2>
          <p className="text-white/50 text-xs mt-1">
            Edite os campos para ver se o chamado compensa antes de aceitar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Distância estimada (km)",   value: distancia,        setter: setDistancia,    step: 0.5  },
            { label: "Consumo do veículo (km/l)", value: consumo,          setter: setConsumo,      step: 0.5  },
            { label: "Preço do combustível (R$/l)",value: precoCombustivel, setter: setPrecoComb,   step: 0.01 },
            { label: "Praças de pedágio (qtd)",   value: pracas,           setter: setPracas,       step: 1    },
          ].map(({ label, value, setter, step }) => (
            <div key={label}>
              <label className="block text-xs font-medium text-white/70 mb-1.5">{label}</label>
              <input
                type="number"
                min={0}
                step={step}
                value={value}
                onChange={(e) => setter(parseFloat(e.target.value) || 0)}
                className={numInput}
              />
            </div>
          ))}
          {pracas > 0 && (
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">Valor por praça (R$)</label>
              <input
                type="number"
                min={0}
                step={0.5}
                value={valorPraca}
                onChange={(e) => setValorPraca(parseFloat(e.target.value) || 0)}
                className={numInput}
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">Tempo estimado</label>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
              <Clock size={14} className="text-white/40" />
              <span className="text-white text-sm font-medium">{tempo}h</span>
              <span className="text-white/40 text-xs">({modulos} módulos)</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-5 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Combustível (ida + volta)</span>
            <span className="text-white font-medium">{fmt(custoCombustivel)}</span>
          </div>
          {custoPedagio > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Pedágio (ida + volta)</span>
              <span className="text-white font-medium">{fmt(custoPedagio)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm border-t border-white/10 pt-3">
            <span className="text-white/70">Total de custos</span>
            <span className="text-red-400 font-semibold">− {fmt(totalCustos)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Repasse bruto (85%)</span>
            <span className="text-white font-medium">{fmt(repasse)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Comissão plataforma (15%)</span>
            <span className="text-red-400 font-medium">− {fmt(comissao)}</span>
          </div>

          <div className={`flex items-center justify-between bg-white/5 ring-1 ${margemRingColor} rounded-xl px-4 py-4 mt-2`}>
            <div>
              <p className="text-xs text-white/50 mb-0.5">Lucro líquido estimado</p>
              <p className={`font-heading font-extrabold text-2xl ${margemColor}`}>{fmt(lucroLiquido)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/50 mb-0.5">Margem</p>
              <p className={`font-heading font-extrabold text-2xl ${margemColor}`}>{margem.toFixed(1)}%</p>
            </div>
          </div>

          {margem < 10 && (
            <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
              <AlertTriangle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm font-medium">⚠️ Margem baixa — avalie antes de aceitar.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Action buttons ── */}
      <div className="card space-y-3">
        <div className="flex items-center justify-between bg-brand-bg rounded-xl px-4 py-3">
          <span className="text-sm text-brand-muted">💵 Lucro estimado se aceitar</span>
          <span className={`font-heading font-extrabold text-xl ${
            margem >= 30 ? "text-brand-green" : margem >= 10 ? "text-yellow-600" : "text-red-600"
          }`}>
            {fmt(lucroLiquido)}
            <span className="text-xs font-normal ml-1 opacity-70">({margem.toFixed(1)}%)</span>
          </span>
        </div>

        {/* Available — show Accept/Decline */}
        {status === "pending" && (
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" size="lg" className="w-full" onClick={() => router.back()} disabled={busy}>
              Recusar
            </Button>
            <Button variant="primary" size="lg" className="w-full" loading={busy} onClick={handleAccept}>
              {busy ? "Aceitando…" : "✓ Aceitar chamado"}
              {!busy && <ArrowRight size={16} />}
            </Button>
          </div>
        )}

        {/* Accepted — show Start Service */}
        {status === "accepted" && (
          <Button variant="primary" size="lg" className="w-full" loading={busy} onClick={handleStartService}>
            <Play size={16} />
            {busy ? "Iniciando…" : "Iniciar Serviço"}
          </Button>
        )}

        {/* In progress — show Complete Service */}
        {status === "in_progress" && (
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => router.push(`/tecnico/conclusao/${id}`)}
          >
            <CheckCircle2 size={16} />
            Concluir Serviço →
          </Button>
        )}

        {/* Completed */}
        {status === "completed" && (
          <div className="text-center py-2">
            <p className="text-emerald-600 font-semibold text-sm">✅ Serviço concluído</p>
          </div>
        )}
      </div>
    </div>
  );
}
