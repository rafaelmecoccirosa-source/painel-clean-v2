import Link from "next/link";
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Sun,
  Zap,
} from "lucide-react";
import Button from "@/components/ui/Button";
import ServicoCard from "@/components/cliente/ServicoCard";
import { ServiceRequest } from "@/lib/types";

// Mock data — will be replaced with Supabase query
const mockServicos: ServiceRequest[] = [
  {
    id: "a1b2c3d4-0000-0000-0000-000000000001",
    client_id: "user-1",
    tecnico_id: "tech-1",
    status: "confirmed",
    panel_count: 12,
    address: "Rua das Flores, 123",
    city: "São Paulo",
    state: "SP",
    scheduled_date: "2026-04-05T10:00:00Z",
    completed_date: null,
    price: 280.0,
    notes: null,
    created_at: "2026-03-20T14:00:00Z",
    updated_at: "2026-03-22T09:00:00Z",
  },
  {
    id: "a1b2c3d4-0000-0000-0000-000000000002",
    client_id: "user-1",
    tecnico_id: null,
    status: "pending",
    panel_count: 8,
    address: "Av. Brasil, 500",
    city: "Campinas",
    state: "SP",
    scheduled_date: null,
    completed_date: null,
    price: null,
    notes: "Acessar pela portaria lateral",
    created_at: "2026-03-25T11:30:00Z",
    updated_at: "2026-03-25T11:30:00Z",
  },
  {
    id: "a1b2c3d4-0000-0000-0000-000000000003",
    client_id: "user-1",
    tecnico_id: "tech-2",
    status: "completed",
    panel_count: 20,
    address: "Rua do Sol, 77",
    city: "Ribeirão Preto",
    state: "SP",
    scheduled_date: "2026-02-15T08:00:00Z",
    completed_date: "2026-02-15T12:00:00Z",
    price: 450.0,
    notes: null,
    created_at: "2026-02-10T10:00:00Z",
    updated_at: "2026-02-15T12:30:00Z",
  },
];

const stats = [
  {
    label: "Serviços ativos",
    value: "2",
    icon: Clock,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Concluídos",
    value: "1",
    icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    label: "Placas limpas",
    value: "20",
    icon: Sun,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
  },
  {
    label: "Eficiência estimada",
    value: "+18%",
    icon: TrendingUp,
    color: "text-brand-green",
    bg: "bg-brand-green/10",
  },
];

export default function ClienteHomePage() {
  const ativos = mockServicos.filter(
    (s) => s.status !== "completed" && s.status !== "cancelled"
  );
  const recentes = mockServicos.slice(0, 3);

  return (
    <div className="page-container">
      {/* Welcome banner */}
      <div className="bg-gradient-brand rounded-2xl p-6 sm:p-8 mb-8 text-white overflow-hidden relative">
        <div className="relative z-10">
          <p className="text-white/70 text-sm mb-1">Bem-vindo de volta</p>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Rafael Mecoci
          </h1>
          <p className="text-white/70 text-sm mb-6 max-w-sm">
            Suas placas merecem o melhor cuidado. Solicite uma limpeza e
            maximize a geração de energia.
          </p>
          <Link href="/cliente/solicitar">
            <Button size="md" className="bg-brand-green text-white hover:bg-brand-green-hover">
              <PlusCircle size={16} />
              Nova solicitação
            </Button>
          </Link>
        </div>
        {/* Decorative circles */}
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/5" />
        <div className="absolute -right-4 -bottom-12 h-52 w-52 rounded-full bg-white/5" />
        <Zap
          size={80}
          className="absolute right-12 top-1/2 -translate-y-1/2 text-white/10"
        />
      </div>

      {/* Stats */}
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

      {/* Active services */}
      {ativos.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Serviços em andamento</h2>
            <Link
              href="/cliente/historico"
              className="text-sm text-brand-green font-medium hover:underline flex items-center gap-1"
            >
              Ver todos
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ativos.map((servico) => (
              <ServicoCard key={servico.id} servico={servico} />
            ))}
          </div>
        </section>
      )}

      {/* Recent history */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Histórico recente</h2>
          <Link
            href="/cliente/historico"
            className="text-sm text-brand-green font-medium hover:underline flex items-center gap-1"
          >
            Histórico completo
            <ArrowRight size={14} />
          </Link>
        </div>
        {recentes.length === 0 ? (
          <div className="card text-center py-12">
            <Sun size={40} className="text-brand-border mx-auto mb-3" />
            <p className="text-brand-muted text-sm">
              Você ainda não tem solicitações.
            </p>
            <Link href="/cliente/solicitar" className="inline-block mt-4">
              <Button size="sm">Solicitar primeira limpeza</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentes.map((servico) => (
              <ServicoCard key={servico.id} servico={servico} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
