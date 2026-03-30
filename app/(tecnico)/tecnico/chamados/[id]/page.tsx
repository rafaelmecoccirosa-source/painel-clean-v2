import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ChamadoDetalheCliente from "@/components/tecnico/ChamadoDetalheCliente";
import { createClient } from "@/lib/supabase/server";
import type { ServiceRequestDB } from "@/lib/types";

export const metadata: Metadata = { title: "Detalhe do chamado — Técnico" };

export default async function ChamadoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let service: ServiceRequestDB | null = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("service_requests")
      .select("*")
      .eq("id", id)
      .single();
    service = data as ServiceRequestDB | null;
  } catch {
    // table may not exist yet — fall through to not-found
  }

  if (!service) {
    return (
      <div className="page-container">
        <div className="card text-center py-16">
          <p className="text-brand-muted">Chamado não encontrado.</p>
          <Link
            href="/tecnico/chamados"
            className="text-brand-green text-sm font-medium hover:underline mt-3 inline-block"
          >
            ← Voltar aos chamados
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container max-w-2xl">
      <Link
        href="/tecnico/chamados"
        className="inline-flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-dark transition-colors mb-6"
      >
        <ArrowLeft size={15} /> Voltar aos chamados
      </Link>

      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-brand-dark">Detalhe do chamado</h1>
        <p className="text-brand-muted text-sm mt-1">
          {service.city} · {service.module_count} módulos · #{id.slice(0, 8).toUpperCase()}
        </p>
      </div>

      <ChamadoDetalheCliente service={service} />
    </div>
  );
}
