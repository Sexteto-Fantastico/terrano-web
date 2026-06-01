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
import { toast } from "sonner";
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
import { useProductFilterConfig } from "./-components/product-filter-config";

export const Route = createFileRoute("/_app/product/")({
  component: ProductPage,
  validateSearch: (): ProductFilters => ({}),
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

  const { data, isLoading } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => fetchProducts(filters),
    placeholderData: keepPreviousData,
  });

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await deleteProduct(id);
      toast.success("Produto excluído com sucesso");
    },
    onError: () => {
      toast.error("Erro ao processar operação!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setProductToDelete(undefined);
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async (id: number) => {
      await restoreProduct(id);
      toast.success("Produto restaurado com sucesso");
    },
    onError: () => {
      toast.error("Erro ao processar operação!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  function handleEdit(productId: number) {
    navigate({
      to: "/product/edit",
      search: { id: productId },
    });
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

  const filterConfig = useProductFilterConfig();

  const columns = useMemo(
    () =>
      getProductTableColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        onToggleActive: handleToggleActive,
      }),
    []
  );

  const { table } = useDataTable({
    data,
    columns,
    filters,
    setFilters,
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
