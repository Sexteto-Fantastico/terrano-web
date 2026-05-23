import type { DataTableFilterConfigItem } from "@/components/ui/data-table/@types";

export function getProductFilterConfig(
  categoryOptions: { label: string; value: string }[],
  brandOptions: { label: string; value: string }[]
): DataTableFilterConfigItem[] {
  return [
    {
      id: "name",
      label: "Nome",
      variant: "text",
      placeholder: "Filtrar por nome",
    },
    {
      id: "code",
      label: "Código",
      variant: "text",
      placeholder: "Filtrar por código",
    },
    {
      id: "categoryId",
      label: "Categoria",
      variant: "select",
      placeholder: "Filtrar por categoria",
      options: categoryOptions,
    },
    {
      id: "brandId",
      label: "Marca",
      variant: "select",
      placeholder: "Filtrar por marca",
      options: brandOptions,
    },
    {
      id: "activeOnly",
      label: "Ativo",
      variant: "checkbox",
      defaultValue: "true",
    },
  ];
}
