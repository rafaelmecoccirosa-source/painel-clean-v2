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
