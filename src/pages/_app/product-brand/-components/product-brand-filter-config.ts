import { useMemo } from "react";
import type { DataTableFilterConfigItem } from "@/components/ui/data-table/@types";

export function useProductBrandFilterConfig(): DataTableFilterConfigItem[] {
  return useMemo(
    () => [
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
    ],
    []
  );
}