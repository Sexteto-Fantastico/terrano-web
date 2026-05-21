import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { type ColumnDef } from "@tanstack/react-table";
import { type PaginatedData } from "@/components/ui/data-table/@types";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { useMemo, useState } from "react";

import {
  fetchProductBrands,
  deleteProductBrand,
  restoreProductBrand,
  type ProductBrand,
  type ProductBrandFilters,
} from "@/api/brand";


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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon, SquarePenIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createHeaderColumn } from "@/components/ui/data-table/data-table-helpers";
import { Switch } from "@/components/ui/switch";
import { DataTableFilterMenu } from "@/components/ui/data-table/data-table-filter-menu";
import { AddButton } from "@/components/button/add-button";

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
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<PaginatedData<ProductBrand>>({
    queryKey: ["brands", filters],
    queryFn: () => fetchProductBrands(filters),
  });

  const queryClient = useQueryClient();
  const [brandToDelete, setBrandToDelete] = useState<number | undefined>();

  const deleteMutation = useMutation({
    mutationFn: deleteProductBrand,
    onMutate: async (brandId) => {
      await queryClient.cancelQueries({ queryKey: ["brands"] });
      const previousData = queryClient.getQueryData(["brands", filters]);
      queryClient.setQueryData(["brands", filters], (old: any) => {
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
    navigate({
      to: "/brand/edit",
      search: { id: brand.id.toString() },
    });
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
        id: "active",
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
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [restoreMutation, deleteMutation]
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
            <AddButton onClick={() => navigate({ to: "/brand/edit" })} />
          </DataTableToolbar>
        }
      />
      <DataTablePagination table={table} />
    </DataView>
  );
}
