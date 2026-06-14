import { useSearch, useNavigate, createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { CreateView } from "@/components/views/create-view";
import { UserForm } from "./-components/user-form";
import { getUserById, updateUser, deleteUser, restoreUser } from "@/api/users";

export const Route = createFileRoute("/_app/user/edit")({
  component: UserEditPage,
  validateSearch: z.object({ id: z.string().min(1) }),
  head: () => ({
    meta: [
      {
        title: "Editar usuário",
      },
    ],
  }),
});

function UserEditPage() {
  const search = useSearch({ from: "/_app/user/edit" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: ["user", search.id],
    queryFn: () => getUserById(Number(search.id)),
    enabled: Boolean(search.id),
  });

  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate({ to: "/user" });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, value }: { id: number; value: boolean }) => {
      if (value) {
        await restoreUser(id);
      } else {
        await deleteUser(id);
      }
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["user", String(id)] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  if (!search.id) {
    return <div>Usuário inválido</div>;
  }

  if (userQuery.isLoading) {
    return <div>Carregando...</div>;
  }

  if (!userQuery.data) {
    return <div>Usuário não encontrado</div>;
  }

  return (
    <CreateView
      formId="user-form"
      recordId={userQuery.data.id}
      logEntity="user"
      active={userQuery.data.isActive}
      onActiveChange={(value) =>
        toggleActiveMutation.mutate({ id: userQuery.data.id, value })
      }
    >
      <UserForm
        initialValues={{
          name: userQuery.data.name,
          email: userQuery.data.email,
          username: userQuery.data.username,
          cpf: userQuery.data.cpf,
          phone: userQuery.data.phone,
        }}
        initialRoleId={userQuery.data.role?.id}
        onSubmit={async (values) => {
          await updateMutation.mutateAsync({
            id: userQuery.data.id,
            ...values,
          });
        }}
      />
    </CreateView>
  );
}
