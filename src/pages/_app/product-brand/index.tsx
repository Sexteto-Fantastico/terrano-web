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
import { toast } from "sonner";
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
    onSuccess: () => {
      toast.success("Marca excluída com sucesso");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["product-brands"] });
    },
  });

  const restoreMutation = useMutation({
    mutationFn: (id: number) => restoreProductBrand(id),
    onSuccess: () => {
      toast.success("Marca restaurada com sucesso");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["product-brands"] });
    },
  });

  function handleEdit(brandId: number) {
    navigate({
      to: "/product-brand/edit",
      search: { id: brandId },
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
