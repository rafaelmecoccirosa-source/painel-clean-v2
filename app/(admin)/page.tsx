import type { Metadata } from "next";
import Link from "next/link";
import { Users, Wrench, BarChart3, AlertCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "Dashboard — Admin" };

const stats = [
  { label: "Clientes cadastrados", value: "142", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Técnicos ativos", value: "28", icon: Wrench, color: "text-brand-green", bg: "bg-brand-green/10" },
  { label: "Serviços este mês", value: "87", icon: BarChart3, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Pendentes de revisão", value: "4", icon: AlertCircle, color: "text-yellow-600", bg: "bg-yellow-50" },
];

const quickLinks = [
  { href: "/admin/usuarios", label: "Gerenciar usuários", desc: "Clientes e técnicos" },
  { href: "/admin/servicos", label: "Todos os serviços", desc: "Acompanhar pedidos" },
  { href: "/admin/relatorios", label: "Relatórios", desc: "Métricas e exportação" },
];

export default function AdminDashboardPage() {
  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-dark">
          Painel Administrativo
        </h1>
        <p className="text-brand-muted text-sm mt-1">
          Visão geral da plataforma PainelClean.
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickLinks.map(({ href, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="card hover:shadow-card-hover transition-shadow flex items-center justify-between group"
          >
            <div>
              <p className="font-semibold text-brand-dark text-sm">{label}</p>
              <p className="text-xs text-brand-muted mt-0.5">{desc}</p>
            </div>
            <ArrowRight
              size={16}
              className="text-brand-muted group-hover:text-brand-green transition-colors flex-shrink-0"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
