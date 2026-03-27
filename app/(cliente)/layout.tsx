import type { Metadata } from "next";
import HeaderCliente from "@/components/layout/HeaderCliente";

export const metadata: Metadata = {
  title: "Área do Cliente",
};

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      {/* In production, pass real user data from Supabase session */}
      <HeaderCliente userName="Rafael Mecoci" notificationCount={2} />
      <main className="flex-1">{children}</main>
      <footer className="bg-brand-dark text-white/50 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-center">
          © {new Date().getFullYear()} PainelClean — Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
