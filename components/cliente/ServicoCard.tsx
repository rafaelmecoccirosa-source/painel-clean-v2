import { CalendarDays, MapPin, Zap } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { ServiceRequest } from "@/lib/types";

interface ServicoCardProps {
  servico: ServiceRequest;
}

export default function ServicoCard({ servico }: ServicoCardProps) {
  const formattedDate = servico.scheduled_date
    ? new Date(servico.scheduled_date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-card hover:shadow-card-hover transition-shadow p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-xs text-brand-muted font-medium uppercase tracking-wide mb-1">
            Pedido #{servico.id.slice(0, 8).toUpperCase()}
          </p>
          <p className="text-brand-dark font-semibold">
            {servico.panel_count}{" "}
            {servico.panel_count === 1 ? "placa solar" : "placas solares"}
          </p>
        </div>
        <Badge status={servico.status} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-brand-muted">
          <MapPin size={14} className="flex-shrink-0 text-brand-green" />
          <span className="truncate">
            {servico.city}, {servico.state}
          </span>
        </div>

        {formattedDate && (
          <div className="flex items-center gap-2 text-sm text-brand-muted">
            <CalendarDays size={14} className="flex-shrink-0 text-brand-green" />
            <span>{formattedDate}</span>
          </div>
        )}

        {servico.price && (
          <div className="flex items-center gap-2 text-sm font-semibold text-brand-dark">
            <Zap size={14} className="flex-shrink-0 text-brand-green" />
            <span>
              R${" "}
              {servico.price.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
