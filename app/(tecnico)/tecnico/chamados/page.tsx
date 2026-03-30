"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { MapPin, Sun, Clock, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { type ServiceRequestDB, type ServiceRequestStatus, STATUS_BADGE, estimateHours } from "@/lib/types";

type Tab = "available" | "mine" | "done";

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function fmtDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function StatusBadge({ status }: { status: ServiceRequestStatus }) {
  const labels: Record<string, string> = {
    pending:     "Disponível",
    accepted:    "Aceito",
    in_progress: "Em andamento",
    completed:   "Concluído",
  };
  return (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_BADGE[status]}`}>
      {labels[status] ?? status}
    </span>
  );
}

function Skeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-brand-border rounded-2xl p-5 animate-pulse space-y-3">
          <div className="h-4 bg-brand-bg rounded-full w-1/3" />
          <div className="h-3 bg-brand-bg rounded-full w-2/3" />
          <div className="h-3 bg-brand-bg rounded-full w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default function ChamadosPage() {
  const [tab, setTab] = useState<Tab>("available");
  const [available, setAvailable] = useState<ServiceRequestDB[]>([]);
  const [mine, setMine] = useState<ServiceRequestDB[]>([]);
  const [done, setDone] = useState<ServiceRequestDB[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const [availRes, mineRes, doneRes] = await Promise.all([
        supabase
          .from("service_requests")
          .select("*")
          .eq("status", "pending")
          .order("preferred_date", { ascending: true }),
        supabase
          .from("service_requests")
          .select("*")
          .eq("technician_id", user.id)
          .in("status", ["accepted", "in_progress"])
          .order("preferred_date", { ascending: true }),
        supabase
          .from("service_requests")
          .select("*")
          .eq("technician_id", user.id)
          .eq("status", "completed")
          .order("completed_at", { ascending: false })
          .limit(20),
      ]);

      setAvailable((availRes.data as ServiceRequestDB[]) ?? []);
      setMine((mineRes.data as ServiceRequestDB[]) ?? []);
      setDone((doneRes.data as ServiceRequestDB[]) ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const tabs: { key: Tab; label: string; emoji: string; count: number }[] = [
    { key: "available", label: "Disponíveis", emoji: "🔔", count: available.length },
    { key: "mine",      label: "Meus",        emoji: "📋", count: mine.length      },
    { key: "done",      label: "Concluídos",  emoji: "✅", count: done.length      },
  ];

  const shown: Record<Tab, ServiceRequestDB[]> = { available, mine, done };

  function renderCard(c: ServiceRequestDB, isAvailable: boolean) {
    const repasse = c.price_estimate * 0.85;
    const horas = estimateHours(c.module_count);
    const displayAddress = isAvailable
      ? c.address.split(",")[0] + " (endereço completo após aceitar)"
      : c.address;

    return (
      <Link
        key={c.id}
        href={`/tecnico/chamados/${c.id}`}
        className="card hover:shadow-card-hover transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
      >
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={c.status} />
            <span className="text-xs font-mono text-brand-muted">#{c.id.slice(0, 8).toUpperCase()}</span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-brand-muted">
            <span className="flex items-center gap-1.5">
              <MapPin size={13} /> {displayAddress} — {c.city}
            </span>
            <span className="flex items-center gap-1.5">
              <Sun size={13} /> {c.module_count} módulos
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} /> {fmtDate(c.preferred_date)}, {c.preferred_time}
            </span>
          </div>
        </div>
        <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-1 flex-shrink-0">
          <div className="text-right">
            <p className="text-xs text-brand-muted">Repasse</p>
            <p className="font-heading font-bold text-brand-dark text-lg">{fmt(repasse)}</p>
            <p className="text-xs text-brand-muted">~{horas}h estimadas</p>
          </div>
          <ArrowRight size={18} className="text-brand-muted group-hover:text-brand-green transition-colors" />
        </div>
      </Link>
    );
  }

  return (
    <div className="page-container space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-brand-dark">Chamados</h1>
        <p className="text-brand-muted text-sm mt-1">Gerencie seus chamados disponíveis e em andamento</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              tab === t.key
                ? "bg-brand-dark text-white"
                : "bg-white border border-brand-border text-brand-muted hover:text-brand-dark"
            }`}
          >
            <span>{t.emoji}</span> {t.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.key ? "bg-white/20" : "bg-brand-bg"}`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <Skeleton />
      ) : shown[tab].length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-2xl mb-3">
            {tab === "available" ? "🔔" : tab === "mine" ? "📋" : "✅"}
          </p>
          <p className="text-brand-muted text-sm">
            {tab === "available"
              ? "Nenhum chamado disponível no momento."
              : tab === "mine"
              ? "Você não tem chamados em andamento."
              : "Nenhum chamado concluído ainda."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {shown[tab].map((c) => renderCard(c, tab === "available"))}
        </div>
      )}
    </div>
  );
}
