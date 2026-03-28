import type { Metadata } from "next";

export const metadata: Metadata = { title: "Relatórios — Admin" };

export default function RelatoriosPage() {
  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold text-brand-dark mb-6">Relatórios</h1>
      <div className="card text-center py-12">
        <p className="text-brand-muted text-sm">
          Relatórios e métricas da plataforma aparecerão aqui.
        </p>
      </div>
    </div>
  );
}
