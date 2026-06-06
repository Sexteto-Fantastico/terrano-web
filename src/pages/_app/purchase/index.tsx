import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DataTableFilterMenu } from "@/components/ui/data-table/data-table-filter-menu";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { useMemo } from "react";
import {
  fetchPurchases,
  deletePurchase,
  restorePurchase,
  type Purchase,
  type PurchaseFilters,
} from "@/api/purchases";
import { fetchAllSuppliers, type Supplier } from "@/api/suppliers";
import {
  keepPreviousData,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { type PaginatedData } from "@/components/ui/data-table/@types";
import { DataView } from "@/components/views/data-view";
import { useFilters } from "@/hooks/use-filters";
import { DataTable } from "@/components/ui/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { Separator } from "@/components/ui/separator";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";
import { AddButton } from "@/components/button/add-button";
import { getPurchaseTableColumns } from "./-components/purchase-table-columns";
import { getPurchaseFilterConfig } from "./-components/purchase-filter-config";

export const Route = createFileRoute("/_app/purchase/")({
  component: PurchasePage,
  validateSearch: () => ({}) as PurchaseFilters,
  head: () => ({
    meta: [
      {
        title: "Compras",
      },
    ],
  }),
});

function PurchasePage() {
  const { filters, setFilters, resetFilters } = useFilters(Route.id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: suppliers = [] } = useQuery<Supplier[]>({
    queryKey: ["suppliers", "purchase-list"],
    queryFn: () => fetchAllSuppliers(),
  });

  const { data, isLoading } = useQuery<PaginatedData<Purchase>>({
    queryKey: ["purchases", filters],
    queryFn: () => fetchPurchases(filters),
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deletePurchase(id),
    onMutate: async (purchaseId) => {
      await queryClient.cancelQueries({ queryKey: ["purchases", filters] });
      const previousData = queryClient.getQueryData(["purchases", filters]);
      queryClient.setQueryData(["purchases", filters], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          result: old.result.map((purchase: Purchase) =>
            purchase.id === purchaseId
              ? { ...purchase, deletedAt: new Date().toISOString() }
              : purchase
          ),
        };
      });
      return { previousData };
    },
    onError: (_err, _purchaseId, context) => {
      queryClient.setQueryData(["purchases", filters], context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
    },
  });

  const restoreMutation = useMutation({
    mutationFn: (id: number) => restorePurchase(id),
    onMutate: async (purchaseId) => {
      await queryClient.cancelQueries({ queryKey: ["purchases", filters] });
      const previousData = queryClient.getQueryData(["purchases", filters]);
      queryClient.setQueryData(["purchases", filters], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          result: old.result.map((purchase: Purchase) =>
            purchase.id === purchaseId ? { ...purchase, deletedAt: null } : purchase
          ),
        };
      });
      return { previousData };
    },
    onError: (_err, _purchaseId, context) => {
      queryClient.setQueryData(["purchases", filters], context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
    },
  });

  function handleEdit(purchase: Purchase) {
    navigate({
      to: "/purchase/edit",
      search: { id: purchase.id.toString() },
    });
  }

  function handleDelete(purchaseId: number) {
    deleteMutation.mutate(purchaseId);
  }

  function handleToggleActive(purchase: Purchase, checked: boolean) {
    if (checked) {
      restoreMutation.mutate(purchase.id);
    } else {
      deleteMutation.mutate(purchase.id);
    }
  }

  const columns = useMemo(
    () =>
      getPurchaseTableColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        onToggleActive: handleToggleActive,
      }),
    [deleteMutation, restoreMutation]
  );

  const supplierOptions = useMemo(
    () =>
      suppliers.map((supplier) => ({
        label: supplier.tradeName,
        value: String(supplier.id),
      })),
    [suppliers]
  );

  const filterConfig = useMemo(
    () => getPurchaseFilterConfig(supplierOptions),
    [supplierOptions]
  );

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
          row.original.isActive === false ? "line-through text-muted-foreground" : ""
        }
        actionBar={
          <DataTableToolbar table={table}>
            <AddButton to="/purchase/new" />
          </DataTableToolbar>
        }
      />
      <DataTablePagination table={table} isLoading={isLoading} />
    </DataView>
  );
}
