import type { Metadata } from "next";

export const metadata: Metadata = { title: "Usuários — Admin" };

export default function UsuariosPage() {
  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold text-brand-dark mb-6">Usuários</h1>
      <div className="card text-center py-12">
        <p className="text-brand-muted text-sm">
          Lista de clientes e técnicos cadastrados aparecerá aqui.
        </p>
      </div>
    </div>
  );
}
