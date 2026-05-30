import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { type PaginatedData } from "@/components/ui/data-table/@types";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { useMemo } from "react";

import {
  fetchProductCategories,
  deleteProductCategory,
  restoreProductCategory,
  type ProductCategory,
  type ProductCategoryFilters,
} from "@/api/product-categories";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataView } from "@/components/views/data-view";
import { useFilters } from "@/hooks/use-filters";
import { DataTable } from "@/components/ui/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { Separator } from "@/components/ui/separator";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";
import { toast } from "sonner";
import { DataTableFilterMenu } from "@/components/ui/data-table/data-table-filter-menu";
import { AddButton } from "@/components/button/add-button";
import { getCategoryFilterConfig } from "./-components/category-filter-config";
import { getCategoryTableColumns } from "./-components/category-table-columns";

export const Route = createFileRoute("/_app/category/")({
  component: CategoryPage,
  validateSearch: (): ProductCategoryFilters => ({}),
  head: () => ({
    meta: [
      {
        title: "Categorias",
      },
    ],
  }),
});

function CategoryPage() {
  const { filters, setFilters, resetFilters } = useFilters(Route.id);
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<PaginatedData<ProductCategory>>({
    queryKey: ["categories", filters],
    queryFn: () => fetchProductCategories(filters),
  });

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteProductCategory(id),
    onSuccess: () => {
      toast.success("Categoria excluída com sucesso");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const restoreMutation = useMutation({
    mutationFn: (id: number) => restoreProductCategory(id),
    onSuccess: () => {
      toast.success("Categoria restaurada com sucesso");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  function handleEdit(categoryId: number) {
    navigate({
      to: "/category/edit",
      search: { id: categoryId },
    });
  }

  function handleToggleActive(categoryId: number, value: boolean) {
    if (value) {
      restoreMutation.mutate(categoryId);
    } else {
      deleteMutation.mutate(categoryId);
    }
  }

  const columns = useMemo(
    () =>
      getCategoryTableColumns({
        onEdit: handleEdit,
        onToggleActive: handleToggleActive,
      }),
    [deleteMutation, restoreMutation]
  );

  const { table, setTableFilters } = useDataTable({
    data,
    columns,
    filters: filters,
    setFilters: setFilters,
  });

  const filterConfig = useMemo(() => getCategoryFilterConfig(), []);

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
          row.original.isActive === false || row.original.deletedAt
            ? "line-through text-muted-foreground"
            : ""
        }
        actionBar={
          <DataTableToolbar table={table}>
            <AddButton to="/category/new" />
          </DataTableToolbar>
        }
      />
      <DataTablePagination table={table} />
    </DataView>
  );
}
