import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import HeaderAdmin from "@/components/layout/HeaderAdmin";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Painel Admin",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userName = "Administrador";
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("user_id", user.id)
        .single();
      if (profile?.role === "cliente") redirect("/cliente");
      if (profile?.role === "tecnico") redirect("/tecnico");
      userName = profile?.full_name ?? user.email?.split("@")[0] ?? "Administrador";
    }
  } catch { /* fallback to default */ }

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <HeaderAdmin userName={userName} />
      <main className="flex-1">{children}</main>
      <footer className="bg-brand-dark text-white/50 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-center space-y-1">
          <p>© {new Date().getFullYear()} PainelClean — Painel Administrativo.</p>
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
