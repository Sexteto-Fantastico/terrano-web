import type { DataTableFilterConfigItem } from "@/components/ui/data-table/@types";

export function getCategoryFilterConfig(): DataTableFilterConfigItem[] {
  return [
    {
      id: "name",
      label: "Categoria",
      variant: "text",
      placeholder: "Filtrar por nome",
    },
    {
      id: "activeOnly",
      label: "Ativo",
      variant: "checkbox",
      defaultValue: "true",
    },
  ];
}