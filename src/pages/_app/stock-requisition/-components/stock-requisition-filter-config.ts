import type { DataTableFilterConfigItem } from "@/components/ui/data-table/@types";

export function getStockRequisitionFilterConfig(): DataTableFilterConfigItem[] {
  return [
    {
      id: "period",
      label: "Período",
      variant: "dateRange",
    },
    {
      id: "status",
      label: "Status",
      variant: "select",
      options: [
        { label: "Pendente", value: "PENDING" },
        { label: "Negada", value: "DENIED" },
        { label: "Cancelada", value: "CANCELLED" },
        { label: "Aguardando compra", value: "WAITING_PURCHASE" },
        { label: "Aguardando chegada", value: "WAITING_ARRIVAL" },
        { label: "Aprovada", value: "APPROVED" },
        { label: "Finalizada", value: "FINISHED" },
      ],
    },
    {
      id: "openOnly",
      label: "Em aberto",
      variant: "checkbox",
      defaultValue: "true",
    },
    {
      id: "activeOnly",
      label: "Ativo",
      variant: "checkbox",
      defaultValue: "true",
    },
  ];
}