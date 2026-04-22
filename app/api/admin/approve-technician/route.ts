import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(req: NextRequest) {
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

  const { tecnicoUserId } = await req.json();
  if (!tecnicoUserId) {
    return NextResponse.json({ error: "tecnicoUserId é obrigatório" }, { status: 400 });
  }

  const admin = createServiceClient();

  const { error } = await admin
    .from("profiles")
    .update({ approved_at: new Date().toISOString() })
    .eq("user_id", tecnicoUserId)
    .eq("role", "tecnico");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
