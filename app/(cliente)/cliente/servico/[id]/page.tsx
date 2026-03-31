"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Clock, Sun } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { ServiceRequestDB } from "@/lib/types";
import ChatBox from "@/components/shared/ChatBox";
import ServiceProgressBar from "@/components/shared/ServiceProgressBar";

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function fmtDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

const STATUS_LABEL: Record<string, string> = {
  pending:     "🟡 Aguardando técnico",
  accepted:    "🔵 Técnico confirmado",
  in_progress: "🟠 Em andamento",
  completed:   "🟢 Concluído",
  cancelled:   "🔴 Cancelado",
};

const STATUS_COLOR: Record<string, string> = {
  pending:     "bg-amber-100 text-amber-700",
  accepted:    "bg-blue-100 text-blue-700",
  in_progress: "bg-orange-100 text-orange-700",
  completed:   "bg-emerald-100 text-emerald-700",
  cancelled:   "bg-red-100 text-red-600",
};

const CHAT_AVAILABLE = ["accepted", "in_progress", "completed"];

function Skeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="card space-y-4">
        <div className="h-5 bg-brand-bg rounded-full w-1/3" />
        <div className="h-4 bg-brand-bg rounded-full w-2/3" />
        <div className="h-4 bg-brand-bg rounded-full w-1/2" />
      </div>
      <div className="h-64 bg-brand-bg rounded-2xl" />
    </div>
  );
}

export default function ClienteServicoPage() {
  const params = useParams<{ id: string }>();
  const id     = params?.id ?? "";

  const [service,     setService]     = useState<ServiceRequestDB | null>(null);
  const [userId,      setUserId]      = useState("");
  const [userName,    setUserName]    = useState("Você");
  const [loading,     setLoading]     = useState(true);

  const load = useCallback(async () => {
    try {
      const supabase = createClient();
      const [{ data: { user } }, { data: svc }, { data: profile }] = await Promise.all([
        supabase.auth.getUser(),
        supabase.from("service_requests").select("*").eq("id", id).single(),
        supabase.from("profiles").select("full_name").eq("user_id", (await supabase.auth.getUser()).data.user?.id ?? "").single(),
      ]);

      setUserId(user?.id ?? "");
      setUserName(profile?.full_name?.split(" ")[0] ?? "Você");
      setService(svc as ServiceRequestDB | null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="page-container max-w-2xl">
        <div className="h-8 w-32 bg-brand-bg rounded-full animate-pulse mb-6" />
        <Skeleton />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="page-container max-w-2xl">
        <div className="card text-center py-16">
          <p className="text-brand-muted">Serviço não encontrado.</p>
          <Link href="/cliente" className="text-brand-green text-sm font-medium hover:underline mt-3 inline-block">
            ← Voltar
          </Link>
        </div>
      </div>
    );
  }

  const chatAvailable = CHAT_AVAILABLE.includes(service.status);

  return (
    <div className="page-container max-w-2xl space-y-6">
      <Link
        href="/cliente"
        className="inline-flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-dark transition-colors"
      >
        <ArrowLeft size={15} /> Voltar ao painel
      </Link>

      <div>
        <h1 className="font-heading text-2xl font-bold text-brand-dark">Detalhes do serviço</h1>
        <p className="text-brand-muted text-sm mt-1">
          {service.city} · {service.module_count} placas · #{id.slice(0, 8).toUpperCase()}
        </p>
      </div>

      {/* Service info card */}
      <div className="card space-y-4">
        <div className="flex items-start justify-between gap-3">
          <p className="font-heading font-bold text-brand-dark text-lg">{service.city}</p>
          <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap ${STATUS_COLOR[service.status] ?? "bg-brand-bg text-brand-dark"}`}>
            {STATUS_LABEL[service.status] ?? service.status}
          </span>
        </div>

        {/* Progress */}
        <ServiceProgressBar status={service.status} paymentStatus={service.payment_status ?? "pending"} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="flex items-start gap-2.5">
            <MapPin size={15} className="text-brand-muted mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-brand-dark">{service.address}</p>
              <p className="text-xs text-brand-muted">{service.city}</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Calendar size={15} className="text-brand-muted mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-brand-dark">{fmtDate(service.preferred_date)}</p>
              <p className="text-xs text-brand-muted">{service.preferred_time}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Sun size={15} className="text-brand-muted flex-shrink-0" />
            <p className="text-sm text-brand-dark">
              <span className="font-semibold">{service.module_count}</span> placas
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock size={15} className="text-brand-muted flex-shrink-0" />
            <p className="text-sm font-semibold text-brand-green">{fmt(service.price_estimate)}</p>
          </div>
        </div>

        {service.notes && (
          <div className="bg-brand-bg rounded-xl px-4 py-3 text-sm text-brand-muted">
            <span className="font-semibold text-brand-dark">Obs: </span>
            {service.notes}
          </div>
        )}
      </div>

      {/* Chat */}
      {chatAvailable && userId ? (
        <ChatBox
          serviceId={id}
          currentUserId={userId}
          currentUserName={userName}
          otherUserName="Técnico"
        />
      ) : (
        <div className="card text-center py-8 space-y-2">
          <p className="text-2xl">💬</p>
          <p className="text-sm font-semibold text-brand-dark">Chat indisponível</p>
          <p className="text-xs text-brand-muted">
            A conversa com o técnico é liberada após a aceitação do chamado.
          </p>
        </div>
      )}
    </div>
  );
}
