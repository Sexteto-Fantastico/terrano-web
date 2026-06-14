import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { requirePermission } from "@/lib/route-guard";
import { DataTableFilterMenu } from "@/components/ui/data-table/data-table-filter-menu";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { useMemo } from "react";
import {
  fetchUsers,
  deleteUser,
  restoreUser,
  type User,
  type UserFilters,
} from "@/api/users";
import { fetchRoles, type Role } from "@/api/roles";
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
import { ExportButton } from "@/components/button/export-button";
import { getUserTableColumns } from "./-components/user-table-columns";
import { getUserFilterConfig } from "./-components/user-filter-config";

export const Route = createFileRoute("/_app/user/")({
  component: UserPage,
  beforeLoad: requirePermission("USER", "read"),
  validateSearch: () => ({}) as UserFilters,
  head: () => ({
    meta: [
      {
        title: "Usuários",
      },
    ],
  }),
});

function UserPage() {
  const { filters, setFilters, resetFilters } = useFilters(Route.id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: roles } = useQuery({
    queryKey: ["roles"],
    queryFn: () => fetchRoles({}),
  });

  const { data, isLoading } = useQuery<PaginatedData<User>>({
    queryKey: ["users", filters],
    queryFn: () => fetchUsers(filters),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: ["users", filters] });
      const previousData = queryClient.getQueryData(["users", filters]);
      queryClient.setQueryData(["users", filters], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          result: old.result.map((u: User) =>
            u.id === userId ? { ...u, isActive: false } : u
          ),
        };
      });
      return { previousData };
    },
    onError: (_err, _userId, context) => {
      queryClient.setQueryData(["users", filters], context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const restoreMutation = useMutation({
    mutationFn: (id: number) => restoreUser(id),
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: ["users", filters] });
      const previousData = queryClient.getQueryData(["users", filters]);
      queryClient.setQueryData(["users", filters], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          result: old.result.map((u: User) =>
            u.id === userId ? { ...u, isActive: true } : u
          ),
        };
      });
      return { previousData };
    },
    onError: (_err, _userId, context) => {
      queryClient.setQueryData(["users", filters], context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  function handleEdit(userId: number) {
    navigate({
      to: "/user/edit",
      search: { id: userId.toString() },
    });
  }

  function handleDelete(userId: number) {
    deleteMutation.mutate(userId);
  }

  function handleToggleActive(userId: number, value: boolean) {
    if (value) {
      restoreMutation.mutate(userId);
    } else {
      deleteMutation.mutate(userId);
    }
  }

  const columns = useMemo(
    () =>
      getUserTableColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        onToggleActive: handleToggleActive,
      }),
    [deleteMutation, restoreMutation]
  );

  const userFilterConfig = useMemo(
    () => getUserFilterConfig(roles?.result),
    [roles]
  );

  const { table } = useDataTable({
    data,
    columns,
    filters,
    setFilters,
  });

  return (
    <DataView>
      <DataTableFilterMenu
        filterConfig={userFilterConfig}
        isLoading={isLoading}
        filters={filters}
        onFilter={setFilters}
        onClearFilters={resetFilters}
      />

      <Separator className="my-4" />

      <DataTable
        table={table}
        actionBar={
          <DataTableToolbar table={table}>
            <ExportButton />
            <AddButton to="/user/new" />
          </DataTableToolbar>
        }
      />

      <DataTablePagination table={table} isLoading={isLoading} />
    </DataView>
  );
}
