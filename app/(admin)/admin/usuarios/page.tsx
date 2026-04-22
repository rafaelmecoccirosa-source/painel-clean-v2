export const dynamic = "force-dynamic";

import { createServiceClient } from "@/lib/supabase/service";
import UsuariosClient from "@/components/admin/UsuariosClient";

export const metadata = { title: "Usuários — Admin | Painel Clean" };

export default async function UsuariosPage() {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, user_id, full_name, role, city, phone, created_at, approved_at")
    .order("created_at", { ascending: false });

  const hasError = !!error;

  return <UsuariosClient profiles={data ?? []} hasError={hasError} />;
}
