import type { DataTableFilterConfigItem } from "@/components/ui/data-table/@types";

export const MOVEMENT_EXIT_CATEGORY_LABELS: Record<string, string> = {
  MATERIAL_REQUEST: "Requisição de Material",
  STOCK_LOCATION_TRANSFER: "Transferência entre Locais",
  DEFECTIVE: "Defeito / Avaria",
  RETURN: "Devolução",
  ADJUSTMENT: "Ajuste de Estoque",
};

export function getStockOutFilterConfig(): DataTableFilterConfigItem[] {
  return [
    {
      id: "dateRange",
      label: "Período",
      variant: "dateRange",
      placeholder: "Filtrar por data...",
    },
    {
      id: "exitMovementCategory",
      label: "Categoria",
      variant: "select",
      placeholder: "Filtrar por categoria",
      options: Object.entries(MOVEMENT_EXIT_CATEGORY_LABELS).map(([value, label]) => ({
        label,
        value,
      })),
    },
    {
      id: "activeOnly",
      label: "Ativo",
      variant: "checkbox",
      defaultValue: "true",
    },
  ];
}
