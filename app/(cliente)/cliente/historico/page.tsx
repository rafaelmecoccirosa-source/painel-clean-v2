import type { Metadata } from "next";
import ServicoCard from "@/components/cliente/ServicoCard";
import { ServiceRequest } from "@/lib/types";

export const metadata: Metadata = { title: "Histórico de Serviços" };

// Mock — will be replaced with Supabase query
const mockServicos: ServiceRequest[] = [
  {
    id: "a1b2c3d4-0000-0000-0000-000000000001",
    client_id: "user-1",
    tecnico_id: "tech-1",
    status: "confirmed",
    panel_count: 12,
    address: "Rua das Flores, 123",
    city: "São Paulo",
    state: "SP",
    scheduled_date: "2026-04-05T10:00:00Z",
    completed_date: null,
    price: 280.0,
    notes: null,
    created_at: "2026-03-20T14:00:00Z",
    updated_at: "2026-03-22T09:00:00Z",
  },
  {
    id: "a1b2c3d4-0000-0000-0000-000000000002",
    client_id: "user-1",
    tecnico_id: null,
    status: "pending",
    panel_count: 8,
    address: "Av. Brasil, 500",
    city: "Campinas",
    state: "SP",
    scheduled_date: null,
    completed_date: null,
    price: null,
    notes: null,
    created_at: "2026-03-25T11:30:00Z",
    updated_at: "2026-03-25T11:30:00Z",
  },
  {
    id: "a1b2c3d4-0000-0000-0000-000000000003",
    client_id: "user-1",
    tecnico_id: "tech-2",
    status: "completed",
    panel_count: 20,
    address: "Rua do Sol, 77",
    city: "Ribeirão Preto",
    state: "SP",
    scheduled_date: "2026-02-15T08:00:00Z",
    completed_date: "2026-02-15T12:00:00Z",
    price: 450.0,
    notes: null,
    created_at: "2026-02-10T10:00:00Z",
    updated_at: "2026-02-15T12:30:00Z",
  },
];

export default function HistoricoPage() {
  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold text-brand-dark mb-6">
        Histórico de serviços
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockServicos.map((s) => (
          <ServicoCard key={s.id} servico={s} />
        ))}
      </div>
    </div>
  );
}
