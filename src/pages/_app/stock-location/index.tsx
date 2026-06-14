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
  deleteStockLocation,
  fetchStockLocations,
  restoreStockLocation,
  type StockLocation,
  type StockLocationFilters,
} from "@/api/stock-locations";
import { getStockLocationFilterConfig } from "./-components/stock-location-filter-config";
import { getStockLocationTableColumns } from "./-components/stock-location-table-columns";

export const Route = createFileRoute("/_app/stock-location/")({
  component: StockLocationPage,
  beforeLoad: requirePermission("STOCK_LOCATION", "read"),
  validateSearch: (): StockLocationFilters => ({}),
  head: () => ({
    meta: [
      {
        title: "Estoque",
      },
    ],
  }),
});

function StockLocationPage() {
  const { filters, setFilters, resetFilters } = useFilters(Route.id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<PaginatedData<StockLocation>>({
    queryKey: ["stock-locations", filters],
    queryFn: () => fetchStockLocations(filters),
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStockLocation,
    onMutate: async (stockLocationId) => {
      await queryClient.cancelQueries({ queryKey: ["stock-locations"] });
      const previousData = queryClient.getQueryData(["stock-locations", filters]);
      queryClient.setQueryData(["stock-locations", filters], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          result: old.result.map((stockLocation: StockLocation) =>
            stockLocation.id === stockLocationId
              ? {
                  ...stockLocation,
                  isActive: false,
                  deletedAt: new Date().toISOString(),
                }
              : stockLocation
          ),
        };
      });
      return { previousData };
    },
    onError: (_err, _stockLocationId, context) => {
      queryClient.setQueryData(
        ["stock-locations", filters],
        context?.previousData
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-locations"] });
    },
  });

  const restoreMutation = useMutation({
    mutationFn: restoreStockLocation,
    onMutate: async (stockLocationId) => {
      await queryClient.cancelQueries({ queryKey: ["stock-locations"] });
      const previousData = queryClient.getQueryData(["stock-locations", filters]);
      queryClient.setQueryData(["stock-locations", filters], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          result: old.result.map((stockLocation: StockLocation) =>
            stockLocation.id === stockLocationId
              ? {
                  ...stockLocation,
                  isActive: true,
                  deletedAt: null,
                }
              : stockLocation
          ),
        };
      });
      return { previousData };
    },
    onError: (_err, _stockLocationId, context) => {
      queryClient.setQueryData(
        ["stock-locations", filters],
        context?.previousData
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-locations"] });
    },
  });

  function handleEdit(stockLocationId: number) {
    navigate({
      to: "/stock-location/edit",
      search: { id: stockLocationId.toString() },
    });
  }

  function handleToggleActive(stockLocationId: number, value: boolean) {
    if (value) {
      restoreMutation.mutate(stockLocationId);
    } else {
      deleteMutation.mutate(stockLocationId);
    }
  }

  const columns = useMemo(
    () =>
      getStockLocationTableColumns({
        onEdit: handleEdit,
        onToggleActive: handleToggleActive,
      }),
    [deleteMutation, restoreMutation]
  );

  const filterConfig = useMemo(() => getStockLocationFilterConfig(), []);

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
            <AddButton to="/stock-location/new" />
          </DataTableToolbar>
        }
      />

      <DataTablePagination table={table} isLoading={isLoading} />
    </DataView>
  );
}