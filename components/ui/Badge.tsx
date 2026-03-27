import { SERVICE_STATUS_COLORS, SERVICE_STATUS_LABELS, ServiceStatus } from "@/lib/types";

interface BadgeProps {
  status: ServiceStatus;
}

export default function Badge({ status }: BadgeProps) {
  const { bg, text } = SERVICE_STATUS_COLORS[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}
    >
      {SERVICE_STATUS_LABELS[status]}
    </span>
  );
}
