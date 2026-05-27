import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { type PaginatedData } from "@/components/ui/data-table/@types";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { useMemo } from "react";

import {
  fetchProductBrands,
  deleteProductBrand,
  restoreProductBrand,
  type ProductBrand,
  type ProductBrandFilters,
} from "@/api/product-brands";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataView } from "@/components/views/data-view";
import { useFilters } from "@/hooks/use-filters";
import { DataTable } from "@/components/ui/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { Separator } from "@/components/ui/separator";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";
import { DataTableFilterMenu } from "@/components/ui/data-table/data-table-filter-menu";
import { AddButton } from "@/components/button/add-button";
import { useProductBrandFilterConfig } from "./-components/product-brand-filter-config";
import { getProductBrandTableColumns } from "./-components/product-brand-table-columns";

export const Route = createFileRoute("/_app/product-brand/")({
  component: BrandPage,
  validateSearch: (): ProductBrandFilters => ({}),
  head: () => ({
    meta: [
      {
        title: "Marcas",
      },
    ],
  }),
});

function BrandPage() {
  const { filters, setFilters, resetFilters } = useFilters(Route.id);
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<PaginatedData<ProductBrand>>({
    queryKey: ["product-brands", filters],
    queryFn: () => fetchProductBrands(filters),
  });

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteProductBrand(id),
    onMutate: async (brandId) => {
      await queryClient.cancelQueries({ queryKey: ["product-brands"] });
      const previousData = queryClient.getQueryData([
        "product-brands",
        filters,
      ]);
      queryClient.setQueryData(["product-brands", filters], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          result: old.result.map((p: ProductBrand) =>
            p.id === brandId ? { ...p, isActive: false } : p
          ),
        };
      });
      return { previousData };
    },
    onError: (_err, _productId, context) => {
      queryClient.setQueryData(
        ["product-brands", filters],
        context?.previousData
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["product-brands", filters] });
    },
  });

  const restoreMutation = useMutation({
    mutationFn: (id: number) => restoreProductBrand(id),
    onMutate: async (brandId) => {
      await queryClient.cancelQueries({ queryKey: ["product-brands"] });
      const previousData = queryClient.getQueryData([
        "product-brands",
        filters,
      ]);
      queryClient.setQueryData(["product-brands", filters], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          result: old.result.map((p: ProductBrand) =>
            p.id === brandId ? { ...p, isActive: true } : p
          ),
        };
      });
      return { previousData };
    },
    onError: (_err, _productId, context) => {
      queryClient.setQueryData(
        ["product-brands", filters],
        context?.previousData
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["product-brands", filters] });
    },
  });

  function handleEdit(brandId: number) {
    navigate({
      to: "/product-brand/edit",
      search: { id: brandId.toString() },
    });
  }

  function handleToggleActive(brandId: number, value: boolean) {
    if (value) {
      restoreMutation.mutate(brandId);
    } else {
      deleteMutation.mutate(brandId);
    }
  }

  const columns = useMemo(
    () =>
      getProductBrandTableColumns({
        onEdit: handleEdit,
        onToggleActive: handleToggleActive,
      }),
    [deleteMutation, restoreMutation]
  );

  const { table, setTableFilters } = useDataTable({
    data,
    columns,
    filters,
    setFilters,
  });

  const filterConfig = useProductBrandFilterConfig();

  return (
    <DataView>
      <DataTableFilterMenu
        filters={filters}
        onFilter={setTableFilters}
        onClearFilters={resetFilters}
        filterConfig={filterConfig}
      />
      <Separator className="my-4" />
      <DataTable
        table={table}
        isLoading={isLoading}
        getRowClassName={(row) =>
          row.original.isActive === false
            ? "line-through text-muted-foreground"
            : ""
        }
        actionBar={
          <DataTableToolbar table={table}>
            <AddButton to="/product-brand/new" />
          </DataTableToolbar>
        }
      />
      <DataTablePagination table={table} />
    </DataView>
  );
}
