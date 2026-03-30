import type { ServiceRequestStatus, PaymentStatus } from "@/lib/types";

interface Props {
  status: ServiceRequestStatus;
  paymentStatus?: PaymentStatus;
  cancelled?: boolean;
}

const STEPS = [
  { key: "solicitado",  label: "Solicitado"  },
  { key: "aceito",      label: "Aceito"      },
  { key: "andamento",   label: "Em andamento"},
  { key: "concluido",   label: "Concluído"   },
  { key: "pago",        label: "Pago"        },
  { key: "repasse",     label: "Repasse"     },
] as const;

/** Returns index of the last *completed* step (0-based, -1 = none done) */
function completedUpTo(
  status: ServiceRequestStatus,
  paymentStatus: PaymentStatus = "pending"
): number {
  if (status === "cancelled") return -1;
  if (paymentStatus === "released")              return 5; // all done
  if (paymentStatus === "confirmed")             return 4; // up to Pago
  if (paymentStatus === "awaiting_confirmation") return 3; // up to Concluído (4 is current/waiting)
  if (status === "completed")                    return 3; // up to Concluído
  if (status === "in_progress")                  return 2; // up to Em andamento
  if (status === "accepted")                     return 1; // up to Aceito
  return 0; // pending → Solicitado done
}

export default function ServiceProgressBar({ status, paymentStatus = "pending", cancelled }: Props) {
  if (cancelled || status === "cancelled") {
    return (
      <div className="flex items-center justify-center py-2">
        <span className="text-xs font-semibold text-red-500 bg-red-50 border border-red-200 rounded-full px-3 py-1">
          ❌ Serviço cancelado
        </span>
      </div>
    );
  }

  const doneIdx = completedUpTo(status, paymentStatus);
  // "current" step = doneIdx + 1, unless all done
  const currentIdx = doneIdx < STEPS.length - 1 ? doneIdx + 1 : -1;

  return (
    <div className="w-full overflow-x-auto pb-1">
      <div className="flex items-center min-w-[320px]">
        {STEPS.map((step, i) => {
          const done    = i <= doneIdx;
          const current = i === currentIdx;
          const future  = !done && !current;

          return (
            <div key={step.key} className="flex items-center flex-1 min-w-0">
              {/* Connector line (before first step has no line) */}
              {i > 0 && (
                <div className={`h-0.5 flex-1 transition-colors ${done ? "bg-brand-green" : "bg-brand-border"}`} />
              )}

              {/* Step dot + label */}
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className={`
                  relative h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-bold
                  transition-all
                  ${done    ? "bg-brand-green text-white"                                  : ""}
                  ${current ? "bg-amber-400 text-white animate-pulse ring-2 ring-amber-200": ""}
                  ${future  ? "bg-brand-border text-brand-muted"                           : ""}
                `}>
                  {done ? (
                    <svg viewBox="0 0 10 8" fill="none" className="w-2.5 h-2.5">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>
                <span className={`text-[9px] font-semibold text-center leading-tight max-w-[40px] ${
                  done    ? "text-brand-green"  :
                  current ? "text-amber-600"    :
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
