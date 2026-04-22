import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(req: NextRequest) {
  // Verify caller is admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const { servicoId, tecnicoId } = await req.json();
  if (!servicoId || !tecnicoId) {
    return NextResponse.json({ error: "servicoId e tecnicoId são obrigatórios" }, { status: 400 });
  }

  const admin = createServiceClient();

  const { error } = await admin
    .from("service_requests")
    .update({
      technician_id: tecnicoId,
      status: "accepted",
      updated_at: new Date().toISOString(),
    })
    .eq("id", servicoId)
    .eq("status", "pending");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Return tech name for optimistic UI update
  const { data: techProfile } = await admin
    .from("profiles")
    .select("full_name")
    .eq("user_id", tecnicoId)
    .maybeSingle();

  return NextResponse.json({ ok: true, tecnicoNome: techProfile?.full_name ?? "—" });
}
