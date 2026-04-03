import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import HeaderTecnico from "@/components/layout/HeaderTecnico";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export const metadata: Metadata = {
  title: "Área do Técnico",
};

export default async function TecnicoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Get the authenticated user (session client, safe)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // 2. Fetch profile via service role (bypasses RLS — server-side only)
  let userName = user.email?.split("@")[0] ?? "Técnico";
  let userRole: string | null = null;

  try {
    const admin = createServiceClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("full_name, role")
      .eq("user_id", user.id)
      .single();

    if (profile) {
      userRole = profile.role;
      userName = profile.full_name ?? userName;
    }
  } catch { /* service client unavailable — proceed without role guard */ }

  // 3. Role guard OUTSIDE try/catch so redirect() exception is not swallowed
  if (userRole === "cliente") redirect("/cliente");
  if (userRole === "admin")   redirect("/admin");

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
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
