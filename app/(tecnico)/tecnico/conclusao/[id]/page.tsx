import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ConclusaoCliente, { type PrevistoData } from "@/components/tecnico/ConclusaoCliente";

export const metadata: Metadata = { title: "Concluir serviço — Técnico" };

// Mock — substituir por getServiceById(params.id) via Supabase
// Os valores de "previsto" virão do que foi calculado na calculadora de custos
// (idealmente persistidos em localStorage ou na própria tabela de serviços)
const mockServico = {
  id: "cham-001",
  modulos: 24,
  endereco: "Rua das Flores, 123 — Jaraguá do Sul, SC",
  valorServico: 300,
};

const mockPrevisto: PrevistoData = {
  valorServico: 300,
  repasse: 255,       // 85%
  custoCombustivel: 14.4,  // 12km × 2 / 10km/l × R$6
  custoPedagio: 0,
  totalCustos: 14.4,
  lucroLiquido: 240.6,
  margem: 80.2,
};

export default async function ConclusaoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="page-container max-w-2xl">
      <Link
        href="/tecnico/agenda"
        className="inline-flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-dark transition-colors mb-6"
      >
        <ArrowLeft size={15} /> Voltar à agenda
      </Link>

      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-brand-dark">Concluir serviço</h1>
        <p className="text-brand-muted text-sm mt-1">{mockServico.endereco}</p>
      </div>

      <ConclusaoCliente
        servicoId={id}
        modulos={mockServico.modulos}
        endereco={mockServico.endereco}
        previsto={mockPrevisto}
      />
    </div>
  );
}
