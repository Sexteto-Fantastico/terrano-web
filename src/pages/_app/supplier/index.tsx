import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { requirePermission } from "@/lib/route-guard";
import { useMemo } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { PaginatedData } from "@/components/ui/data-table/@types";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { DataView } from "@/components/views/data-view";
import { useFilters } from "@/hooks/use-filters";
import { DataTable } from "@/components/ui/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { Separator } from "@/components/ui/separator";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";
import { DataTableFilterMenu } from "@/components/ui/data-table/data-table-filter-menu";
import { AddButton } from "@/components/button/add-button";
import {
  deleteSupplier,
  fetchSuppliers,
  restoreSupplier,
  type Supplier,
  type SupplierFilters,
} from "@/api/suppliers";
import { getSupplierFilterConfig } from "./-components/supplier-filter-config";
import { getSupplierTableColumns } from "./-components/supplier-table-columns";

export const Route = createFileRoute("/_app/supplier/")({
  component: SupplierPage,
  beforeLoad: requirePermission("SUPPLIER", "read"),
  validateSearch: (): SupplierFilters => ({}),
  head: () => ({
    meta: [
      {
        title: "Fornecedores",
      },
    ],
  }),
});

function SupplierPage() {
  const { filters, setFilters, resetFilters } = useFilters(Route.id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<PaginatedData<Supplier>>({
    queryKey: ["suppliers", filters],
    queryFn: () => fetchSuppliers(filters),
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSupplier,
    onMutate: async (supplierId) => {
      await queryClient.cancelQueries({ queryKey: ["suppliers"] });
      const previousData = queryClient.getQueryData(["suppliers", filters]);
      queryClient.setQueryData(["suppliers", filters], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          result: old.result.map((supplier: Supplier) =>
            supplier.id === supplierId
              ? {
                  ...supplier,
                  isActive: false,
                  deletedAt: new Date().toISOString(),
                }
              : supplier
          ),
        };
      });
      return { previousData };
    },
    onError: (_err, _supplierId, context) => {
      queryClient.setQueryData(
        ["suppliers", filters],
        context?.previousData
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });

  const restoreMutation = useMutation({
    mutationFn: restoreSupplier,
    onMutate: async (supplierId) => {
      await queryClient.cancelQueries({ queryKey: ["suppliers"] });
      const previousData = queryClient.getQueryData(["suppliers", filters]);
      queryClient.setQueryData(["suppliers", filters], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          result: old.result.map((supplier: Supplier) =>
            supplier.id === supplierId
              ? {
                  ...supplier,
                  isActive: true,
                  deletedAt: null,
                }
              : supplier
          ),
        };
      });
      return { previousData };
    },
    onError: (_err, _supplierId, context) => {
      queryClient.setQueryData(
        ["suppliers", filters],
        context?.previousData
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });

  function handleEdit(supplierId: number) {
    navigate({
      to: "/supplier/edit",
      search: { id: supplierId.toString() },
    });
  }

  function handleToggleActive(supplierId: number, value: boolean) {
    if (value) {
      restoreMutation.mutate(supplierId);
    } else {
      deleteMutation.mutate(supplierId);
    }
  }

  const columns = useMemo(
    () =>
      getSupplierTableColumns({
        onEdit: handleEdit,
        onToggleActive: handleToggleActive,
      }),
    [deleteMutation, restoreMutation]
  );

  const filterConfig = useMemo(() => getSupplierFilterConfig(), []);

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
          row.original.isActive === false || row.original.deletedAt
            ? "line-through text-muted-foreground"
            : ""
        }
        actionBar={
          <DataTableToolbar table={table}>
            <AddButton to="/supplier/new" />
          </DataTableToolbar>
        }
      />

      <DataTablePagination table={table} isLoading={isLoading} />
    </DataView>
  );
}