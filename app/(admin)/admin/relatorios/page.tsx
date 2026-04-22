export const dynamic = "force-dynamic";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import RelatoriosClient from "./RelatoriosClient";
import { createServiceClient } from "@/lib/supabase/service";

export const metadata = { title: "Relatórios — Admin | Painel Clean" };

const MES_LABELS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export interface MRRPonto { mes: string; valor: number }
export interface StatusCount { status: string; count: number }
export interface TopTecnico { nome: string; total: number }
export interface TopCidade { cidade: string; total: number }

export default async function RelatoriosPage() {
  const admin = createServiceClient();
  const now = new Date();
  const yearNow = now.getFullYear();
  const monthNow = now.getMonth();

  // 6-month window start
  const start6m = new Date(yearNow, monthNow - 5, 1).toISOString().slice(0, 10);

  const [subsRes, servicosRes] = await Promise.all([
    admin.from("subscriptions").select("started_at, price_monthly, status"),
    admin.from("service_requests").select("status, city, technician_id, preferred_date, price_estimate"),
  ]);

  const subs   = subsRes.data   ?? [];
  const servs  = servicosRes.data ?? [];

  // MRR por mês — últimos 6 meses
  // A subscription is active in month M if started_at <= end of M and status=active
  const mrr: MRRPonto[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(yearNow, monthNow - i, 1);
    const y = d.getFullYear();
    const m = d.getMonth();
    const endOfMonth = new Date(y, m + 1, 0).toISOString().slice(0, 10);
    const valor = subs
      .filter((s) => s.started_at && s.started_at.slice(0, 10) <= endOfMonth)
      .reduce((acc, s) => acc + (s.price_monthly ?? 0), 0);
    mrr.push({ mes: MES_LABELS[m], valor: Math.round(valor) });
  }

  // Serviços por status
  const statusMap: Record<string, number> = {};
  servs.forEach((s) => {
    statusMap[s.status] = (statusMap[s.status] ?? 0) + 1;
  });
  const statusCounts: StatusCount[] = Object.entries(statusMap)
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count);

  // Top técnicos (completed services)
  const techMap: Record<string, number> = {};
  servs.filter((s) => s.status === "completed" && s.technician_id).forEach((s) => {
    techMap[s.technician_id!] = (techMap[s.technician_id!] ?? 0) + 1;
  });
  const topTechIds = Object.entries(techMap).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([id]) => id);
  const techNames: Record<string, string> = {};
  if (topTechIds.length > 0) {
    const { data: profs } = await admin.from("profiles").select("user_id, full_name").in("user_id", topTechIds);
    (profs ?? []).forEach((p) => { if (p.user_id) techNames[p.user_id] = p.full_name ?? "—"; });
  }
  const topTecnicos: TopTecnico[] = topTechIds.map((id) => ({
    nome: techNames[id] ?? "—",
    total: techMap[id],
  }));

  // Top cidades
  const cidadeMap: Record<string, number> = {};
  servs.forEach((s) => {
    if (s.city) cidadeMap[s.city] = (cidadeMap[s.city] ?? 0) + 1;
  });
  const topCidades: TopCidade[] = Object.entries(cidadeMap)
    .map(([cidade, total]) => ({ cidade, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  // CSV data (all services last 6 months)
  const servicosCSV = servs.filter((s) => s.preferred_date && s.preferred_date >= start6m);

  return (
    <div className="page-container space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-brand-muted hover:text-brand-dark transition-colors" aria-label="Voltar">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-heading text-2xl font-bold text-brand-dark">📈 Relatórios</h1>
            <p className="text-brand-muted text-sm mt-0.5">Métricas reais da plataforma</p>
          </div>
        </div>
      </div>

      <RelatoriosClient
        mrr={mrr}
        statusCounts={statusCounts}
        topTecnicos={topTecnicos}
        topCidades={topCidades}
        servicosCSV={servicosCSV}
      />
    </div>
  );
}
