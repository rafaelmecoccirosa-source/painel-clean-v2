import type { Metadata } from "next";
import Link from "next/link";
import { Wrench, DollarSign, CalendarCheck, Star, ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "Dashboard — Técnico" };

const stats = [
  { label: "Novos pedidos", value: "5", icon: Wrench, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Agendados esta semana", value: "3", icon: CalendarCheck, color: "text-brand-green", bg: "bg-brand-green/10" },
  { label: "Ganhos no mês", value: "R$ 2.840", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Avaliação média", value: "4.9", icon: Star, color: "text-yellow-500", bg: "bg-yellow-50" },
];

export default function TecnicoDashboardPage() {
  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-dark">
          Dashboard do Técnico
        </h1>
        <p className="text-brand-muted text-sm mt-1">
          Confira os pedidos disponíveis e gerencie sua agenda.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card flex flex-col gap-3">
            <div className={`h-9 w-9 rounded-xl ${bg} flex items-center justify-center`}>
              <Icon size={18} className={color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-dark">{value}</p>
              <p className="text-xs text-brand-muted mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Pedidos disponíveis</h2>
          <Link href="/tecnico/servicos" className="text-sm text-brand-green font-medium hover:underline flex items-center gap-1">
            Ver todos <ArrowRight size={14} />
          </Link>
        </div>
        <p className="text-sm text-brand-muted">
          Integração com Supabase em desenvolvimento. Os pedidos de clientes aparecerão aqui.
        </p>
      </div>
    </div>
  );
}
