export type UserRole = "cliente" | "tecnico" | "admin";

export interface Profile {
  id: string;
  user_id: string;
  role: UserRole;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
}

// ── service_requests table (Supabase) ────────────────────────────────────

export type ServiceRequestStatus =
  | "pending"       // cliente solicitou, aguardando técnico
  | "accepted"      // técnico aceitou
  | "in_progress"   // técnico está realizando
  | "completed"     // técnico concluiu
  | "cancelled";    // cancelado

export interface ServiceRequestDB {
  id: string;
  client_id: string;
  technician_id: string | null;
  city: string;
  address: string;
  module_count: number;
  price_estimate: number;
  preferred_date: string;       // "YYYY-MM-DD"
  preferred_time: string;       // "Manhã (8h-12h)" | "Tarde (13h-17h)" | "Qualquer horário"
  status: ServiceRequestStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  accepted_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
}

export const STATUS_LABELS: Record<ServiceRequestStatus, string> = {
  pending:     "🟡 Aguardando técnico",
  accepted:    "🔵 Técnico a caminho",
  in_progress: "🟠 Em andamento",
  completed:   "🟢 Concluído",
  cancelled:   "🔴 Cancelado",
};

export const STATUS_BADGE: Record<ServiceRequestStatus, string> = {
  pending:     "bg-amber-100 text-amber-700",
  accepted:    "bg-blue-100 text-blue-700",
  in_progress: "bg-orange-100 text-orange-700",
  completed:   "bg-emerald-100 text-emerald-700",
  cancelled:   "bg-red-100 text-red-600",
};

export function calcPrice(moduleCount: number): number | null {
  if (moduleCount <= 10) return 180;
  if (moduleCount <= 30) return 300;
  if (moduleCount <= 60) return 520;
  return null; // Sob consulta
}

export function estimateHours(moduleCount: number): number {
  if (moduleCount <= 10) return 1.5;
  if (moduleCount <= 30) return 2.5;
  if (moduleCount <= 60) return 3.5;
  return 5;
}

// Legacy — kept for backward compat with components/cliente/ServicoCard.tsx
export interface ServiceRequest {
  id: string;
  client_id: string;
  tecnico_id: string | null;
  status: ServiceStatus;
  panel_count: number;
  address: string;
  city: string;
  state: string;
  scheduled_date: string | null;
  completed_date: string | null;
  price: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type ServiceStatus =
  | "pending"
  | "quoted"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

export const SERVICE_STATUS_LABELS: Record<ServiceStatus, string> = {
  pending: "Aguardando orçamento",
  quoted: "Orçamento enviado",
  confirmed: "Confirmado",
  in_progress: "Em andamento",
  completed: "Concluído",
  cancelled: "Cancelado",
};

export const SERVICE_STATUS_COLORS: Record<
  ServiceStatus,
  { bg: string; text: string }
> = {
  pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
  quoted: { bg: "bg-blue-100", text: "text-blue-800" },
  confirmed: { bg: "bg-brand-green/10", text: "text-brand-dark" },
  in_progress: { bg: "bg-purple-100", text: "text-purple-800" },
  completed: { bg: "bg-green-100", text: "text-green-800" },
  cancelled: { bg: "bg-red-100", text: "text-red-800" },
};
