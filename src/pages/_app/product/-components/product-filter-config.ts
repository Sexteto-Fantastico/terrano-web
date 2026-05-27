import { useQuery } from "@tanstack/react-query";
import { fetchAllProductBrands } from "@/api/product-brands";
import { fetchAllProductCategories } from "@/api/product-categories";
import { useMemo } from "react";
import type { DataTableFilterConfigItem } from "@/components/ui/data-table/@types";

export function useProductFilterConfig(): DataTableFilterConfigItem[] {
  const { data: categories = [] } = useQuery({
    queryKey: ["product-categories"],
    queryFn: fetchAllProductCategories,
  });

  const { data: brands = [] } = useQuery({
    queryKey: ["product-brands"],
    queryFn: fetchAllProductBrands,
  });

  const categoryOptions = useMemo(
    () => categories.map((c) => ({ label: c.name, value: String(c.id) })),
    [categories]
  );

  const brandOptions = useMemo(
    () => brands.map((b) => ({ label: b.name, value: String(b.id) })),
    [brands]
  );

  return useMemo(
    () => [
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
    ],
    [categoryOptions, brandOptions]
  );
}
