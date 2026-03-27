import type { Metadata } from "next";
import HeaderTecnico from "@/components/layout/HeaderTecnico";

export const metadata: Metadata = {
  title: "Área do Técnico",
};

export default function TecnicoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <HeaderTecnico userName="Carlos Técnico" notificationCount={3} />
      <main className="flex-1">{children}</main>
      <footer className="bg-brand-dark text-white/50 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-center">
          © {new Date().getFullYear()} PainelClean — Área do Técnico.
        </div>
      </footer>
    </div>
  );
}
