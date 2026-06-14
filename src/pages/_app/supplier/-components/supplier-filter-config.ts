import type { DataTableFilterConfigItem } from "@/components/ui/data-table/@types";

export function getSupplierFilterConfig(): DataTableFilterConfigItem[] {
  return [
    {
      id: "corporateName",
      label: "Razão Social",
      variant: "text",
      placeholder: "Filtrar por razão social",
    },
    {
      id: "tradeName",
      label: "Nome",
      variant: "text",
      placeholder: "Filtrar por nome",
    },
    {
      id: "cnpj",
      label: "CNPJ",
      variant: "text",
      placeholder: "Filtrar por CNPJ",
    },
    {
      id: "activeOnly",
      label: "Ativo",
      variant: "checkbox",
      defaultValue: "true",
    },
  ];
}