import type { DataTableFilterConfigItem } from "@/components/ui/data-table/@types";

export function getPurchaseFilterConfig(
  supplierOptions: Array<{ label: string; value: string }>
): DataTableFilterConfigItem[] {
  return [
    {
      id: "supplierId",
      label: "Fornecedor",
      variant: "select",
      options: supplierOptions,
      placeholder: "Fornecedor",
    },
    {
      id: "purchaseDate",
      label: "Data da compra",
      variant: "date",
      placeholder: "Data da compra",
    },
    {
      id: "estimatedDeliveryDate",
      label: "Data prevista",
      variant: "date",
      placeholder: "Data prevista",
    },
    {
      id: "nfNumber",
      label: "NF número",
      variant: "text",
      placeholder: "Número da nota fiscal",
    },
    {
      id: "nfSerie",
      label: "NF série",
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
