import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { DataView } from "@/components/views/data-view";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { DataTableFilterMenu } from "@/components/ui/data-table/data-table-filter-menu";
import { Separator } from "@/components/ui/separator";
import { AddButton } from "@/components/button/add-button";

import { useFilters } from "@/hooks/use-filters";
import { useDataTable } from "@/hooks/use-data-table";

import {
  deleteSupplier,
  fetchSuppliers,
  restoreSupplier,
  type Supplier,
  type SupplierFilters,
} from "@/api/supplier";

import { getSupplierFilterConfig } from "./-components/supplier-filter-config";
import { getSupplierTableColumns } from "./-components/supplier-table-columns";

export const Route = createFileRoute("/_app/supplier/")({
  component: SupplierPage,
  validateSearch: (
    search: Record<string, unknown>
  ): SupplierFilters => ({
    pageIndex: search.pageIndex
      ? Number(search.pageIndex)
      : undefined,
    pageSize: search.pageSize
      ? Number(search.pageSize)
      : undefined,
    corporateName: search.corporateName as string | undefined,
    tradeName: search.tradeName as string | undefined,
    cnpj: search.cnpj as string | undefined,
    activeOnly:
      search.activeOnly !== undefined
        ? (String(search.activeOnly) as "true" | "false")
        : "true",
  }),
});

function SupplierPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { filters, setFilters, resetFilters } =
    useFilters(Route.id);

  const queryKey = useMemo(
    () => [
      "suppliers",
      filters.pageIndex,
      filters.pageSize,
      filters.corporateName,
      filters.tradeName,
      filters.cnpj,
      filters.activeOnly,
    ],
    [filters]
  );

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => fetchSuppliers(filters),
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["suppliers"],
      });
    },
  });

  const restoreMutation = useMutation({
    mutationFn: restoreSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["suppliers"],
      });
    },
  });

  function handleEdit(id: number) {
    navigate({
      to: "/supplier/edit",
      search: {
        id: id.toString(),
      },
    });
  }

  function handleToggleActive(
    supplier: Supplier,
    value: boolean
  ) {
    if (value) {
      restoreMutation.mutate(supplier.id);
    } else {
      deleteMutation.mutate(supplier.id);
    }
  }

  const columns = useMemo(
    () =>
      getSupplierTableColumns({
        onEdit: handleEdit,
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

  const filterConfig = useMemo(
    () => getSupplierFilterConfig(),
    []
  );

  return (
    <DataView>
      <DataTableFilterMenu
        filterConfig={filterConfig}
        isLoading={isLoading}
        filters={filters}
        onFilter={(newFilters) =>
          setFilters({
            ...newFilters,
            pageIndex: 0,
          })
        }
        onClearFilters={resetFilters}
      />

      <Separator className="my-4" />

      <DataTable
        table={table}
        isLoading={isLoading}
        getRowClassName={(row) =>
          row.original.deletedAt
            ? "line-through text-muted-foreground"
            : ""
        }
        actionBar={
          <DataTableToolbar table={table}>
            <AddButton to="/supplier/new" />
          </DataTableToolbar>
        }
      />

      <DataTablePagination
        table={table}
        isLoading={isLoading}
      />
    </DataView>
  );
}