import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { requirePermission } from "@/lib/route-guard";
import { type PaginatedData } from "@/components/ui/data-table/@types";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { useMemo } from "react";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/errors";

import {
  fetchRoles,
  deleteRole,
  restoreRole,
  type Role,
  type RoleFilters,
} from "@/api/roles";

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
import { DataTableFilterMenu } from "@/components/ui/data-table/data-table-filter-menu";
import { AddButton } from "@/components/button/add-button";
import { getAccessProfileFilterConfig } from "./-components/access-profile-filter-config";
import { getAccessProfileTableColumns } from "./-components/access-profile-table-columns";

export const Route = createFileRoute("/_app/access-profile/")({
  component: AccessProfilePage,
  beforeLoad: requirePermission("USER", "read"),
  validateSearch: (): RoleFilters => ({}),
  head: () => ({
    meta: [{ title: "Perfis de Acesso" }],
  }),
});

function AccessProfilePage() {
  const { filters, setFilters, resetFilters } = useFilters(Route.id);
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<PaginatedData<Role>>({
    queryKey: ["roles", filters],
    queryFn: () => fetchRoles(filters),
  });

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteRole(id),
    onMutate: async (roleId) => {
      await queryClient.cancelQueries({ queryKey: ["roles"] });
      const previousData = queryClient.getQueryData(["roles", filters]);
      queryClient.setQueryData(["roles", filters], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          result: old.result.map((r: Role) =>
            r.id === roleId
              ? { ...r, isActive: false }
              : r
          ),
        };
      });
      return { previousData };
    },
    onSuccess: () => {
      toast.success("Perfil de acesso desativado com sucesso!");
    },
    onError: (error, _roleId, context) => {
      queryClient.setQueryData(["roles", filters], context?.previousData);
      toast.error(getApiErrorMessage(error));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });

  const restoreMutation = useMutation({
    mutationFn: (id: number) => restoreRole(id),
    onMutate: async (roleId) => {
      await queryClient.cancelQueries({ queryKey: ["roles"] });
      const previousData = queryClient.getQueryData(["roles", filters]);
      queryClient.setQueryData(["roles", filters], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          result: old.result.map((r: Role) =>
            r.id === roleId
              ? { ...r, isActive: true }
              : r
          ),
        };
      });
      return { previousData };
    },
    onSuccess: () => {
      toast.success("Perfil de acesso ativado com sucesso!");
    },
    onError: (error, _roleId, context) => {
      queryClient.setQueryData(["roles", filters], context?.previousData);
      toast.error(getApiErrorMessage(error));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });

  function handleEdit(roleId: number) {
    navigate({
      to: "/access-profile/edit",
      search: { id: roleId.toString() },
    });
  }

  function handleToggleActive(roleId: number, value: boolean) {
    if (value) {
      restoreMutation.mutate(roleId);
    } else {
      deleteMutation.mutate(roleId);
    }
  }

  const columns = useMemo(
    () =>
      getAccessProfileTableColumns({
        onEdit: handleEdit,
        onToggleActive: handleToggleActive,
      }),
    [deleteMutation, restoreMutation]
  );

  const { table, setTableFilters } = useDataTable({
    data,
    columns,
    filters: filters as any,
    setFilters: setFilters as any,
  });

  const filterConfig = useMemo(() => getAccessProfileFilterConfig(), []);

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
          !row.original.isActive
            ? "line-through text-muted-foreground"
            : ""
        }
        actionBar={
          <DataTableToolbar table={table}>
            <AddButton to="/access-profile/new" />
          </DataTableToolbar>
        }
      />
      <DataTablePagination table={table} />
    </DataView>
  );
}
