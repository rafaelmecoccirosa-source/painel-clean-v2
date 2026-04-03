"use client";

import { useState, useEffect, useCallback } from "react";
import { Sun, Star, Camera, ChevronDown, ChevronUp, CheckCircle2, Clock, MapPin, Hash } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { ServiceRequestDB, ServiceReport, Review } from "@/lib/types";
import PaymentCard from "@/components/cliente/PaymentCard";
import ServiceProgressBar from "@/components/shared/ServiceProgressBar";

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function fmtDate(iso: string) {
  const d = iso.includes("T") ? new Date(iso) : new Date(iso + "T00:00:00");
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

const CHECKLIST_LABELS: Record<string, string> = {
  visual_inspection: "Inspeção visual das placas",
  connector_check:   "Verificação de conectores",
  cleaning_complete: "Limpeza concluída",
  damage_test:       "Teste visual de danos",
};

const CONDITION_LABEL: Record<string, string> = {
  bom:               "Bom",
  regular:           "Regular",
  necessita_atencao: "Necessita atenção",
};

const CONDITION_COLOR: Record<string, string> = {
  bom:               "bg-emerald-100 text-emerald-700",
  regular:           "bg-yellow-100 text-yellow-700",
  necessita_atencao: "bg-red-100 text-red-700",
};

// ── Mocked data for when Supabase tables don't exist ─────────────────────────

const MOCK_HISTORICO: HistoricoItem[] = [
  {
    id: "demo-0001-0000-0000-000000000001",
    client_id:      "demo-client",
    technician_id:  "demo-tech",
    city:           "Jaraguá do Sul",
    address:        "Rua das Palmeiras, 420",
    module_count:   20,
    price_estimate: 300,
    preferred_date: "2026-03-10",
    preferred_time: "Manhã (8h-12h)",
    status:         "completed",
    notes:          null,
    created_at:     "2026-03-08T09:00:00Z",
    updated_at:     "2026-03-10T12:00:00Z",
    accepted_at:    "2026-03-09T10:00:00Z",
    completed_at:   "2026-03-10T11:45:00Z",
    cancelled_at:   null,
    cancellation_reason: null,
    report: {
      id: "report-0001",
      service_request_id: "demo-0001-0000-0000-000000000001",
      photos_before: [],
      photos_after:  [],
      checklist: {
        visual_inspection: true,
        connector_check:   true,
        cleaning_complete: true,
        damage_test:       false,
      },
      observations:      "Módulos com sujeira leve de poeira. Limpeza realizada com sucesso.",
      general_condition: "bom",
      created_at:        "2026-03-10T11:45:00Z",
    },
    review: {
      id:                 "review-0001",
      service_request_id: "demo-0001-0000-0000-000000000001",
      client_id:          "demo-client",
      technician_id:      "demo-tech",
      rating:             5,
      comment:            "Excelente serviço, muito pontual e profissional!",
      created_at:         "2026-03-10T14:00:00Z",
    },
  },
  {
    id: "demo-0002-0000-0000-000000000002",
    client_id:      "demo-client",
    technician_id:  "demo-tech",
    city:           "Pomerode",
    address:        "Av. Hermann Weege, 55",
    module_count:   12,
    price_estimate: 300,
    preferred_date: "2026-02-14",
    preferred_time: "Tarde (13h-17h)",
    status:         "completed",
    notes:          "Telhado com inclinação acentuada",
    created_at:     "2026-02-12T08:00:00Z",
    updated_at:     "2026-02-14T16:00:00Z",
    accepted_at:    "2026-02-13T09:00:00Z",
    completed_at:   "2026-02-14T15:30:00Z",
    cancelled_at:   null,
    cancellation_reason: null,
    report: {
      id: "report-0002",
      service_request_id: "demo-0002-0000-0000-000000000002",
      photos_before: [],
      photos_after:  [],
      checklist: {
        visual_inspection: true,
        connector_check:   true,
        cleaning_complete: true,
        damage_test:       true,
      },
      observations:      "1 módulo com microfissura identificada. Recomendada substituição preventiva.",
      general_condition: "regular",
      created_at:        "2026-02-14T15:30:00Z",
    },
    review: null,
  },
];

// ── Types ─────────────────────────────────────────────────────────────────────

type HistoricoItem = ServiceRequestDB & {
  report: ServiceReport | null;
  review: Review | null;
};

// ── Photo grid ────────────────────────────────────────────────────────────────

function PhotoRow({ urls, label }: { urls: string[]; label: string }) {
  if (urls.length === 0) {
    return (
      <div>
        <p className="text-xs font-semibold text-brand-muted uppercase tracking-wide mb-2">{label}</p>
        <div className="flex items-center justify-center h-20 rounded-xl bg-brand-bg border border-dashed border-brand-border">
          <p className="text-xs text-brand-muted">Fotos não disponíveis</p>
        </div>
      </div>
    );
  }
  return (
    <div>
      <p className="text-xs font-semibold text-brand-muted uppercase tracking-wide mb-2">{label}</p>
      <div className="grid grid-cols-3 gap-2">
        {urls.map((url, i) => (
          <a key={i} href={url} target="_blank" rel="noopener noreferrer"
            className="aspect-square rounded-xl overflow-hidden bg-brand-bg border border-brand-border hover:opacity-90 transition-opacity">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
          </a>
        ))}
      </div>
    </div>
  );
}

// ── Report Drawer ─────────────────────────────────────────────────────────────

function ReportDrawer({ report }: { report: ServiceReport }) {
  const checklist = (report.checklist ?? {}) as Record<string, boolean>;
  const cond      = report.general_condition ?? "bom";

  return (
    <div className="space-y-5 pt-1">
      <PhotoRow urls={report.photos_before ?? []} label="Fotos — antes da limpeza" />
      <PhotoRow urls={report.photos_after  ?? []} label="Fotos — depois da limpeza" />

      <div>
        <p className="text-xs font-semibold text-brand-muted uppercase tracking-wide mb-2">Checklist de inspeção</p>
        <div className="space-y-1.5">
          {Object.entries(CHECKLIST_LABELS).map(([key, label]) => (
            <div key={key} className="flex items-center gap-2.5">
              <div className={`h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                checklist[key] ? "bg-brand-green" : "bg-brand-border"
              }`}>
                {checklist[key] && (
                  <svg viewBox="0 0 10 8" fill="none" className="w-2.5 h-2.5">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className={`text-sm ${checklist[key] ? "text-brand-dark" : "text-brand-muted line-through"}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <p className="text-xs font-semibold text-brand-muted uppercase tracking-wide">Condição geral:</p>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${CONDITION_COLOR[cond] ?? "bg-brand-bg text-brand-dark"}`}>
          {CONDITION_LABEL[cond] ?? cond}
        </span>
      </div>

      {report.observations && (
        <div>
          <p className="text-xs font-semibold text-brand-muted uppercase tracking-wide mb-1">Observações do técnico</p>
          <p className="text-sm text-brand-dark bg-brand-bg rounded-xl px-4 py-3 border border-brand-border">
            {report.observations}
          </p>
        </div>
      )}
    </div>
  );
}

// ── History Card ─────────────────────────────────────────────────────────────

function HistoricoCard({ item }: { item: HistoricoItem }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-brand-muted mb-1">
              <Hash size={11} />
              <span className="font-mono">{item.id.slice(0, 8).toUpperCase()}</span>
            </div>
            <p className="font-semibold text-brand-dark">
              {item.module_count} placa{item.module_count !== 1 ? "s" : ""} — {item.city}
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 whitespace-nowrap">
            🟢 Concluído
          </span>
        </div>

        {/* Progress bar */}
        <ServiceProgressBar status={item.status} paymentStatus={item.payment_status ?? "pending"} role="cliente" />

        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-brand-muted">
          <span className="flex items-center gap-1">
            <MapPin size={11} /> {item.address.split(",")[0]}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} /> {item.completed_at ? fmtDate(item.completed_at) : fmtDate(item.preferred_date)}
          </span>
          <span className="font-semibold text-brand-dark">
            {item.preco_min && item.preco_max && item.preco_min > 0
              ? `${fmt(item.preco_min)} a ${fmt(item.preco_max)}`
              : fmt(item.price_estimate)}
          </span>
          <span>{item.preferred_time}</span>
        </div>

        {/* Payment card */}
        <PaymentCard
          serviceId={item.id}
          amount={item.price_estimate}
          initialPaymentStatus={item.payment_status ?? "pending"}
        />

        {item.review ? (
          <div className="flex items-center gap-1.5 flex-wrap">
            {[1,2,3,4,5].map((n) => (
              <Star key={n} size={14} className={n <= item.review!.rating ? "text-yellow-400 fill-yellow-400" : "text-brand-border"} />
            ))}
            {item.review.comment && (
              <span className="text-xs text-brand-muted italic truncate max-w-[200px]">"{item.review.comment}"</span>
            )}
          </div>
        ) : (
          <p className="text-xs text-brand-muted italic">Sem avaliação registrada</p>
        )}
      </div>

      {item.report ? (
        <>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-3 border-t border-brand-border bg-brand-bg text-sm font-semibold text-brand-dark hover:bg-brand-light transition-colors"
          >
            <span className="flex items-center gap-2">
              <Camera size={14} className="text-brand-green" />
              Ver relatório fotográfico
            </span>
            {expanded
              ? <ChevronUp size={16} className="text-brand-muted" />
              : <ChevronDown size={16} className="text-brand-muted" />}
          </button>
          {expanded && (
            <div className="px-5 pb-5 pt-4 border-t border-brand-border">
              <ReportDrawer report={item.report} />
            </div>
          )}
        </>
      ) : (
        <div className="px-5 py-3 border-t border-brand-border bg-brand-bg">
          <p className="text-xs text-brand-muted flex items-center gap-1.5">
            <Camera size={12} />
            Relatório fotográfico não disponível
          </p>
        </div>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-brand-border rounded-2xl p-5 animate-pulse space-y-3">
          <div className="flex justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-3 bg-brand-bg rounded-full w-1/4" />
              <div className="h-4 bg-brand-bg rounded-full w-1/2" />
            </div>
            <div className="h-6 w-20 bg-brand-bg rounded-full" />
          </div>
          <div className="h-3 bg-brand-bg rounded-full w-3/4" />
          <div className="h-3 bg-brand-bg rounded-full w-1/3" />
        </div>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HistoricoPage() {
  const [items,   setItems]   = useState<HistoricoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReal,  setIsReal]  = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setItems(MOCK_HISTORICO); setLoading(false); return; }

      const { data: services, error: svcError } = await supabase
        .from("service_requests")
        .select("*")
        .eq("client_id", user.id)
        .eq("status", "completed")
        .order("completed_at", { ascending: false });

      // Only fall back to mock data on a real query error (e.g. table doesn't exist).
      // An empty array means the user has no completed services — show empty state.
      if (svcError) {
        setItems(MOCK_HISTORICO);
        setLoading(false);
        return;
      }

      if (!services || services.length === 0) {
        setItems([]);
        setIsReal(true);
        setLoading(false);
        return;
      }

      const ids = (services as ServiceRequestDB[]).map((s) => s.id);

      const [reportsRes, reviewsRes] = await Promise.all([
        supabase.from("service_reports").select("*").in("service_request_id", ids),
        supabase.from("reviews").select("*").in("service_request_id", ids),
      ]);

      const reportsMap: Record<string, ServiceReport> = {};
      (reportsRes.data ?? []).forEach((r: ServiceReport) => {
        reportsMap[r.service_request_id] = r;
      });

      const reviewsMap: Record<string, Review> = {};
      (reviewsRes.data ?? []).forEach((r: Review) => {
        reviewsMap[r.service_request_id] = r;
      });

      const merged: HistoricoItem[] = (services as ServiceRequestDB[]).map((s) => ({
        ...s,
        report: reportsMap[s.id] ?? null,
        review: reviewsMap[s.id] ?? null,
      }));

      setItems(merged);
      setIsReal(true);
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const totalPaid = items.reduce((acc, i) => acc + i.price_estimate, 0);
  const avgRating = (() => {
    const rated = items.filter((i) => i.review?.rating);
    if (!rated.length) return null;
    return rated.reduce((acc, i) => acc + i.review!.rating, 0) / rated.length;
  })();

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-dark font-heading">Histórico de serviços</h1>
        <p className="text-sm text-brand-muted mt-1">Todos os serviços concluídos com relatórios fotográficos</p>
        {!isReal && !loading && (
          <span className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
            📊 Dados demonstrativos
          </span>
        )}
      </div>

      {!loading && items.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { icon: <CheckCircle2 size={18} className="text-emerald-600" />, bg: "bg-emerald-50", value: String(items.length), label: "Serviços" },
            { icon: <Sun size={18} className="text-brand-green" />,          bg: "bg-brand-light", value: fmt(totalPaid),          label: "Investido"    },
            { icon: <Star size={18} className="text-yellow-500" />,          bg: "bg-yellow-50",   value: avgRating !== null ? avgRating.toFixed(1) : "—", label: "Nota média" },
          ].map(({ icon, bg, value, label }) => (
            <div key={label} className="card text-center py-4">
              <div className={`h-9 w-9 rounded-xl ${bg} flex items-center justify-center mx-auto mb-2`}>{icon}</div>
              <p className="text-xl font-bold text-brand-dark truncate">{value}</p>
              <p className="text-xs text-brand-muted mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <Skeleton />
      ) : items.length === 0 ? (
        <div className="card text-center py-14">
          <Sun size={40} className="text-brand-border mx-auto mb-3" />
          <p className="text-brand-muted text-sm">Nenhum serviço concluído ainda.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => <HistoricoCard key={item.id} item={item} />)}
        </div>
      )}
    </div>
  );
}
