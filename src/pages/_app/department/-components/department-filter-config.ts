import type { DataTableFilterConfigItem } from "@/components/ui/data-table/@types";

export function getDepartmentFilterConfig(): DataTableFilterConfigItem[] {
  return [
    {
      id: "name",
      label: "Departamento",
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
