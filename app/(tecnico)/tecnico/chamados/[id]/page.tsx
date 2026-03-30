import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ChamadoDetalheCliente from "@/components/tecnico/ChamadoDetalheCliente";

export const metadata: Metadata = { title: "Detalhe do chamado — Técnico" };

export default async function ChamadoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="page-container max-w-2xl">
      <Link
        href="/tecnico/chamados"
        className="inline-flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-dark transition-colors mb-6"
      >
        <ArrowLeft size={15} /> Voltar aos chamados
      </Link>

      <ChamadoDetalheCliente id={id} />
    </div>
  );
}
