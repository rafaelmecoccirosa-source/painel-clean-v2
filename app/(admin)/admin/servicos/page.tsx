export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Serviços — Admin | Painel Clean" };

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const MOCK_SERVICOS = [
  { id: "1",  data: "28/03", cidade: "Jaraguá do Sul", cliente: "João S.",    tecnico: "Carlos M.",  modulos: 22, valor: 300, comissao: 75,  status: "concluido",   nota: 5.0 },
  { id: "2",  data: "27/03", cidade: "Pomerode",       cliente: "Empresa X",  tecnico: "Marcos F.",  modulos: 48, valor: 520, comissao: 130, status: "concluido",   nota: 4.5 },
  { id: "3",  data: "27/03", cidade: "Florianópolis",  cliente: "Maria O.",   tecnico: "Rafael C.",  modulos: 8,  valor: 180, comissao: 45,  status: "concluido",   nota: 5.0 },
  { id: "4",  data: "26/03", cidade: "Jaraguá do Sul", cliente: "Fazenda V.", tecnico: "Luiz O.",    modulos: 52, valor: 520, comissao: 130, status: "andamento",   nota: null },
  { id: "5",  data: "25/03", cidade: "Pomerode",       cliente: "Ana P.",     tecnico: "Marcos F.",  modulos: 15, valor: 300, comissao: 75,  status: "concluido",   nota: 4.8 },
  { id: "6",  data: "24/03", cidade: "Florianópolis",  cliente: "Roberto L.", tecnico: "Rafael C.",  modulos: 35, valor: 520, comissao: 130, status: "concluido",   nota: 5.0 },
  { id: "7",  data: "22/03", cidade: "Jaraguá do Sul", cliente: "Cláudia R.", tecnico: "Carlos M.",  modulos: 10, valor: 180, comissao: 45,  status: "agendado",    nota: null },
  { id: "8",  data: "21/03", cidade: "Pomerode",       cliente: "Pedro S.",   tecnico: "Marcos F.",  modulos: 28, valor: 300, comissao: 75,  status: "concluido",   nota: 5.0 },
  { id: "9",  data: "20/03", cidade: "Florianópolis",  cliente: "Usina Verde",tecnico: "Rafael C.",  modulos: 80, valor: 0,   comissao: 0,   status: "cancelado",   nota: null },
  { id: "10", data: "18/03", cidade: "Jaraguá do Sul", cliente: "Sônia T.",   tecnico: "Luiz O.",    modulos: 18, valor: 300, comissao: 75,  status: "concluido",   nota: 4.5 },
  { id: "11", data: "16/03", cidade: "Pomerode",       cliente: "Firma X",    tecnico: "Marcos F.",  modulos: 30, valor: 300, comissao: 75,  status: "concluido",   nota: 5.0 },
  { id: "12", data: "14/03", cidade: "Jaraguá do Sul", cliente: "Henrique B.",tecnico: "Carlos M.",  modulos: 12, valor: 300, comissao: 75,  status: "concluido",   nota: 4.7 },
  { id: "13", data: "12/03", cidade: "Florianópolis",  cliente: "Residência K",tecnico: "Rafael C.", modulos: 6,  valor: 180, comissao: 45,  status: "concluido",   nota: 5.0 },
  { id: "14", data: "10/03", cidade: "Jaraguá do Sul", cliente: "Indústria N.",tecnico: "Luiz O.",   modulos: 45, valor: 520, comissao: 130, status: "concluido",   nota: 4.9 },
  { id: "15", data: "08/03", cidade: "Pomerode",       cliente: "Colônia W.", tecnico: "Marcos F.",  modulos: 20, valor: 300, comissao: 75,  status: "concluido",   nota: 4.8 },
];

function statusLabel(s: string) {
  const map: Record<string, { label: string; cls: string }> = {
    concluido:  { label: "✅ Concluído",    cls: "bg-emerald-100 text-emerald-700" },
    completed:  { label: "✅ Concluído",    cls: "bg-emerald-100 text-emerald-700" },
    andamento:  { label: "🔄 Em andamento", cls: "bg-blue-100 text-blue-700"       },
    in_progress:{ label: "🔄 Em andamento", cls: "bg-blue-100 text-blue-700"       },
    agendado:   { label: "📅 Agendado",     cls: "bg-indigo-100 text-indigo-700"   },
    accepted:   { label: "📅 Aceito",       cls: "bg-indigo-100 text-indigo-700"   },
    pending:    { label: "⏳ Pendente",     cls: "bg-amber-100 text-amber-700"     },
    cancelado:  { label: "❌ Cancelado",    cls: "bg-red-100 text-red-600"         },
    cancelled:  { label: "❌ Cancelado",    cls: "bg-red-100 text-red-600"         },
  };
  const v = map[s] ?? { label: s, cls: "bg-gray-100 text-gray-600" };
  return <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${v.cls}`}>{v.label}</span>;
}

function fmtDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR");
}

export default async function ServicosPage() {
  let servicos = MOCK_SERVICOS as any[];
  let isReal = false;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("service_requests")
      .select(`
        id, status, payment_status, city, address,
        module_count, price_estimate, preferred_date,
        created_at, completed_at, client_id, technician_id,
        notes, preco_min, preco_max
      `)
      .order("created_at", { ascending: false })
      .limit(100);

    if (!error && data && data.length > 0) {
      isReal = true;
      console.log("[admin/servicos] real data:", data.length, "services");
      servicos = data.map((s: any) => ({
        id: s.id,
        data: fmtDate(s.preferred_date ?? s.created_at),
        cidade: s.city ?? "—",
        cliente: s.client_id?.slice(0, 8) ?? "—",
        tecnico: s.technician_id ? s.technician_id.slice(0, 8) : "—",
        modulos: s.module_count ?? 0,
        valor: s.price_estimate ?? 0,
        comissao: (s.price_estimate ?? 0) * 0.25,
        status: s.status ?? "pending",
        nota: null,
      }));
    } else if (error) {
      console.warn("[admin/servicos] query error:", error.message);
    }
  } catch (err) {
    console.warn("[admin/servicos] fetch error:", err);
  }

  const concluidos = servicos.filter((s) => ["concluido", "completed"].includes(s.status));
  const totalReceita = concluidos.reduce((a: number, s: any) => a + s.valor, 0);
  const totalComissao = concluidos.reduce((a: number, s: any) => a + s.comissao, 0);

  return (
    <div className="page-container space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin" className="text-brand-muted hover:text-brand-dark transition-colors" aria-label="Voltar">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold text-brand-dark">📋 Serviços</h1>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isReal ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
            }`}>
              {isReal ? "✅ Dados reais" : "📊 Dados demonstrativos"}
            </span>
          </div>
          <p className="text-brand-muted text-sm mt-0.5">Todos os serviços da plataforma</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { emoji: "📋", label: "Total de serviços",   value: String(servicos.length) },
          { emoji: "✅", label: "Concluídos",          value: String(concluidos.length) },
          { emoji: "💰", label: "Receita total",       value: fmt(totalReceita) },
          { emoji: "🏦", label: "Comissão 25%",        value: fmt(totalComissao) },
        ].map(({ emoji, label, value }) => (
          <div key={label} className="bg-white border border-brand-border rounded-2xl p-4 shadow-sm">
            <span className="text-2xl">{emoji}</span>
            <p className="font-heading font-bold text-brand-dark text-xl mt-2">{value}</p>
            <p className="text-xs text-brand-muted mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card !p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-brand-border">
          <h2 className="font-heading font-bold text-brand-dark text-base">Todos os serviços</h2>
        </div>

        {/* Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-brand-bg">
              <tr>
                {["#", "Data", "Cidade", "Cliente", "Técnico", "Placas", "Valor", "Comissão 25%", "Status", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-semibold text-brand-muted uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {servicos.map((s: any) => (
                <tr key={s.id} className="hover:bg-brand-bg/50 transition-colors">
                  <td className="px-4 py-3 text-brand-muted font-mono text-[10px]">{String(s.id).slice(0, 8)}</td>
                  <td className="px-4 py-3 text-brand-muted">{s.data}</td>
                  <td className="px-4 py-3 text-brand-dark font-medium">📍 {s.cidade}</td>
                  <td className="px-4 py-3 text-brand-dark">{s.cliente}</td>
                  <td className="px-4 py-3 text-brand-dark">{s.tecnico !== "—" ? s.tecnico : <span className="text-brand-muted italic">Sem técnico</span>}</td>
                  <td className="px-4 py-3 text-center text-brand-muted">{s.modulos}</td>
                  <td className="px-4 py-3 font-semibold text-brand-dark">{s.valor > 0 ? fmt(s.valor) : "—"}</td>
                  <td className="px-4 py-3 font-semibold text-brand-green">{s.comissao > 0 ? fmt(s.comissao) : "—"}</td>
                  <td className="px-4 py-3">{statusLabel(s.status)}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/servicos/${s.id}`}
                      className="text-xs text-brand-green font-semibold hover:underline whitespace-nowrap"
                    >
                      Ver detalhes →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="md:hidden divide-y divide-brand-border">
          {servicos.map((s: any) => (
            <div key={s.id} className="px-4 py-3 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-brand-dark text-sm">{s.cliente}</p>
                {statusLabel(s.status)}
              </div>
              <p className="text-xs text-brand-muted">📍 {s.cidade} · {s.data} · ☀️ {s.modulos} placas</p>
              <div className="flex items-center gap-3 text-xs justify-between">
                <div className="flex gap-3">
                  <span className="font-bold text-brand-dark">{s.valor > 0 ? fmt(s.valor) : "—"}</span>
                  <span className="text-brand-green font-semibold">comissão: {s.comissao > 0 ? fmt(s.comissao) : "—"}</span>
                </div>
                <Link href={`/admin/servicos/${s.id}`} className="text-brand-green font-semibold">Ver →</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
