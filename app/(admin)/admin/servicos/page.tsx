import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = { title: "Serviços — Admin | Painel Clean" };

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const servicos = [
  { id: 1,  data: "28/03", cidade: "Jaraguá do Sul", cliente: "João S.",    tecnico: "Carlos M.",  modulos: 22, valor: 300, comissao: 45,  status: "concluido",   nota: 5.0 },
  { id: 2,  data: "27/03", cidade: "Pomerode",       cliente: "Empresa X",  tecnico: "Marcos F.",  modulos: 48, valor: 520, comissao: 78,  status: "concluido",   nota: 4.5 },
  { id: 3,  data: "27/03", cidade: "Florianópolis",  cliente: "Maria O.",   tecnico: "Rafael C.",  modulos: 8,  valor: 180, comissao: 27,  status: "concluido",   nota: 5.0 },
  { id: 4,  data: "26/03", cidade: "Jaraguá do Sul", cliente: "Fazenda V.", tecnico: "Luiz O.",    modulos: 52, valor: 520, comissao: 78,  status: "andamento",   nota: null },
  { id: 5,  data: "25/03", cidade: "Pomerode",       cliente: "Ana P.",     tecnico: "Marcos F.",  modulos: 15, valor: 300, comissao: 45,  status: "concluido",   nota: 4.8 },
  { id: 6,  data: "24/03", cidade: "Florianópolis",  cliente: "Roberto L.", tecnico: "Rafael C.",  modulos: 35, valor: 520, comissao: 78,  status: "concluido",   nota: 5.0 },
  { id: 7,  data: "22/03", cidade: "Jaraguá do Sul", cliente: "Cláudia R.", tecnico: "Carlos M.",  modulos: 10, valor: 180, comissao: 27,  status: "agendado",    nota: null },
  { id: 8,  data: "21/03", cidade: "Pomerode",       cliente: "Pedro S.",   tecnico: "Marcos F.",  modulos: 28, valor: 300, comissao: 45,  status: "concluido",   nota: 5.0 },
  { id: 9,  data: "20/03", cidade: "Florianópolis",  cliente: "Usina Verde",tecnico: "Rafael C.",  modulos: 80, valor: 0,   comissao: 0,   status: "cancelado",   nota: null },
  { id: 10, data: "18/03", cidade: "Jaraguá do Sul", cliente: "Sônia T.",   tecnico: "Luiz O.",    modulos: 18, valor: 300, comissao: 45,  status: "concluido",   nota: 4.5 },
  { id: 11, data: "16/03", cidade: "Pomerode",       cliente: "Firma X",    tecnico: "Marcos F.",  modulos: 30, valor: 300, comissao: 45,  status: "concluido",   nota: 5.0 },
  { id: 12, data: "14/03", cidade: "Jaraguá do Sul", cliente: "Henrique B.",tecnico: "Carlos M.",  modulos: 12, valor: 300, comissao: 45,  status: "concluido",   nota: 4.7 },
  { id: 13, data: "12/03", cidade: "Florianópolis",  cliente: "Residência K",tecnico: "Rafael C.", modulos: 6,  valor: 180, comissao: 27,  status: "concluido",   nota: 5.0 },
  { id: 14, data: "10/03", cidade: "Jaraguá do Sul", cliente: "Indústria N.",tecnico: "Luiz O.",   modulos: 45, valor: 520, comissao: 78,  status: "concluido",   nota: 4.9 },
  { id: 15, data: "08/03", cidade: "Pomerode",       cliente: "Colônia W.", tecnico: "Marcos F.",  modulos: 20, valor: 300, comissao: 45,  status: "concluido",   nota: 4.8 },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    concluido: { label: "✅ Concluído",    cls: "bg-emerald-100 text-emerald-700" },
    andamento: { label: "🔄 Em andamento", cls: "bg-blue-100 text-blue-700"       },
    agendado:  { label: "📅 Agendado",     cls: "bg-indigo-100 text-indigo-700"   },
    cancelado: { label: "❌ Cancelado",    cls: "bg-red-100 text-red-600"         },
  };
  const s = map[status] ?? { label: status, cls: "bg-gray-100 text-gray-600" };
  return (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${s.cls}`}>
      {s.label}
    </span>
  );
}

export default function ServicosPage() {
  const totalReceita = servicos
    .filter((s) => s.status === "concluido")
    .reduce((a, s) => a + s.valor, 0);
  const totalComissao = servicos
    .filter((s) => s.status === "concluido")
    .reduce((a, s) => a + s.comissao, 0);

  return (
    <div className="page-container space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin"
          className="text-brand-muted hover:text-brand-dark transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold text-brand-dark">
            📋 Serviços
          </h1>
          <p className="text-brand-muted text-sm mt-0.5">
            Todos os serviços da plataforma — março 2026
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { emoji: "📋", label: "Total de serviços",    value: String(servicos.length)    },
          { emoji: "✅", label: "Concluídos",           value: String(servicos.filter((s) => s.status === "concluido").length) },
          { emoji: "💰", label: "Receita total",        value: fmt(totalReceita)           },
          { emoji: "🏦", label: "Comissão arrecadada",  value: fmt(totalComissao)          },
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
        <div className="px-6 py-4 border-b border-brand-border flex items-center justify-between flex-wrap gap-2">
          <h2 className="font-heading font-bold text-brand-dark text-base">
            Todos os serviços
          </h2>
          <button className="text-xs text-brand-muted hover:text-brand-dark transition-colors">
            Exportar CSV →
          </button>
        </div>

        {/* Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-brand-bg">
              <tr>
                {["#", "Data", "Cidade", "Cliente", "Técnico", "Módulos", "Valor", "Comissão", "Status", "Nota", "Mapa"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 font-semibold text-brand-muted uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {servicos.map((s) => (
                <tr key={s.id} className="hover:bg-brand-bg/50 transition-colors">
                  <td className="px-4 py-3 text-brand-muted">{s.id}</td>
                  <td className="px-4 py-3 text-brand-muted">{s.data}</td>
                  <td className="px-4 py-3 text-brand-dark font-medium">📍 {s.cidade}</td>
                  <td className="px-4 py-3 text-brand-dark">{s.cliente}</td>
                  <td className="px-4 py-3 text-brand-dark">{s.tecnico}</td>
                  <td className="px-4 py-3 text-center text-brand-muted">{s.modulos}</td>
                  <td className="px-4 py-3 font-semibold text-brand-dark">
                    {s.valor > 0 ? fmt(s.valor) : "—"}
                  </td>
                  <td className="px-4 py-3 font-semibold text-brand-green">
                    {s.comissao > 0 ? fmt(s.comissao) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="px-4 py-3 text-amber-500 font-bold">
                    {s.nota !== null ? `⭐ ${s.nota.toFixed(1)}` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.cidade + " SC")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-xs font-semibold"
                      title={`Ver ${s.cidade} no mapa`}
                    >
                      📍
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-brand-border">
          {servicos.map((s) => (
            <div key={s.id} className="px-4 py-3 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-brand-dark text-sm">
                  {s.cliente} → {s.tecnico}
                </p>
                <StatusBadge status={s.status} />
              </div>
              <p className="text-xs text-brand-muted">
                📍 {s.cidade} · {s.data} · ☀️ {s.modulos} placas
              </p>
              <div className="flex items-center gap-3 text-xs">
                <span className="font-bold text-brand-dark">
                  {s.valor > 0 ? fmt(s.valor) : "—"}
                </span>
                <span className="text-brand-green font-semibold">
                  comissão: {s.comissao > 0 ? fmt(s.comissao) : "—"}
                </span>
                {s.nota !== null && (
                  <span className="text-amber-500 font-bold">⭐ {s.nota.toFixed(1)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
