import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import HeaderCliente from "@/components/layout/HeaderCliente";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export const metadata: Metadata = {
  title: "Área do Cliente",
};

export default async function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  let userName = user.email?.split("@")[0] ?? "Usuário";
  let userRole: string | null = null;

  try {
    const admin = createServiceClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("full_name, role")
      .eq("user_id", user.id)
      .single();
    if (profile) {
      userRole = profile.role ?? null;
      userName = profile.full_name ?? userName;
    }
  } catch { /* fallback — don't block render */ }

  // redirect() OUTSIDE try/catch so NEXT_REDIRECT isn't swallowed
  if (userRole === "tecnico") redirect("/tecnico");
  if (userRole === "admin")   redirect("/admin");

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <HeaderCliente userName={userName} notificationCount={2} />
      <main className="flex-1">{children}</main>
      <footer className="bg-brand-dark text-white/50 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-center space-y-1">
          <p>© {new Date().getFullYear()} PainelClean — Todos os direitos reservados.</p>
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
