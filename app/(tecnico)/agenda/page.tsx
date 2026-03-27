import type { Metadata } from "next";

export const metadata: Metadata = { title: "Minha Agenda — Técnico" };

export default function AgendaPage() {
  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold text-brand-dark mb-6">Minha agenda</h1>
      <div className="card text-center py-12">
        <p className="text-brand-muted text-sm">
          Seus serviços agendados aparecerão aqui.
        </p>
      </div>
    </div>
  );
}
