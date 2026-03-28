import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ChamadoDetalheCliente, { type ChamadoData } from "@/components/tecnico/ChamadoDetalheCliente";

export const metadata: Metadata = { title: "Detalhe do chamado — Técnico" };

// Mock — substituir por getServiceById(params.id) via Supabase
const mockChamados: Record<string, ChamadoData> = {
  "cham-001": {
    id: "cham-001",
    cliente: "João Silva",
    endereco: "Rua das Flores, 123",
    cidade: "Jaraguá do Sul, SC",
    modulos: 24,
    valorServico: 300,
    dataAgendada: "30/03/2026",
    periodo: "manhã",
    distanciaKm: 12,
    tempoEstimadoHoras: 2.5,
    observacoes: "Portão azul, tocar campainha.",
  },
  "cham-002": {
    id: "cham-002",
    cliente: "Empresa Solar Ltda.",
    endereco: "Av. Industrial, 500",
    cidade: "Pomerode, SC",
    modulos: 48,
    valorServico: 520,
    dataAgendada: "31/03/2026",
    periodo: "manhã",
    distanciaKm: 34,
    tempoEstimadoHoras: 3.5,
  },
  "cham-003": {
    id: "cham-003",
    cliente: "Maria Oliveira",
    endereco: "Rua do Sol, 77",
    cidade: "Jaraguá do Sul, SC",
    modulos: 8,
    valorServico: 180,
    dataAgendada: "01/04/2026",
    periodo: "tarde",
    distanciaKm: 5,
    tempoEstimadoHoras: 1.5,
  },
};

export default async function ChamadoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const chamado = mockChamados[id];

  if (!chamado) {
    return (
      <div className="page-container">
        <div className="card text-center py-16">
          <p className="text-brand-muted">Chamado não encontrado.</p>
          <Link href="/tecnico/chamados" className="text-brand-green text-sm font-medium hover:underline mt-3 inline-block">
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
          Analise os custos estimados antes de aceitar.
        </p>
      </div>

      <ChamadoDetalheCliente chamado={chamado} />
    </div>
  );
}
