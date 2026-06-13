import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DataTableFilterMenu } from "@/components/ui/data-table/data-table-filter-menu";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { useMemo, useState } from "react";
import {
  deleteProduct,
  fetchProducts,
  restoreProduct,
  type Product,
  type ProductFilters,
} from "@/api/products";
import { fetchAllProductBrands } from "@/api/product-brands";
import { fetchAllProductCategories } from "@/api/product-categories";
import {
  keepPreviousData,
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
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { AddButton } from "@/components/button/add-button";
import { getProductTableColumns } from "./-components/product-table-columns";
import { getProductFilterConfig } from "./-components/product-filter-config";

export const Route = createFileRoute("/_app/product/")({
  component: ProductPage,
  validateSearch: () => ({}) as ProductFilters,
  head: () => ({
    meta: [
      {
        title: "Produtos",
      },
    ],
  }),
});

function ProductPage() {
  const { filters, setFilters, resetFilters } = useFilters(Route.id);
  const navigate = useNavigate();
  const [productToDelete, setProductToDelete] = useState<number | undefined>();

  const { data: categories = [] } = useQuery({
    queryKey: ["product-categories"],
    queryFn: () => fetchAllProductCategories(),
  });

  const { data: brands = [] } = useQuery({
    queryKey: ["product-brands"],
    queryFn: fetchAllProductBrands,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => fetchProducts(filters),
    placeholderData: keepPreviousData,
  });

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previousData = queryClient.getQueryData(["products", filters]);
      queryClient.setQueryData(["products", filters], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          result: old.result.map((p: Product) =>
            p.id === productId
              ? { ...p, deletedAt: new Date().toISOString() }
              : p
          ),
        };
      });
      return { previousData };
    },
    onError: (_err, _productId, context) => {
      queryClient.setQueryData(["products", filters], context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setProductToDelete(undefined);
    },
  });

  const restoreMutation = useMutation({
    mutationFn: restoreProduct,
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previousData = queryClient.getQueryData(["products", filters]);
      queryClient.setQueryData(["products", filters], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          result: old.result.map((p: Product) =>
            p.id === productId ? { ...p, deletedAt: null } : p
          ),
        };
      });
      return { previousData };
    },
    onError: (_err, _productId, context) => {
      queryClient.setQueryData(["products", filters], context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  function handleEdit(product: Product) {
    navigate({ to: "/product/edit", search: { id: String(product.id) } });
  }

  function handleDelete(productId: number) {
    setProductToDelete(productId);
  }

  function confirmDelete() {
    if (productToDelete) {
      deleteMutation.mutate(productToDelete);
    }
  }

  function handleToggleActive(product: Product, checked: boolean) {
    if (checked) {
      restoreMutation.mutate(product.id);
    } else {
      deleteMutation.mutate(product.id);
    }
  }

  const categoryOptions = useMemo(
    () => categories.map((c) => ({ label: c.name, value: String(c.id) })),
    [categories]
  );

  const brandOptions = useMemo(
    () => brands.map((b) => ({ label: b.name, value: String(b.id) })),
    [brands]
  );

  const columns = useMemo(
    () =>
      getProductTableColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        onToggleActive: handleToggleActive,
      }),
    []
  );

  const filterConfig = useMemo(
    () => getProductFilterConfig(categoryOptions, brandOptions),
    [categoryOptions, brandOptions]
  );

  const { table } = useDataTable({
    data,
    columns,
    filters: filters as any,
    setFilters: setFilters as any,
  });

  return (
    <DataView>
      <DataTableFilterMenu
        filterConfig={filterConfig}
        isLoading={isLoading}
        filters={filters}
        onFilter={setFilters}
        onClearFilters={resetFilters}
      />

      <Separator className="my-4" />

      <DataTable
        table={table}
        isLoading={isLoading}
        getRowClassName={(row) =>
          row.original.deletedAt ? "line-through text-muted-foreground" : ""
        }
        actionBar={
          <DataTableToolbar table={table}>
            <AddButton to="/product/new" />
          </DataTableToolbar>
        }
      />

      <DataTablePagination table={table} isLoading={isLoading} />

      <ConfirmDialog
        open={!!productToDelete}
        onOpenChange={(open) => !open && setProductToDelete(undefined)}
        title="Excluir produto?"
        description="Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        onConfirm={confirmDelete}
        isConfirming={deleteMutation.isPending}
      />
    </DataView>
  );
}
