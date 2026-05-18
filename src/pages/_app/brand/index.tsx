import { createFileRoute } from "@tanstack/react-router";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { useMemo, useState } from "react";

import {
  fetchProductBrandById,
  fetchProductBrands,
  createProductBrand,
  updateProductBrand,
  deleteProductBrand,
  restoreProductBrand,
  type ProductBrand,
  type ProductBrandFilters,
} from "@/api/brand";


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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon, SquarePenIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createHeaderColumn } from "@/components/ui/data-table/data-table-helpers";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTableFilterMenu } from "@/components/ui/data-table/data-table-filter-menu";
import { AddButton } from "@/components/feature/shared/components/add-button";

export const Route = createFileRoute("/_app/brand/")({
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["brands", filters],
    queryFn: () => fetchProductBrands(filters),
    placeholderData: keepPreviousData,
  });

  const queryClient = useQueryClient();
  const [brandToEdit, setBrandToEdit] = useState<ProductBrand | undefined>();
  const [brandToDelete, setBrandToDelete] = useState<number | undefined>();

  const deleteMutation = useMutation({
    mutationFn: deleteProductBrand,
    onMutate: async (brandId) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previousData = queryClient.getQueryData(["products", filters]);
      queryClient.setQueryData(["products", filters], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          result: old.result.map((p: ProductBrand) =>
            p.id === brandId
              ? { ...p, deletedAt: new Date().toISOString() }
              : p
          ),
        };
      });
      return { previousData };
    },
    onError: (_err, _productId, context) => {
      queryClient.setQueryData(["brands", filters], context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      setBrandToDelete(undefined);
    },
  });

  const restoreMutation = useMutation({
    mutationFn: restoreProductBrand,
    onMutate: async (brandId) => {
      await queryClient.cancelQueries({ queryKey: ["brands"] });
      const previousData = queryClient.getQueryData(["brands", filters]);
      queryClient.setQueryData(["brands", filters], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          result: old.result.map((p: ProductBrand) =>
            p.id === brandId
              ? { ...p, deletedAt: null }
              : p
          ),
        };
      });
      return { previousData };
    },
    onError: (_err, _productId, context) => {
      queryClient.setQueryData(["brands", filters], context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
  });

  function handleEdit(brand: ProductBrand) {
    setBrandToEdit(brand);
    setIsDialogOpen(true);
  }

  function handleDelete(brandId: number) {
    setBrandToDelete(brandId);
  }

  function confirmDelete() {
    if (brandToDelete) {
      deleteMutation.mutate(brandToDelete);
    }
  }

  const columns: ColumnDef<ProductBrand>[] = useMemo(
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
        id: "activeOnly",
        accessorFn: (row) => !row.deletedAt,
        header: createHeaderColumn("Ativo"),
        enableSorting: false,
        enableHiding: false,
        size: 80,
        meta: {
          filter: {
            label: "Ativo",
            variant: "checkbox",
            defaultValue: "true",
          },
        },
        cell: ({ row }) => {
          const product = row.original;
          const isActive = !product.deletedAt;
          return (
            <div className="flex items-center justify-between gap-4">
              <Switch
                checked={isActive}
                onCheckedChange={(checked) => {
                  if (checked) {
                    restoreMutation.mutate(product.id);
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
    ]
  );

  const { table, setTableFilters } = useDataTable({
    data,
    columns,
    filters: filters as any,
    setFilters: setFilters as any,
  });

  return (
    <DataView>
      <DataTableFilterMenu
        table={table}
        filters={filters as any}
        onFilter={setTableFilters}
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
            <AddButton onClick={() => setIsDialogOpen(true)} />
          </DataTableToolbar>
        }
      />
      <DataTablePagination table={table} />
      <ConfirmDialog
        open={!!brandToDelete}
        onOpenChange={(open) => !open && setBrandToDelete(undefined)}
        title="Excluir marca?"
        description="Tem certeza que deseja excluir esta marca?"
        confirmText="Excluir"
        onConfirm={confirmDelete}
        isConfirming={deleteMutation.isPending}
      />
    </DataView>
  );
}
