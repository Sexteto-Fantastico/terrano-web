import type { DataTableFilterConfigItem } from "@/components/ui/data-table/@types";

export function getStockLocationFilterConfig(): DataTableFilterConfigItem[] {
  return [
    {
      id: "name",
      label: "Nome",
      variant: "text",
      placeholder: "Filtrar por nome",
    },
    {
      id: "activeOnly",
      label: "Ativo",
      variant: "checkbox",
      defaultValue: "true"
    },
  ];
}