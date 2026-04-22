export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/service";
import ServicosView, { type Servico, type Tecnico } from "./ServicosView";

export const metadata: Metadata = { title: "Serviços — Admin | Painel Clean" };

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR");
}

export default async function ServicosPage() {
  const admin = createServiceClient();

  const [servicosRes, tecnicosRes] = await Promise.all([
    admin
      .from("service_requests")
      .select("id, status, city, module_count, price_estimate, preferred_date, created_at, client_id, technician_id")
      .order("created_at", { ascending: false })
      .limit(200),
    admin
      .from("profiles")
      .select("user_id, full_name, city")
      .eq("role", "tecnico")
      .order("full_name", { ascending: true }),
  ]);

  const raw = servicosRes.data ?? [];
  const tecnicosRaw = (tecnicosRes.data ?? []) as Tecnico[];

  // Batch-fetch client and technician names
  const clientIds = Array.from(new Set(raw.map((s: any) => s.client_id).filter(Boolean))) as string[];
  const techIds   = Array.from(new Set(raw.map((s: any) => s.technician_id).filter(Boolean))) as string[];
  const allIds    = Array.from(new Set([...clientIds, ...techIds]));
  const nameMap: Record<string, string> = {};
  if (allIds.length > 0) {
    const { data: profiles } = await admin.from("profiles").select("user_id, full_name").in("user_id", allIds);
    (profiles ?? []).forEach((p: any) => { nameMap[p.user_id] = p.full_name ?? "—"; });
  }

  const servicos: Servico[] = raw.map((s: any) => ({
    id:          s.id,
    data:        fmtDate(s.preferred_date ?? s.created_at),
    cidade:      s.city ?? "—",
    clienteNome: nameMap[s.client_id] ?? s.client_id?.slice(0, 8) ?? "—",
    tecnicoNome: s.technician_id ? (nameMap[s.technician_id] ?? s.technician_id.slice(0, 8)) : "—",
    modulos:     s.module_count ?? 0,
    valor:       s.status === "completed" ? (s.price_estimate ?? 0) : 0,
    comissao:    s.status === "completed" ? (s.price_estimate ?? 0) * 0.25 : 0,
    status:      s.status ?? "pending",
  }));

  return <ServicosView servicos={servicos} tecnicos={tecnicosRaw} />;
}
