import { createFileRoute } from "@tanstack/react-router";
import { DataTableFilterMenu } from "@/components/ui/data-table/data-table-filter-menu";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { useMemo, useState } from "react";
import { fetchMovementExits, deleteMovementExit, type MovementExit, type MovementExitFilters } from "@/api/movement-exit";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataView } from "@/components/views/data-view";
import { useFilters } from "@/hooks/use-filters";
import { DataTable } from "@/components/ui/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { Separator } from "@/components/ui/separator";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";
import { getStockOutTableColumns } from "./-components/stock-out-table-columns";
import { getStockOutFilterConfig } from "./-components/stock-out-filter-config";
import { AddButton } from "@/components/button/add-button";
import { toast } from "sonner";
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

export const Route = createFileRoute("/_app/stock-out/")({
  component: StockOutPage,
  validateSearch: () => ({}) as MovementExitFilters,
  head: () => ({
    meta: [
      {
        title: "Saída de Estoque",
      },
    ],
  }),
});

function StockOutPage() {
  const { filters, setFilters, resetFilters } = useFilters(Route.id);
  const queryClient = useQueryClient();
  const [exitToDelete, setExitToDelete] = useState<MovementExit | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["movement-exits", filters],
    queryFn: () => fetchMovementExits(filters),
    placeholderData: keepPreviousData,
  });

  const columns = useMemo(() => getStockOutTableColumns({
    onToggleActive: async (exit, value) => {
      if (!value) {
        setExitToDelete(exit);
      } else {
        toast.error("A reativação de saída de estoque não é suportada.");
        queryClient.invalidateQueries({ queryKey: ["movement-exits"] });
      }
    }
  }), [queryClient]);

  const filterConfig = useMemo(() => getStockOutFilterConfig(), []);

  const { table } = useDataTable({
    data,
    columns,
    filters: filters as any,
    setFilters: setFilters as any,
  });

  const handleConfirmDelete = async () => {
    if (!exitToDelete) return;
    try {
      await deleteMovementExit(exitToDelete.id);
      toast.success("Saída excluída com sucesso. O saldo foi estornado.");
      queryClient.invalidateQueries({ queryKey: ["movement-exits"] });
    } catch (e) {
      toast.error("Erro ao excluir a saída.");
      queryClient.invalidateQueries({ queryKey: ["movement-exits"] });
    } finally {
      setExitToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setExitToDelete(null);
    queryClient.invalidateQueries({ queryKey: ["movement-exits"] });
  };

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
        actionBar={
          <DataTableToolbar table={table}>
            <AddButton to="/stock-out/new" />
          </DataTableToolbar>
        }
      />

      <DataTablePagination table={table} isLoading={isLoading} />

      <AlertDialog open={!!exitToDelete} onOpenChange={(open) => !open && handleCancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Saída de Estoque</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja excluir esta saída de estoque?
              Esta ação estornará as quantidades de volta para o estoque e não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DataView>
  );
}
