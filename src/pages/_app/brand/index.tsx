import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { type ColumnDef } from "@tanstack/react-table";
import { type PaginatedData } from "@/components/ui/data-table/@types";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { useMemo } from "react";

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
import { getBrandFilterConfig } from "./-components/brand-filter-config";

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

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteProductBrand(id),
    onMutate: async (brandId) => {
      await queryClient.cancelQueries({ queryKey: ["brands"] });
      const previousData = queryClient.getQueryData(["brands", filters]);
      queryClient.setQueryData(["brands", filters], (old: any) => {
        if (!old) return old;
        return {
          ...old,
            result: old.result.map((p: ProductBrand) =>
            p.id === brandId
              ? { ...p, isActive: false }
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

  const restoreMutation = useMutation({
    mutationFn: (id: number) => restoreProductBrand(id),
    onMutate: async (brandId) => {
      await queryClient.cancelQueries({ queryKey: ["brands"] });
      const previousData = queryClient.getQueryData(["brands", filters]);
      queryClient.setQueryData(["brands", filters], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          result: old.result.map((p: ProductBrand) =>
            p.id === brandId
              ? { ...p, isActive: true }
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
        acessorFn: (row: ProductBrand) => row.isActive,
        hecader: createHeaderColumn("Ativo"),
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
          const isActive = product.isActive;
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

  const filterConfig = useMemo(
    () =>  getBrandFilterConfig(), []
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
          row.original.isActive === false ? "line-through text-muted-foreground" : ""
        }
        actionBar={
          <DataTableToolbar table={table}>
            <AddButton to="/brand/new" />
          </DataTableToolbar>
        }
      />
      <DataTablePagination table={table} />
    </DataView>
  );
}
