import { Badge } from "@/components/ui/badge";

const STATUS_CONFIG = {
  PENDING: {
    label: "Pendente",
    className: "bg-yellow-100 text-yellow-800",
  },

  CANCELLED: {
    label: "Cancelada",
    className: "bg-red-100 text-red-800",
  },

  DENIED: {
    label: "Negada",
    className: "bg-red-100 text-red-800",
  },

  APPROVED: {
    label: "Aprovada",
    className: "bg-green-100 text-green-800",
  },

  WAITING_PURCHASE: {
    label: "Aguardando compra",
    className: "bg-blue-100 text-blue-800",
  },

  WAITING_ARRIVAL: {
    label: "Aguardando chegada",
    className: "bg-indigo-100 text-indigo-800",
  },

  FINISHED: {
    label: "Finalizada",
    className: "bg-emerald-100 text-emerald-800",
  },
} as const;

type Status = keyof typeof STATUS_CONFIG;

export function StockRequisitionStatusBadge({
  status,
}: {
  status: Status;
}) {
  const config = STATUS_CONFIG[status];

  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  );
}