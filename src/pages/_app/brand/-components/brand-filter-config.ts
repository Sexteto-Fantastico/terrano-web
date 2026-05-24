import type { DataTableFilterConfigItem } from "@/components/ui/data-table/@types";

export function getBrandFilterConfig(): DataTableFilterConfigItem[] {
  return [
    {
      id: "name",
      label: "Marca",
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
