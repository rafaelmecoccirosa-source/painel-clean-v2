"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ServiceRequestDB } from "@/lib/types";

function minutesSince(isoDate: string): number {
  return Math.floor((Date.now() - new Date(isoDate).getTime()) / 60000);
}

function urgencyLabel(mins: number): { emoji: string; label: string; cls: string } {
  if (mins >= 120) return { emoji: "💣", label: "Crítico — baixa liquidez", cls: "text-red-700 bg-red-50 border-red-300" };
  if (mins >= 60)  return { emoji: "🔴", label: "Urgente — considere aumentar preço", cls: "text-orange-700 bg-orange-50 border-orange-300" };
  return            { emoji: "⚠️", label: "Aguardando aceite", cls: "text-amber-700 bg-amber-50 border-amber-200" };
}

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

interface Props {
  services: ServiceRequestDB[];
}

export default function ServicosEscalationAlert({ services }: Props) {
  const [localServices, setLocalServices] = useState(services);
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }

  // Filter: confirmed + no technician + at least 30 min ago
  const unaccepted = localServices.filter((s) => {
    const mins = minutesSince(s.created_at);
    return (
      s.payment_status === "confirmed" &&
      !s.technician_id &&
      mins >= 30
    );
  }).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  if (unaccepted.length === 0) return null;

  async function handleEscalate(id: string, currentPrice: number, currentLevel: number) {
    setBusy(id);
    try {
      const supabase = createClient();
      const newPrice   = Math.round(currentPrice * 1.1);
      const newPrecoMin = Math.round(newPrice * 0.9);
      const newPrecoMax = Math.round(newPrice * 1.2);

      await supabase
        .from("service_requests")
        .update({
          price_estimate:   newPrice,
          preco_min:        newPrecoMin,
          preco_max:        newPrecoMax,
          escalation_level: currentLevel + 1,
          escalated_at:     new Date().toISOString(),
        })
        .eq("id", id);

      setLocalServices((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                price_estimate: newPrice,
                preco_min: newPrecoMin,
                preco_max: newPrecoMax,
                escalation_level: currentLevel + 1,
              }
            : s
        )
      );
      showToast(`✅ Preço aumentado para ${fmt(newPrice)}. Técnicos serão notificados.`);
    } catch {
      showToast("Erro ao atualizar preço. Tente novamente.");
    } finally {
      setBusy(null);
    }
  }

  async function handleLowLiquidity(id: string) {
    setBusy(id + "_liq");
    try {
      const supabase = createClient();
      await supabase
        .from("service_requests")
        .update({ notes: "[BAIXA LIQUIDEZ] Admin marcou — recrutar técnicos nesta cidade" })
        .eq("id", id);

      setLocalServices((prev) =>
        prev.map((s) =>
          s.id === id
            ? { ...s, notes: "[BAIXA LIQUIDEZ] Admin marcou — recrutar técnicos nesta cidade" }
            : s
        )
      );
      showToast("🔴 Baixa liquidez marcada. Recrute técnicos nessa cidade.");
    } catch {
      showToast("Erro ao marcar. Tente novamente.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="rounded-2xl border border-red-300 bg-red-50 px-5 py-4 space-y-4">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-brand-dark text-white text-sm font-semibold rounded-2xl px-5 py-3 shadow-xl max-w-sm">
          {toast}
        </div>
      )}

      <p className="text-xs font-bold text-red-700 uppercase tracking-widest">
        🔴 {unaccepted.length} serviço{unaccepted.length > 1 ? "s" : ""} aguardando técnico
      </p>

      <div className="space-y-3">
        {unaccepted.map((s) => {
          const mins = minutesSince(s.created_at);
          const urgency = urgencyLabel(mins);
          const escalationLevel = (s.escalation_level as number | null | undefined) ?? 0;
          const alreadyLowLiquidity = s.notes?.includes("BAIXA LIQUIDEZ");

          return (
            <div
              key={s.id}
              className={`rounded-xl border p-4 space-y-3 ${urgency.cls}`}
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-xs font-mono text-brand-muted mb-0.5">
                    #{s.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="font-semibold text-brand-dark text-sm">
                    {s.city} — {s.module_count} placas
                  </p>
                  <p className="text-xs text-brand-muted mt-0.5">{s.address.split(",")[0]}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${urgency.cls}`}>
                    {urgency.emoji} {Math.floor(mins / 60) > 0 ? `${Math.floor(mins / 60)}h${mins % 60 > 0 ? `${mins % 60}m` : ""}` : `${mins}min`} sem aceite
                  </span>
                  {escalationLevel > 0 && (
                    <p className="text-[10px] text-brand-muted mt-1">
                      Escalonado {escalationLevel}× — {fmt(s.price_estimate)}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleEscalate(s.id, s.price_estimate, escalationLevel)}
                  disabled={busy === s.id}
                  className="text-xs font-semibold bg-brand-dark text-white hover:bg-brand-dark/90 px-3 py-2 rounded-xl transition-colors disabled:opacity-50"
                >
                  {busy === s.id ? "Atualizando…" : `📈 Aumentar preço +10% → ${fmt(Math.round(s.price_estimate * 1.1))}`}
                </button>

                {!alreadyLowLiquidity && (
                  <button
                    onClick={() => handleLowLiquidity(s.id)}
                    disabled={busy === s.id + "_liq"}
                    className="text-xs font-semibold border border-red-400 text-red-700 hover:bg-red-100 px-3 py-2 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {busy === s.id + "_liq" ? "Marcando…" : "🚨 Marcar baixa liquidez"}
                  </button>
                )}

                {alreadyLowLiquidity && (
                  <span className="text-xs font-semibold bg-red-200 text-red-800 px-3 py-2 rounded-xl">
                    🚨 Baixa liquidez marcada
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-red-600">
        Ações manuais — você decide quando e como escalonar. Botões não são automáticos.
      </p>
    </div>
  );
}
