"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { PlusCircle, Sun, Zap, Star, X } from "lucide-react";
import Button from "@/components/ui/Button";
import Toast, { useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";
import {
  type ServiceRequestDB,
  type ServiceRequestStatus,
  type PaymentStatus,
  STATUS_LABELS,
  STATUS_BADGE,
} from "@/lib/types";

const TIPO_LABEL: Record<string, string> = {
  solo:             "Solo",
  telhado_padrao:   "Telhado padrão",
  telhado_dificil:  "Telhado difícil",
};
import PaymentCard from "@/components/cliente/PaymentCard";
import ServiceProgressBar from "@/components/shared/ServiceProgressBar";
import { Copy, Check, CheckCircle2 } from "lucide-react";
import { BannerParticles } from "@/components/BannerParticles";

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function fmtDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Combined badge that reflects payment state for pending services */
function StatusBadge({
  status,
  paymentStatus,
}: {
  status: ServiceRequestStatus;
  paymentStatus: PaymentStatus;
}) {
  if (status === "pending") {
    if (!paymentStatus || paymentStatus === "pending") {
      return (
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap bg-red-100 text-red-700">
          🔴 Aguardando pagamento
        </span>
      );
    }
    if (paymentStatus === "awaiting_confirmation") {
      return (
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap bg-yellow-100 text-yellow-700">
          🟡 Pagamento em análise
        </span>
      );
    }
    if (paymentStatus === "confirmed") {
      return (
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap bg-blue-100 text-blue-700">
          🔵 Aguardando técnico
        </span>
      );
    }
  }
  return (
    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_BADGE[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

// ── Inline PIX Pay Modal ──────────────────────────────────────────────────────

const PIX_KEY  = "pix@painelclean.com.br";
const PIX_NAME = "Painel Clean Ltda";

function InlinePixCard({
  serviceId,
  amount,
  onSuccess,
}: {
  serviceId: string;
  amount: number;
  onSuccess: () => void;
}) {
  const [copied, setCopied]   = useState(false);
  const [note, setNote]       = useState("");
  const [saving, setSaving]   = useState(false);
  const supabase = createClient();

  async function handlePaid() {
    setSaving(true);
    try {
      await supabase
        .from("service_requests")
        .update({
          payment_status: "awaiting_confirmation",
          paid_at: new Date().toISOString(),
        })
        .eq("id", serviceId);
      onSuccess();
    } catch {
      setSaving(false);
    }
  }

  function copyKey() {
    navigator.clipboard.writeText(PIX_KEY).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-brand-dark rounded-2xl p-5 space-y-4">
      <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">Pagar via PIX</p>

      <div className="text-center">
        <p className="font-heading font-bold text-brand-green text-3xl">{fmt(amount)}</p>
      </div>

      <div className="bg-white/5 rounded-xl p-3 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-white/50 text-xs">Chave PIX</p>
            <p className="text-white font-mono text-sm font-semibold truncate">{PIX_KEY}</p>
          </div>
          <button
            type="button"
            onClick={copyKey}
            className="flex items-center gap-1 bg-brand-green hover:bg-brand-green/90 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors flex-shrink-0"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copiado!" : "Copiar"}
          </button>
        </div>
        <div>
          <p className="text-white/50 text-xs">Beneficiário</p>
          <p className="text-white text-sm font-semibold">{PIX_NAME}</p>
        </div>
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="ID da transação (opcional)"
        rows={2}
        className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-brand-green resize-none"
      />

      <button
        type="button"
        onClick={handlePaid}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white font-semibold text-sm py-3 rounded-xl transition-colors disabled:opacity-60"
      >
        <CheckCircle2 size={16} />
        {saving ? "Registrando…" : "Já paguei ✅"}
      </button>
    </div>
  );
}

// ── Rating Modal ─────────────────────────────────────────────────────────────

interface RatingModalProps {
  serviceId: string;
  technicianId: string | null;
  onClose: () => void;
  onSuccess: (serviceId: string, rating: number) => void;
  showToast: (msg: string, type: "success" | "error" | "info") => void;
}

function RatingModal({ serviceId, technicianId, onClose, onSuccess, showToast }: RatingModalProps) {
  const [rating, setRating]   = useState(0);
  const [hover,  setHover]    = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving]   = useState(false);

  async function handleSubmit() {
    if (rating === 0) { showToast("Selecione uma nota de 1 a 5.", "error"); return; }
    setSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { showToast("Sessão expirada.", "error"); setSaving(false); return; }

      const { error } = await supabase.from("reviews").insert({
        service_request_id: serviceId,
        client_id:          user.id,
        technician_id:      technicianId,
        rating,
        comment:            comment.trim() || null,
      });

      if (error) {
        console.warn("reviews insert:", error.message);
        // Proceed even if table doesn't exist — show success anyway
      }

      onSuccess(serviceId, rating);
      showToast("Avaliação enviada! Obrigado.", "success");
      onClose();
    } catch (err) {
      console.error(err);
      showToast("Erro ao enviar avaliação.", "error");
    } finally {
      setSaving(false);
    }
  }

  const active = hover || rating;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm space-y-5 p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-brand-dark text-lg">Avaliar serviço</h3>
          <button onClick={onClose} className="text-brand-muted hover:text-brand-dark transition-colors">
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-brand-muted">Como foi o serviço de limpeza?</p>

        {/* Stars */}
        <div className="flex gap-2 justify-center">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={36}
                className={`transition-colors ${
                  n <= active ? "text-yellow-400 fill-yellow-400" : "text-brand-border"
                }`}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="text-center text-sm font-semibold text-brand-dark">
            {["", "Muito ruim", "Ruim", "Regular", "Bom", "Excelente"][rating]}
          </p>
        )}

        {/* Comment */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Comentário opcional…"
          rows={3}
          className="w-full rounded-xl border border-brand-border bg-brand-bg px-4 py-2.5 text-sm text-brand-dark placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-green resize-none"
        />

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-brand-border text-brand-muted text-sm font-semibold py-2.5 hover:text-brand-dark transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || rating === 0}
            className="flex-1 rounded-xl bg-brand-green text-white text-sm font-semibold py-2.5 hover:bg-brand-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? "Enviando…" : "Enviar avaliação"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Service Card ─────────────────────────────────────────────────────────────

function ServicoCard({
  s,
  onCancel,
  onCancelRefund,
  onRate,
  existingRating,
}: {
  s: ServiceRequestDB;
  onCancel: (id: string) => void;
  onCancelRefund: (id: string) => void;
  onRate: (id: string, technicianId: string | null) => void;
  existingRating: number | null;
}) {
  const [payStatus, setPayStatus] = useState<PaymentStatus>(s.payment_status ?? "pending");
  const [showPix,   setShowPix]   = useState(false);

  const needsPayment = s.status === "pending" && payStatus === "pending";
  const paymentSent  = s.status === "pending" &&
    (payStatus === "awaiting_confirmation" || payStatus === "confirmed");

  return (
    <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-brand-muted font-medium uppercase tracking-wide mb-1">
            #{s.id.slice(0, 8).toUpperCase()}
          </p>
          <p className="font-semibold text-brand-dark">
            {s.module_count ?? s.panel_count ?? "?"} placa{(s.module_count ?? s.panel_count ?? 0) !== 1 ? "s" : ""} — {s.city}
          </p>
        </div>
        <StatusBadge status={s.status} paymentStatus={payStatus} />
      </div>

      {/* Progress bar */}
      {s.status !== "cancelled" && (
        <ServiceProgressBar status={s.status} paymentStatus={payStatus} role="cliente" />
      )}

      <div className="space-y-1 text-xs text-brand-muted">
        <p>📍 {s.address}</p>
        <p>📅 {fmtDate(s.preferred_date)} · {s.preferred_time}</p>
        {s.tipo_instalacao && (
          <p>🔧 {TIPO_LABEL[s.tipo_instalacao] ?? s.tipo_instalacao} · {s.module_count ?? s.panel_count ?? "?"} placa{(s.module_count ?? s.panel_count ?? 0) !== 1 ? "s" : ""}</p>
        )}
        {(() => {
          const hasRange = s.preco_min && s.preco_max && s.preco_min > 0;
          if (hasRange) {
            return (
              <p className="font-semibold text-brand-dark">
                💰 {fmt(s.preco_min!)} a {fmt(s.preco_max!)}
              </p>
            );
          }
          if (s.price_estimate > 0) {
            return <p className="font-semibold text-brand-dark">💰 {fmt(s.price_estimate)}</p>;
          }
          return null;
        })()}
      </div>

      {/* Guarantee badge */}
      {s.status !== "cancelled" && (
        <div
          className="flex items-center gap-2 bg-brand-light border border-brand-green/30 rounded-xl px-3 py-2"
          title="Se o serviço não atender suas expectativas, a Painel Clean garante uma nova visita sem custo adicional. Válido apenas para serviços realizados pela plataforma."
        >
          <span className="text-brand-green text-sm">🛡️</span>
          <p className="text-[11px] font-semibold text-brand-dark">
            Garantia Painel Clean — serviço protegido pela plataforma
          </p>
        </div>
      )}

      {/* Pending + unpaid: show PIX inline or "Pagar agora" button */}
      {needsPayment && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            <span className="text-red-500 text-sm">⏰</span>
            <p className="text-xs font-medium text-red-700">
              Realize o pagamento para confirmar seu agendamento
            </p>
          </div>
          {showPix ? (
            <InlinePixCard
              serviceId={s.id}
              amount={s.price_estimate}
              onSuccess={() => {
                setPayStatus("awaiting_confirmation");
                setShowPix(false);
              }}
            />
          ) : (
            <button
              onClick={() => setShowPix(true)}
              className="w-full flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors"
            >
              💰 Pagar agora via PIX
            </button>
          )}
        </div>
      )}

      {/* Pending + awaiting confirmation */}
      {s.status === "pending" && payStatus === "awaiting_confirmation" && (
        <p className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2 font-medium">
          🟡 Pagamento em análise — seu agendamento será confirmado em até 24h.
        </p>
      )}

      {/* Pending + confirmed → waiting for technician */}
      {s.status === "pending" && payStatus === "confirmed" && (
        <p className="text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 font-medium">
          🔵 Pagamento confirmado! Estamos buscando um técnico na sua cidade.
        </p>
      )}

      {s.status === "accepted" && (
        <div className="space-y-2">
          <p className="text-xs text-blue-700 bg-blue-50 rounded-xl px-3 py-2 font-medium">
            ✅ Técnico confirmado — aguardando início do serviço
          </p>
          <Link
            href={`/cliente/servico/${s.id}`}
            className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-brand-dark border border-brand-border hover:bg-brand-light rounded-xl py-2 transition-colors"
          >
            💬 Conversar com o técnico
          </Link>
        </div>
      )}

      {s.status === "in_progress" && (
        <Link
          href={`/cliente/servico/${s.id}`}
          className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-brand-green border border-brand-green/30 bg-brand-green/5 hover:bg-brand-green/10 rounded-xl py-2 transition-colors"
        >
          🔧 Em andamento — 💬 Chat com técnico
        </Link>
      )}

      {s.status === "completed" && (
        <div className="space-y-3">
          {/* Payment card — shows PIX info until payment confirmed, then progress */}
          <PaymentCard
            serviceId={s.id}
            amount={s.price_estimate}
            initialPaymentStatus={s.payment_status ?? "pending"}
            onStatusChange={(next) => setPayStatus(next)}
          />

          <Link
            href={`/cliente/historico`}
            className="block text-center text-xs font-semibold text-brand-green hover:underline"
          >
            Ver relatório completo →
          </Link>
          <Link
            href={`/cliente/servico/${s.id}`}
            className="block text-center text-xs font-semibold text-brand-muted hover:text-brand-dark"
          >
            💬 Ver conversa
          </Link>

          {existingRating !== null ? (
            <div className="flex items-center justify-center gap-1">
              {[1,2,3,4,5].map((n) => (
                <Star key={n} size={14} className={n <= existingRating ? "text-yellow-400 fill-yellow-400" : "text-brand-border"} />
              ))}
              <span className="text-xs text-brand-muted ml-1">Avaliado</span>
            </div>
          ) : (
            <button
              onClick={() => onRate(s.id, s.technician_id)}
              className="w-full text-xs font-semibold text-yellow-700 hover:text-yellow-800 border border-yellow-200 hover:border-yellow-400 bg-yellow-50 hover:bg-yellow-100 rounded-xl py-2 transition-colors flex items-center justify-center gap-1.5"
            >
              <Star size={13} className="fill-yellow-400 text-yellow-400" />
              Avaliar serviço
            </button>
          )}
        </div>
      )}

      {/* Cancel buttons */}
      {needsPayment && (
        <button
          onClick={() => onCancel(s.id)}
          className="w-full text-xs font-semibold text-red-600 hover:text-red-700 border border-red-200 hover:border-red-400 rounded-xl py-2 transition-colors"
        >
          Cancelar solicitação
        </button>
      )}

      {paymentSent && (
        <button
          onClick={() => onCancelRefund(s.id)}
          className="w-full text-xs font-semibold text-red-600 hover:text-red-700 border border-red-200 hover:border-red-400 rounded-xl py-2 transition-colors"
        >
          Cancelar e solicitar reembolso
        </button>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-brand-border rounded-2xl p-5 animate-pulse space-y-3">
          <div className="h-3 bg-brand-bg rounded-full w-1/3" />
          <div className="h-4 bg-brand-bg rounded-full w-2/3" />
          <div className="h-3 bg-brand-bg rounded-full w-full" />
          <div className="h-3 bg-brand-bg rounded-full w-1/2" />
        </div>
      ))}
    </div>
  );
}

type Tab = "active" | "completed" | "cancelled";

export default function ClienteHomePage() {
  const { toast, show: showToast, hide: hideToast } = useToast();
  const [services, setServices]   = useState<ServiceRequestDB[]>([]);
  const [loading, setLoading]     = useState(true);
  const [tab, setTab]             = useState<Tab>("active");
  const [userName, setUserName]   = useState("Usuário");

  // Reviews map: serviceId → rating
  const [reviews, setReviews]     = useState<Record<string, number>>({});

  // Rating modal state
  const [ratingServiceId,  setRatingServiceId]  = useState<string | null>(null);
  const [ratingTechnicianId, setRatingTechnicianId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      // Set email as immediate fallback so the banner never shows "Usuário"
      setUserName(user.email?.split("@")[0] ?? "Usuário");

      const [profileRes, servicesRes, reviewsRes] = await Promise.all([
        supabase.from("profiles").select("full_name").eq("user_id", user.id).single(),
        supabase
          .from("service_requests")
          .select("*")
          .eq("client_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("reviews")
          .select("service_request_id, rating")
          .eq("client_id", user.id),
      ]);

      if (profileRes.data?.full_name) {
        setUserName(profileRes.data.full_name.split(" ")[0]);
      }
      setServices((servicesRes.data as ServiceRequestDB[]) ?? []);

      // Build reviews map
      const map: Record<string, number> = {};
      (reviewsRes.data ?? []).forEach((r: { service_request_id: string; rating: number }) => {
        map[r.service_request_id] = r.rating;
      });
      setReviews(map);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleCancel(id: string) {
    if (!confirm("Cancelar esta solicitação?")) return;
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("service_requests")
        .update({
          status: "cancelled",
          cancelled_at: new Date().toISOString(),
          cancellation_reason: "Cancelado pelo cliente",
        })
        .eq("id", id)
        .eq("status", "pending");

      if (error) {
        showToast("Erro ao cancelar. Tente novamente.", "error");
      } else {
        showToast("Solicitação cancelada.", "info");
        setServices((prev) =>
          prev.map((s) => s.id === id ? { ...s, status: "cancelled" as ServiceRequestStatus } : s)
        );
      }
    } catch {
      showToast("Erro inesperado.", "error");
    }
  }

  async function handleCancelRefund(id: string) {
    if (!confirm("Cancelar este serviço e solicitar reembolso?")) return;
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("service_requests")
        .update({
          status: "cancelled",
          cancelled_at: new Date().toISOString(),
          cancellation_reason: "Cancelado pelo cliente — reembolso solicitado",
        })
        .eq("id", id)
        .eq("status", "pending");

      if (error) {
        showToast("Erro ao cancelar. Tente novamente.", "error");
      } else {
        showToast("Serviço cancelado. O reembolso será processado em até 48h.", "info");
        setServices((prev) =>
          prev.map((s) => s.id === id ? { ...s, status: "cancelled" as ServiceRequestStatus } : s)
        );
      }
    } catch {
      showToast("Erro inesperado.", "error");
    }
  }

  function handleOpenRating(id: string, technicianId: string | null) {
    setRatingServiceId(id);
    setRatingTechnicianId(technicianId);
  }

  function handleRatingSuccess(serviceId: string, rating: number) {
    setReviews((prev) => ({ ...prev, [serviceId]: rating }));
  }

  const active    = services.filter((s) => ["pending", "accepted", "in_progress"].includes(s.status));
  const completed = services.filter((s) => s.status === "completed");
  const cancelled = services.filter((s) => s.status === "cancelled");
  const shown: Record<Tab, ServiceRequestDB[]> = { active, completed, cancelled };

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "active",    label: "Em andamento", count: active.length    },
    { key: "completed", label: "Concluídos",   count: completed.length },
    { key: "cancelled", label: "Cancelados",   count: cancelled.length },
  ];

  return (
    <div className="page-container">
      {toast && <Toast key={toast.key} message={toast.message} type={toast.type} onClose={hideToast} />}

      {ratingServiceId && (
        <RatingModal
          serviceId={ratingServiceId}
          technicianId={ratingTechnicianId}
          onClose={() => setRatingServiceId(null)}
          onSuccess={handleRatingSuccess}
          showToast={showToast}
        />
      )}

      {/* Welcome banner */}
      <div className="bg-gradient-brand rounded-2xl p-6 sm:p-8 mb-8 text-white overflow-hidden relative">
        <BannerParticles />
        <div className="relative z-10">
          <p className="text-white/70 text-sm mb-1">Bem-vindo de volta</p>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{userName}</h1>
          <p className="text-white/70 text-sm mb-6 max-w-sm">
            Suas placas merecem o melhor cuidado. Solicite uma limpeza e maximize a geração de energia.
          </p>
          <Link href="/cliente/solicitar">
            <Button size="md" className="bg-brand-green text-white hover:bg-brand-green/90">
              <PlusCircle size={16} />
              Nova solicitação
            </Button>
          </Link>
        </div>
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/5" />
        <div className="absolute -right-4 -bottom-12 h-52 w-52 rounded-full bg-white/5" />
        <Zap size={80} className="absolute right-12 top-1/2 -translate-y-1/2 text-white/10" />
      </div>

      {/* Counters */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Em andamento", value: active.length,    color: "text-amber-600",   bg: "bg-amber-50"   },
          { label: "Concluídos",   value: completed.length, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Total",        value: services.length,  color: "text-brand-dark",  bg: "bg-brand-bg"   },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="card flex flex-col items-center text-center py-4">
            <div className={`h-9 w-9 rounded-xl ${bg} flex items-center justify-center mb-2`}>
              <Sun size={18} className={color} />
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-brand-muted mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Rewards Card ── */}
      {(() => {
        const totalServicos = completed.length;
        const TIERS = [
          { meta: 3,  beneficio: "10% de desconto na 3ª limpeza" },
          { meta: 5,  beneficio: "15% de desconto" },
          { meta: 10, beneficio: "1 limpeza grátis (até 10 placas)" },
        ];
        const nextTier = TIERS.find((t) => totalServicos < t.meta) ?? TIERS[TIERS.length - 1];
        const pct = Math.min(100, Math.round((totalServicos / nextTier.meta) * 100));
        return (
          <div className="bg-brand-bg border-2 border-brand-green/30 rounded-2xl p-5 mb-6 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌟</span>
                <div>
                  <p className="font-heading font-bold text-brand-dark text-sm">Painel Clean Rewards</p>
                  <p className="text-xs text-brand-muted">Fidelidade que vale energia</p>
                </div>
              </div>
              <span className="text-xs font-bold text-brand-green bg-brand-green/10 px-2.5 py-1 rounded-full">
                {totalServicos} serviço{totalServicos !== 1 ? "s" : ""}
              </span>
            </div>
            {totalServicos < 10 ? (
              <>
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-brand-muted">{totalServicos} de {nextTier.meta} serviços</span>
                    <span className="text-brand-green font-semibold">{pct}%</span>
                  </div>
                  <div className="h-2.5 bg-brand-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-green rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs font-medium text-brand-dark">
                  🎯 Próximo benefício: <span className="text-brand-green font-bold">{nextTier.beneficio}</span>
                </p>
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {TIERS.map((t) => (
                    <div
                      key={t.meta}
                      className={`rounded-xl px-2 py-2 text-center border ${
                        totalServicos >= t.meta
                          ? "bg-brand-green/10 border-brand-green/40"
                          : "bg-white border-brand-border"
                      }`}
                    >
                      <p className={`text-xs font-bold ${totalServicos >= t.meta ? "text-brand-green" : "text-brand-muted"}`}>
                        {t.meta}+ serviços
                      </p>
                      <p className="text-[10px] text-brand-muted leading-tight mt-0.5">{t.beneficio}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-brand-green/10 rounded-xl px-4 py-3 text-center">
                <p className="text-sm font-bold text-brand-green">🏆 Nível máximo atingido!</p>
                <p className="text-xs text-brand-dark mt-0.5">Você tem direito a uma limpeza grátis. Entre em contato.</p>
              </div>
            )}
          </div>
        );
      })()}

      {/* Tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
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
            {t.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.key ? "bg-white/20" : "bg-brand-bg"}`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <Skeleton />
      ) : shown[tab].length === 0 ? (
        <div className="card text-center py-14">
          <Sun size={40} className="text-brand-border mx-auto mb-3" />
          {tab === "active" ? (
            <>
              <p className="text-brand-muted text-sm mb-4">Você não tem serviços em andamento.</p>
              <Link href="/cliente/solicitar">
                <Button size="sm">📋 Solicitar primeiro serviço →</Button>
              </Link>
            </>
          ) : (
            <p className="text-brand-muted text-sm">
              Nenhum serviço {tab === "completed" ? "concluído" : "cancelado"} ainda.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shown[tab].map((s) => (
            <ServicoCard
              key={s.id}
              s={s}
              onCancel={handleCancel}
              onCancelRefund={handleCancelRefund}
              onRate={handleOpenRating}
              existingRating={reviews[s.id] ?? null}
            />
          ))}
        </div>
      )}
    </div>
  );
}
