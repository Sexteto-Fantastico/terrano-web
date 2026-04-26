import { createFileRoute } from "@tanstack/react-router";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTableFilters } from "@/components/ui/data-table/data-table-filters";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { useMemo, useState } from "react";
import { deleteProduct, fetchProducts, updateProduct, type Product } from "@/api/product";
import { keepPreviousData, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataView } from "@/components/views/data-view";
import { useFilters } from "@/hooks/use-filters";
import { DataTable } from "@/components/ui/data-table/data-table";
import type { Filters } from "@/types/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { Separator } from "@/components/ui/separator";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon, SquarePenIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  createHeaderColumn,
} from "@/components/ui/data-table/data-table-helpers";
import { ProductFormDialog } from "./-components/product-form-dialog";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export const Route = createFileRoute("/_app/product/")({
  component: ProductPage,
  validateSearch: () => ({}) as Filters<Product>,
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => fetchProducts(filters),
    placeholderData: keepPreviousData,
  });

  const queryClient = useQueryClient();
  const [productToEdit, setProductToEdit] = useState<Product | undefined>();
  const [productToDelete, setProductToDelete] = useState<number | undefined>();

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
            p.id === productId ? { ...p, deleted_at: new Date().toISOString() } : p
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

  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previousData = queryClient.getQueryData(["products", filters]);
      queryClient.setQueryData(["products", filters], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          result: old.result.map((p: Product) =>
            p.id === variables.id ? { ...p, deleted_at: variables.deleted_at } : p
          ),
        };
      });
      return { previousData };
    },
    onError: (_err, _variables, context) => {
      queryClient.setQueryData(["products", filters], context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  function handleEdit(product: Product) {
    setProductToEdit(product);
    setIsDialogOpen(true);
  }

  function handleDelete(productId: number) {
    setProductToDelete(productId);
  }

  function confirmDelete() {
    if (productToDelete) {
      deleteMutation.mutate(productToDelete);
    }
  }

  const columns: ColumnDef<Product>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: createHeaderColumn("Nome"),
        meta: {
          filter: {
            label: "Nome",
            variant: "text",
            placeholder: "Filtrar por nome",
          },
        },
      },
      {
        id: "category",
        accessorFn: (row) => row.category.name,
        header: createHeaderColumn("Categoria"),
        meta: {
          filter: {
            label: "Categoria",
            variant: "text",
            placeholder: "Filtrar por categoria",
          },
        },
      },
      {
        id: "brand",
        accessorFn: (row) => row.brand?.name,
        header: createHeaderColumn("Marca"),
        meta: {
          filter: {
            label: "Marca",
            variant: "text",
            placeholder: "Filtrar por marca",
          },
        },
      },
      {
        accessorKey: "unitOfMeasure",
        header: createHeaderColumn("Unid. Medida"),
      },
      {
        accessorKey: "min_stock",
        header: createHeaderColumn("Estoque Mín"),
      },
      {
        accessorKey: "maxStock",
        header: createHeaderColumn("Estoque Máx"),
      },
      {
        accessorKey: "description",
        header: createHeaderColumn("Descrição"),
        meta: {
          filter: {
            label: "Descrição",
            variant: "text",
            placeholder: "Filtrar por descrição",
          },
        },
      },
      {
        accessorKey: "internalNotes",
        header: createHeaderColumn("Anot. Internas"),
      },
      {
        id: "active",
        accessorFn: (row) => !row.deleted_at,
        header: createHeaderColumn("Ativo"),
        enableSorting: false,
        enableHiding: false,
        size: 80,
        cell: ({ row }) => {
          const product = row.original;
          const isActive = !product.deleted_at;
          return (
            <div className="flex items-center justify-between gap-4">
              <Switch
                checked={isActive}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateMutation.mutate({ id: product.id, deleted_at: null });
                  } else {
                    deleteMutation.mutate(product.id);
                  }
                }}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant={"ghost"} className="h-8 w-8">
                    <span className="sr-only">Abrir menu</span>
                    <MoreHorizontalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                  <DropdownMenuItem onSelect={() => handleEdit(product)}>
                    <SquarePenIcon className="me-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={() => handleDelete(product.id)}
                  >
                    <Trash2Icon className="me-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    []
  );

  const { table, setTableFilters } = useDataTable({
    data,
    columns,
    filters,
    setFilters,
  });

  return (
    <DataView>
      <DataTableFilters
        table={table}
        filters={filters}
        onFilter={setTableFilters}
        onClearFilters={resetFilters}
      />
      <Separator className="my-4" />
      <DataTable
        table={table}
        isLoading={isLoading}
        getRowClassName={(row) => row.original.deleted_at ? "line-through text-muted-foreground" : ""}
        actionBar={
          <DataTableToolbar
            table={table}
            onClickAdd={() => setIsDialogOpen(true)}
          />
        }
      />
      <DataTablePagination table={table} />
      <ProductFormDialog 
        open={isDialogOpen} 
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setProductToEdit(undefined);
        }} 
        productToEdit={productToEdit} 
      />
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
