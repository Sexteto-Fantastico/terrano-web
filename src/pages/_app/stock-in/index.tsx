import { createFileRoute } from "@tanstack/react-router";
import { DataTableFilterMenu } from "@/components/ui/data-table/data-table-filter-menu";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { useMemo, useState } from "react";
import {
  fetchMovementEntries,
  deleteMovementEntry,
  type MovementEntry,
  type MovementEntryFilters,
} from "@/api/movement-entry";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataView } from "@/components/views/data-view";
import { useFilters } from "@/hooks/use-filters";
import { DataTable } from "@/components/ui/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { Separator } from "@/components/ui/separator";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";
import { AddButton } from "@/components/button/add-button";
import { toast } from "sonner";
import { getMovementEntryTableColumns } from "./-components/movement-entry-table-columns";
import { getMovementEntryFilterConfig } from "./-components/movement-entry-filter-config";
import { fetchStockLocations } from "@/api/stock-locations";
import { fetchAllSuppliers } from "@/api/suppliers";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_app/stock-in/")({
  component: StockInPage,
  validateSearch: () => ({}) as MovementEntryFilters,
  head: () => ({
    meta: [{ title: "Entradas de Estoque" }],
  }),
});

function StockInPage() {
  const { filters, setFilters, resetFilters } = useFilters(Route.id);
  const queryClient = useQueryClient();
  const [entryToDelete, setEntryToDelete] = useState<MovementEntry | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["movement-entries", filters],
    queryFn: () => fetchMovementEntries(filters as MovementEntryFilters),
    placeholderData: keepPreviousData,
  });

  const { data: stockLocationsData } = useQuery({
    queryKey: ["stock-locations"],
    queryFn: () => fetchStockLocations({}),
  });

  const { data: suppliers = [] } = useQuery({
    queryKey: ["suppliers", "stock-in-list"],
    queryFn: () => fetchAllSuppliers(),
  });

  const stockLocationOptions = useMemo(
    () => (stockLocationsData?.result ?? []).map((loc) => ({ label: loc.name, value: String(loc.id) })),
    [stockLocationsData]
  );

  const supplierOptions = useMemo(
    () => suppliers.map((s) => ({ label: s.tradeName, value: String(s.id) })),
    [suppliers]
  );

  const columns = useMemo(
    () =>
      getMovementEntryTableColumns({
        onToggleActive: (entry, value) => {
          if (!value) {
            setEntryToDelete(entry);
          } else {
            toast.error("A reativação de entrada de estoque não é suportada.");
            queryClient.invalidateQueries({ queryKey: ["movement-entries"] });
          }
        },
      }),
    [queryClient]
  );

  const filterConfig = useMemo(
    () => getMovementEntryFilterConfig(stockLocationOptions, supplierOptions),
    [stockLocationOptions, supplierOptions]
  );

  const { table } = useDataTable({
    data,
    columns,
    filters: filters as MovementEntryFilters,
    setFilters: setFilters as (f: MovementEntryFilters) => void,
  });

  async function handleConfirmDelete() {
    if (!entryToDelete) return;
    try {
      await deleteMovementEntry(entryToDelete.id);
      toast.success("Entrada inativada com sucesso. O saldo foi revertido.");
      queryClient.invalidateQueries({ queryKey: ["movement-entries"] });
    } catch (err: any) {
      const message = err?.response?.data?.message ?? "Erro ao inativar a entrada.";
      toast.error(message);
      queryClient.invalidateQueries({ queryKey: ["movement-entries"] });
    } finally {
      setEntryToDelete(null);
    }
  }

  function handleCancelDelete() {
    setEntryToDelete(null);
    queryClient.invalidateQueries({ queryKey: ["movement-entries"] });
  }

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
          row.original.isActive === false ? "line-through text-muted-foreground" : ""
        }
        actionBar={
          <DataTableToolbar table={table}>
            <AddButton to="/stock-in/new" />
          </DataTableToolbar>
        }
      />

      <DataTablePagination table={table} isLoading={isLoading} />

      <AlertDialog
        open={!!entryToDelete}
        onOpenChange={(open) => !open && handleCancelDelete()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Inativar Entrada de Estoque</AlertDialogTitle>
            <AlertDialogDescription>
              Ao inativar esta entrada, o saldo dos produtos será revertido. Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DataView>
  );
}
