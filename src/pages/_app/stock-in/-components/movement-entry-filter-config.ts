import type { DataTableFilterConfigItem } from "@/components/ui/data-table/@types";

export const MOVEMENT_ENTRY_CATEGORY_LABELS: Record<string, string> = {
  PURCHASE: "Compra",
  ADJUSTMENT: "Ajuste",
};

export function getMovementEntryFilterConfig(
  stockLocationOptions: Array<{ label: string; value: string }>,
  supplierOptions: Array<{ label: string; value: string }>
): DataTableFilterConfigItem[] {
  return [
    {
      id: "stockLocationId",
      label: "Estoque",
      variant: "select",
      options: stockLocationOptions,
      placeholder: "Filtrar por estoque",
    },
    {
      id: "supplierId",
      label: "Fornecedor",
      variant: "select",
      options: supplierOptions,
      placeholder: "Filtrar por fornecedor",
    },
    {
      id: "nfNumber",
      label: "Número da NF",
      variant: "text",
      placeholder: "Número da nota fiscal",
    },
    {
      id: "nfSerie",
      label: "Série da NF",
      variant: "text",
      placeholder: "Série da nota fiscal",
    },
    {
      id: "activeOnly",
      label: "Ativo",
      variant: "checkbox",
      defaultValue: "true",
    },
  ];
}
