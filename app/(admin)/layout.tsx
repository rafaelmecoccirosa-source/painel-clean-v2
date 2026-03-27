import type { Metadata } from "next";
import HeaderAdmin from "@/components/layout/HeaderAdmin";

export const metadata: Metadata = {
  title: "Painel Admin",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <HeaderAdmin userName="Administrador" />
      <main className="flex-1">{children}</main>
      <footer className="bg-brand-dark text-white/50 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-center">
          © {new Date().getFullYear()} PainelClean — Painel Administrativo.
        </div>
      </footer>
    </div>
  );
}
