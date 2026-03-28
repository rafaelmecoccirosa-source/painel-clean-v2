import type { Metadata } from "next";

export const metadata: Metadata = { title: "Serviços Disponíveis — Técnico" };

export default function ServicosDisponiveisPage() {
  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold text-brand-dark mb-6">
        Serviços disponíveis
      </h1>
      <div className="card text-center py-12">
        <p className="text-brand-muted text-sm">
          Pedidos de clientes disponíveis na sua região aparecerão aqui.
        </p>
      </div>
    </div>
  );
}
