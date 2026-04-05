import type { Metadata } from "next";
import Link from "next/link";
import HeaderTecnico from "@/components/layout/HeaderTecnico";
import { createClient } from "@/lib/supabase/server";
import { PresencePing } from "@/components/PresencePing";

export const metadata: Metadata = {
  title: "Área do Técnico",
};

export default async function TecnicoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userName = "Técnico";
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", user.id)
        .single();
      userName = profile?.full_name ?? user.email?.split("@")[0] ?? "Técnico";
    }
  } catch { /* fallback to default */ }

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <PresencePing />
      <HeaderTecnico userName={userName} notificationCount={3} />
      <main className="flex-1">{children}</main>
      <footer className="bg-brand-dark text-white/50 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-center space-y-1">
          <p>© {new Date().getFullYear()} PainelClean — Área do Técnico.</p>
          <p>
            <Link href="/termos" className="text-white/40 hover:text-white/70 underline transition-colors">
              Termos de Uso
            </Link>
            {" · "}
            <span>Jaraguá do Sul, SC</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
