import type { ServiceRequestStatus, PaymentStatus } from "@/lib/types";

type Role = "cliente" | "tecnico" | "admin";

interface Props {
  status: ServiceRequestStatus;
  paymentStatus?: PaymentStatus;
  cancelled?: boolean;
  role?: Role;
}

// ── Step definitions per role ────────────────────────────────────────────────

const STEPS_CLIENTE = [
  { key: "solicitado", label: "Solicitado"   },
  { key: "pago",       label: "Pago"         },
  { key: "aceito",     label: "Aceito"       },
  { key: "andamento",  label: "Em andamento" },
  { key: "concluido",  label: "Concluído"    },
] as const;

const STEPS_TECNICO = [
  { key: "disponivel", label: "Disponível"   },
  { key: "aceito",     label: "Aceito"       },
  { key: "andamento",  label: "Em andamento" },
  { key: "concluido",  label: "Concluído"    },
] as const;

const STEPS_ADMIN = [
  { key: "solicitado", label: "Solicitado"   },
  { key: "pago",       label: "Pago"         },
  { key: "aceito",     label: "Aceito"       },
  { key: "andamento",  label: "Em andamento" },
  { key: "concluido",  label: "Concluído"    },
  { key: "repasse",    label: "Repasse"      },
] as const;

// ── completedUpTo per role ───────────────────────────────────────────────────
// Returns index of the last *completed* step (0-based, -1 = none done)

function doneCliente(
  status: ServiceRequestStatus,
  paymentStatus: PaymentStatus
): number {
  if (status === "completed")    return 4; // all 5 done
  if (status === "in_progress")  return 3; // Concluído is current
  if (status === "accepted")     return 2; // Em andamento is current
  if (paymentStatus === "confirmed") return 1; // Aceito is current
  // pending + pending/awaiting_confirmation: Pago is current (Solicitado done)
  return 0;
}

function doneTecnico(status: ServiceRequestStatus): number {
  if (status === "completed")    return 3; // all 4 done
  if (status === "in_progress")  return 1; // Disponível+Aceito done, Em andamento current
  if (status === "accepted")     return 0; // Disponível done, Aceito current
  // pending (available for tech): nothing done, Disponível is current
  return -1;
}

function doneAdmin(
  status: ServiceRequestStatus,
  paymentStatus: PaymentStatus
): number {
  if (paymentStatus === "released")  return 5; // all 6 done
  if (status === "completed")        return 4; // Repasse is current
  if (status === "in_progress")      return 3; // Concluído is current
  if (status === "accepted")         return 2; // Em andamento is current
  if (paymentStatus === "confirmed") return 1; // Aceito is current
  if (paymentStatus === "awaiting_confirmation") return 0; // Pago is current
  return 0;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function ServiceProgressBar({
  status,
  paymentStatus = "pending",
  cancelled,
  role = "admin",
}: Props) {
  if (cancelled || status === "cancelled") {
    return (
      <div className="flex items-center justify-center py-2">
        <span className="text-xs font-semibold text-red-500 bg-red-50 border border-red-200 rounded-full px-3 py-1">
          ❌ Serviço cancelado
        </span>
      </div>
    );
  }

  const steps =
    role === "cliente" ? STEPS_CLIENTE :
    role === "tecnico" ? STEPS_TECNICO :
    STEPS_ADMIN;

  const doneIdx =
    role === "cliente" ? doneCliente(status, paymentStatus) :
    role === "tecnico" ? doneTecnico(status) :
    doneAdmin(status, paymentStatus);

  const currentIdx = doneIdx < steps.length - 1 ? doneIdx + 1 : -1;

  return (
    <div className="w-full overflow-x-auto pb-1">
      <div className="flex items-center min-w-[280px]">
        {steps.map((step, i) => {
          const done    = i <= doneIdx;
          const current = i === currentIdx;
          const future  = !done && !current;

          return (
            <div key={step.key} className="flex items-center flex-1 min-w-0">
              {i > 0 && (
                <div className={`h-0.5 flex-1 transition-colors ${done ? "bg-brand-green" : "bg-brand-border"}`} />
              )}

              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className={`
                  relative h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-bold
                  transition-all
                  ${done    ? "bg-brand-green text-white"                                   : ""}
                  ${current ? "bg-amber-400 text-white animate-pulse ring-2 ring-amber-200" : ""}
                  ${future  ? "bg-brand-border text-brand-muted"                            : ""}
                `}>
                  {done ? (
                    <svg viewBox="0 0 10 8" fill="none" className="w-2.5 h-2.5">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>
                <span className={`text-[9px] font-semibold text-center leading-tight max-w-[48px] ${
                  done    ? "text-brand-green" :
                  current ? "text-amber-600"   :
                            "text-brand-muted"
                }`}>
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
