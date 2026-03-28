import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Sun, ArrowRight, Clock } from "lucide-react";

export const metadata: Metadata = { title: "Chamados disponíveis — Técnico" };

// Mock data — substituir por query Supabase (servicos WHERE status='pending' AND cidade = tecnico.cidade)
const chamados = [
  {
    id: "cham-001",
    cliente: "João Silva",
    endereco: "Rua das Flores, 123",
    cidade: "Jaraguá do Sul, SC",
    modulos: 24,
    valorServico: 300,
    repasse: 255,
    dataAgendada: "30/03/2026",
    periodo: "manhã",
    distanciaKm: 12,
    urgente: false,
  },
  {
    id: "cham-002",
    cliente: "Empresa Solar Ltda.",
    endereco: "Av. Industrial, 500",
    cidade: "Pomerode, SC",
    modulos: 48,
    valorServico: 520,
    repasse: 442,
    dataAgendada: "31/03/2026",
    periodo: "manhã",
    distanciaKm: 34,
    urgente: true,
  },
  {
    id: "cham-003",
    cliente: "Maria Oliveira",
    endereco: "Rua do Sol, 77",
    cidade: "Jaraguá do Sul, SC",
    modulos: 8,
    valorServico: 180,
    repasse: 153,
    dataAgendada: "01/04/2026",
    periodo: "tarde",
    distanciaKm: 5,
    urgente: false,
  },
];

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ChamadosPage() {
  return (
    <div className="page-container space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-brand-dark">Chamados disponíveis</h1>
        <p className="text-brand-muted text-sm mt-1">
          {chamados.length} chamados na sua cidade · Analise os custos antes de aceitar
        </p>
      </div>

      <div className="space-y-4">
        {chamados.map((c) => (
          <Link
            key={c.id}
            href={`/tecnico/chamados/${c.id}`}
            className="card hover:shadow-card-hover transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
          >
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-heading font-bold text-brand-dark">{c.cliente}</span>
                {c.urgente && (
                  <span className="text-xs bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded-full">
                    Urgente
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-brand-muted">
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} /> {c.endereco} — {c.cidade}
                </span>
                <span className="flex items-center gap-1.5">
                  <Sun size={13} /> {c.modulos} módulos
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} /> {c.dataAgendada}, {c.periodo}
                </span>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-1 flex-shrink-0">
              <div className="text-right">
                <p className="text-xs text-brand-muted">Repasse</p>
                <p className="font-heading font-bold text-brand-dark text-lg">{fmt(c.repasse)}</p>
                <p className="text-xs text-brand-muted">{c.distanciaKm} km</p>
              </div>
              <ArrowRight
                size={18}
                className="text-brand-muted group-hover:text-brand-green transition-colors"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
