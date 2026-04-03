export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import UsuariosClient from "@/components/admin/UsuariosClient";

export const metadata = { title: "Usuários — Admin | Painel Clean" };

export default async function UsuariosPage() {
  let profiles: any[] = [];
  let isReal = false;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      profiles = data;
      isReal = true;
      console.log("[admin/usuarios] real data:", data.length, "profiles");
    } else if (error) {
      console.warn("[admin/usuarios] query error:", error.message);
    }
  } catch (err) {
    console.warn("[admin/usuarios] fetch error:", err);
  }

  return <UsuariosClient profiles={profiles} isReal={isReal} />;
}
