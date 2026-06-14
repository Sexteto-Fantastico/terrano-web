import type { DataTableFilterConfigItem } from "@/components/ui/data-table/@types";

export function getAccessProfileFilterConfig(): DataTableFilterConfigItem[] {
  return [
    {
      id: "name",
      label: "Perfil",
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
