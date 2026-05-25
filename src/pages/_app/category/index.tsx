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

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { DataView } from "@/components/views/data-view";
import { useFilters } from "@/hooks/use-filters";
import { DataTable } from "@/components/ui/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { Separator } from "@/components/ui/separator";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";
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
    onMutate: async (categoryId) => {
      await queryClient.cancelQueries({ queryKey: ["categories"] });
      const previousData = queryClient.getQueryData(["categories", filters]);
      queryClient.setQueryData(["categories", filters], (old: any) => {
        if (!old) return old;
        return {
          ...old,
            result: old.result.map((c: ProductCategory) =>
            c.id === categoryId
              ? { ...c, isActive: false, deletedAt: new Date().toISOString() }
              : c
          ),
        };
      });
      return { previousData };
    },
    onError: (_err, _categoryId, context) => {
      queryClient.setQueryData(["categories", filters], context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const restoreMutation = useMutation({
    mutationFn: (id: number) => restoreProductCategory(id),
    onMutate: async (categoryId) => {
      await queryClient.cancelQueries({ queryKey: ["categories"] });
      const previousData = queryClient.getQueryData(["categories", filters]);
      queryClient.setQueryData(["categories", filters], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          result: old.result.map((c: ProductCategory) =>
            c.id === categoryId
              ? { ...c, isActive: true, deletedAt: null }
              : c
          ),
        };
      });
      return { previousData };
    },
    onError: (_err, _categoryId, context) => {
      queryClient.setQueryData(["categories", filters], context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  function handleEdit(categoryId: number) {
    navigate({
      to: "/category/edit",
      search: { id: categoryId.toString() },
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
    () => getCategoryTableColumns({ onEdit: handleEdit, onToggleActive: handleToggleActive }),
    [deleteMutation, restoreMutation]
  );

  const { table, setTableFilters } = useDataTable({
    data,
    columns,
    filters: filters as any,
    setFilters: setFilters as any,
  });

  const filterConfig = useMemo(
    () => getCategoryFilterConfig(), []
  );

  return (
    <DataView>
      <DataTableFilterMenu
        filters={filters as any}
        onFilter={setTableFilters}
        onClearFilters={resetFilters}
        filterConfig={filterConfig}
      />
      <Separator className="my-4" />
      <DataTable
        table={table}
        isLoading={isLoading}
        getRowClassName={(row) =>
          (row.original.isActive === false || row.original.deletedAt) ? "line-through text-muted-foreground" : ""
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